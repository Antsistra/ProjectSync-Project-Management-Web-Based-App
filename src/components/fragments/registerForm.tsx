import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { handleRegister, validateRegisterInput } from "@/utils/authUtils";

interface RegisterFormProps {
  setIsLoading: (isLoading: boolean) => void;
}

export default function RegisterForm({ setIsLoading }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {
    setRole("user");
  });
  const handleInput = async () => {
    if (!validateRegisterInput(name, email, password, role)) return;

    setIsLoading(true);
    await handleRegister(name, email, password, role);
    setIsLoading(false);
  };
  return (
    <>
      <Card className="w-full border-none shadow-none lg:w-[600px]">
        <CardHeader>
          <CardTitle className="text-3xl lg:text-5xl text-center">
            Register Account
          </CardTitle>
          <CardDescription className="text-center lg:text-base">
            Enter your credentials to Create An Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="text-lg">
                  Name
                </Label>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  className="h-10"
                  type="name"
                  id="Name"
                  placeholder="Sebastian Anderson"
                />
              </div>
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="text-lg">
                  Password
                </Label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10"
                  type="password"
                  id="Password"
                  placeholder="********"
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
            <p>Register</p>
          </Button>
          <h3 className="mt-4">
            Have an account?{" "}
            <Link to="/login">
              <a className="font-semibold">Login</a>
            </Link>
          </h3>
        </CardFooter>
      </Card>
    </>
  );
}
