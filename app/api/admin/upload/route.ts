import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/admin-auth";
import { PHOTO_PREFIX } from "@/lib/photos";

/**
 * Issues short-lived upload tokens so the browser can send photographs
 * straight to Blob storage.
 *
 * Routing the file through a Server Action instead would cap uploads at the
 * 1MB action body limit, which a photograph off a phone clears easily. The
 * browser therefore uploads directly and only the resulting URL comes back
 * through the form.
 *
 * The token is the security boundary: it is minted only for a signed-in owner,
 * only for image types, only under the catalogue photo prefix, and only up to
 * 12MB.
 */
export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error("Not signed in.");
        if (!pathname.startsWith(PHOTO_PREFIX)) throw new Error("Bad upload path.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
          maximumSizeInBytes: 12 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      // Nothing to record: the URL comes back to the form, and the catalogue
      // only learns about the photo when the owner saves the product.
      onUploadCompleted: async () => {},
    });
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
