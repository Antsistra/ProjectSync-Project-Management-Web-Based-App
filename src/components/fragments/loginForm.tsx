import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSpring, animated } from "@react-spring/web";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleLogin, validateInput } from "@/utils/authUtils";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(40px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 1000 },
  });

  const handleInput = async () => {
    setIsLoading(true);
    if (validateInput(email, password)) {
      handleLogin(email, password);
    }
    setIsLoading(false);
  };
  return (
    <>
      <animated.div style={fadeIn}>
        <Card className="w-full border-none shadow-none lg:w-[600px]">
          <h1 className="flex items-end justify-end">
            <Link to="/">
              <IoArrowBackCircleSharp size={40} />
            </Link>
          </h1>
          <CardHeader>
            <CardTitle className="text-4xl lg:text-5xl text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center lg:text-base">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="text-lg">
                    Email
                  </Label>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10"
                    type="email"
                    id="email"
                    placeholder="sebastian123@mail.com"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="text-lg">
                    Password
                  </Label>
                  <Input
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10"
                    type="password"
                    id="password"
                    placeholder="********"
                  />
                </div>
              </div>
            </form>
            <div className="flex justify-end mt-6">
              <Link to="/forgot-password">
                <p className="font-semibold">Forgot Password?</p>
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col justify-center">
            <Button
              className="w-full h-12 rounded-full text-lg"
              onClick={() => handleInput()}
            >
              Login
            </Button>
            <h3 className="mt-4">
              Don't have an account?{" "}
              <Link to="/register">
                <a className="font-semibold">Register</a>
              </Link>
            </h3>
          </CardFooter>
        </Card>
      </animated.div>
    </>
  );
}
