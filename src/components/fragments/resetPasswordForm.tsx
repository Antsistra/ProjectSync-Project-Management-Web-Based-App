import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  validateResetPasswordInput,
  handleResetPassword,
} from "@/utils/authUtils";
import Swal from "sweetalert2";
export default function ResetPasswordForm() {
  const supabaseUrlKey = import.meta.env.VITE_SUPABASE_URL;

  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [password, setPassword] = useState("");
  const handleInput = async () => {
    const token = localStorage.getItem(
      `sb-${supabaseUrlKey}-auth-token`
    );
    if (!token) {
      Swal.fire({
        title: "Error!",
        text: "Token not found please try again",
        icon: "error",
        confirmButtonText: "Back",
      }).then(() => {
        window.location.href = "/login";
      });
      return;
    }
    if (
      !validateResetPasswordInput(password, confirmPassword)
    ) {
      return;
    }
    await handleResetPassword(password);
  };


  useEffect (() => {
  }, [])

  return (
    <>
      <Card className="w-full border-none shadow-none lg:w-[600px]">
        <CardHeader>
          <CardTitle className="text-3xl lg:text-5xl text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center lg:text-base">
            Enter your email and password to reset your
            password to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="text-lg">
                  Password
                </Label>
                <Input
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="h-10"
                  type="password"
                  id="password"
                  placeholder="*********"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="text-lg">
                  Confirm Password
                </Label>
                <Input
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="h-10"
                  type="password"
                  id="password"
                  placeholder="*********"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center">
          <Button
            className="w-full h-12 rounded-full text-lg"
            onClick={() => handleInput()}>
            <p>Reset</p>
          </Button>
          <h3 className="mt-4">
            Remember your password?
            <Link to="/login">
              <a className="font-semibold"> Login</a>
            </Link>
          </h3>
        </CardFooter>
      </Card>
    </>
  );
}
