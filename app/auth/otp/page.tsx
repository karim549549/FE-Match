import { Suspense } from "react";
import { OtpForm } from "@/components/auth/otp/otp-form";

function OtpFormWrapper() {
  return <OtpForm />;
}

export default function OtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpFormWrapper />
    </Suspense>
  );
}
