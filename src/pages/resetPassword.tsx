import ResetPasswordForm from "@/components/fragments/resetPasswordForm";
import useHandleSession from "@/hooks/useHandleSession";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const supabaseUrlKey = import.meta.env.VITE_SUPABASE_URL;
  const authTokenKey = `sb-${supabaseUrlKey}-auth-token`;

  const sessionRest = () => {
    const token = localStorage.getItem(authTokenKey);
    if (token === "null" || token === "undefined") {
      Swal.fire({
        title: "Error!",
        text: "Token not found please try again",
        icon: "error",
        confirmButtonText: "Back",
      }).then(() => {
        window.location.href = "/login";
      });
    } else {
      return;
    }
  };

  useEffect(() => {
    sessionRest();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="flex justify-center items-center min-h-screen">
          <ResetPasswordForm />
        </div>
      </div>
    </>
  );
}
