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
import { useState } from "react";
import { handleForgotPassword } from "@/utils/authUtils";
import useHandleSession from "@/hooks/useHandleSession";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const handleInput = async () => {
    setLoading(true);
    await handleForgotPassword(email);
    setLoading(false);
  };
  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <span className="loading loading-dots loading-lg text-white"></span>
        </div>
      )}
      <div className="min-h-screen bg-white">
        <div className="flex justify-center items-center min-h-screen">
          <Card className="w-full border-noned shadow-none lg:w-[600px]">
            <CardHeader>
              <CardTitle className="text-3xl lg:text-5xl text-center">
                Forgot Password
              </CardTitle>
              <CardDescription className="text-center lg:text-base">
                Enter your email and we'll send you a link to reset your
                password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name" className="text-lg">
                      Email
                    </Label>
                    <Input
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10"
                      type="email"
                      id="Email"
                      placeholder="sebastian123@mail.com"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col justify-center">
              <Button
                className="w-full h-12 rounded-full text-lg"
                onClick={() => handleInput()}
              >
                <p>Submit</p>
              </Button>
              <h3 className="mt-4">
                Remember your password?
                <Link to="/login">
                  <a className="font-semibold"> Login</a>
                </Link>
              </h3>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
