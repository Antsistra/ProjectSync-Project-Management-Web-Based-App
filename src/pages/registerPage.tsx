import RegisterLayout from "@/components/layout/registerLayout";
import useHandleSession from "@/hooks/useHandleSession";

export default function RegisterPage() {
  useHandleSession();
  return (
    <div className="flex min-h-screen">
      <RegisterLayout></RegisterLayout>
    </div>
  );
}
