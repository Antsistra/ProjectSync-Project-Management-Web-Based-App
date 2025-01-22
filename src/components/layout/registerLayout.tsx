import RegisterForm from "../fragments/registerForm";
import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
export default function RegisterLayout() {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(40px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 1000 },
  });
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="md:flex justify-center items-center w-1/2 hidden ">
        <div className=" h-screen w-full">
          <animated.div style={fadeIn}>
            <img
              src="/3d-hand.png"
              className="object-cover h-full w-full"
              alt=""
            />
          </animated.div>
        </div>
      </div>
      <div className="flex justify-center items-center md:w-1/2 w-full ">
        <animated.div style={fadeIn}>
          <RegisterForm setIsLoading={setIsLoading}></RegisterForm>
        </animated.div>
      </div>
    </>
  );
}
