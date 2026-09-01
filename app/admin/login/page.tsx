import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="ad-login">
      <div className="ad-login-box">
        <div className="ad-mark" style={{ marginBottom: 18 }}>
          Gulf Grails <span>Stockroom</span>
        </div>

        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <div className="ad-note">
            <h3>No password is set yet</h3>
            <p>
              Add an <code>ADMIN_PASSWORD</code> environment variable to this project in the
              Vercel dashboard, then redeploy. Until then nobody can sign in — including you.
            </p>
            <p>Pick something long. It is the only thing standing between the internet and your inventory.</p>
          </div>
        )}
      </div>
    </div>
  );
}
