import { LoginFooter } from "@/components/auth/login/login-footer";
import { LoginNavbar } from "@/components/auth/login/login-navbar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 h-screen w-full max-w-full relative bg-background-dark overflow-hidden font-display">
      <LoginNavbar />
      {children}
      <LoginFooter />
    </div>
  );
}
