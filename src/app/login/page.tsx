import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { env, hasGoogleAuth } from "@/lib/env";

export const metadata = { title: "Đăng nhập", robots: { index: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;

  let redirectUrl = sp.callbackUrl ?? "/dashboard";
  try {
    const url = new URL(redirectUrl, env.NEXT_PUBLIC_SITE_URL);
    redirectUrl = url.pathname + url.search;
  } catch {
    // ignore
  }

  if (session?.user) redirect(redirectUrl);

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold mb-1 text-center">Đăng nhập</h1>
      <p className="text-secondary-token text-sm text-center mb-8">
        Đăng nhập để xem đơn hàng, thư viện và mã giới thiệu của bạn.
      </p>

      {hasGoogleAuth ? (
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: sp.callbackUrl ?? "/dashboard" });
          }}
        >
          <button type="submit" className="btn btn-secondary w-full">
            Đăng nhập với Google
          </button>
        </form>
      ) : (
        <div className="surface-card p-4 text-sm text-secondary-token text-center">
          Vui lòng sử dụng form đăng nhập Admin bên dưới.
        </div>
      )}

      <div className="my-6 flex items-center gap-3 text-xs text-muted-token">
        <div className="flex-1 border-t border-token" /> hoặc <div className="flex-1 border-t border-token" />
      </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            const email = String(formData.get("email") ?? "");
            const password = String(formData.get("password") ?? "");
            await signIn("dev", { email, password, redirectTo: "/admin" });
          }}
          className="surface-card p-4 flex flex-col gap-3"
        >
          <p className="text-xs text-muted-token">Đăng nhập tài khoản Admin (Email & Mật khẩu).</p>
          <input name="email" type="email" placeholder="Email của bạn" required className="input-token" />
          <input name="password" type="password" placeholder="Mật khẩu" required className="input-token" />
          <button type="submit" className="btn btn-primary">Đăng nhập</button>
        </form>
    </div>
  );
}

