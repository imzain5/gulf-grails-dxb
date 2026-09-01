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
 * **Nothing here touches the pixels.** The file is streamed to storage exactly
 * as it came off the camera — no resizing, no re-encoding, no stripping. The
 * stored original is the master copy; what a customer sees is a derivative
 * generated from it at full quality (see `images.qualities` in next.config.ts),
 * so raising or changing how the site renders later costs nothing and loses
 * nothing.
 *
 * The token is the security boundary: it is minted only for a signed-in owner,
 * only for image types the web can actually display, only under the catalogue
 * photo prefix, and only up to the ceiling below.
 */

/**
 * Generous enough for a full-resolution frame off a real camera — a 45MP RAW
 * export or an uncompressed PNG — because the point is that nobody has to
 * shrink a photo before listing a pair.
 */
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

/**
 * Formats every browser can render. HEIC is deliberately absent: an iPhone
 * shoots it by default, Safari displays it and Chrome does not, so storing one
 * would leave most visitors looking at a broken image. iOS converts to JPEG on
 * its own when a photo is picked through the camera roll; the form catches the
 * cases where it doesn't and says what to change.
 */
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
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
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
          // Every upload gets a unique URL, so its bytes can never change.
          cacheControlMaxAge: 31536000,
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
