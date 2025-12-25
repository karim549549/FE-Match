import { RegisterBranding } from "@/components/auth/register/register-branding";
import { RegisterFormContainer } from "@/components/auth/register/register-form-container";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 h-screen w-full relative bg-background-dark overflow-hidden font-display">
      <RegisterBranding isExpanded={false} />
      <RegisterFormContainer isExpanded={false} />
    </div>
  );
}
