import { LoginForm } from "../fragments/loginForm";
import useHandleSession from "@/hooks/useHandleSession";
import { useSpring, animated } from "@react-spring/web";

export default function LoginLayout() {
  useHandleSession();

  const fadeInLeft = useSpring({
    from: { opacity: 0, transform: "translateX(-20%)" },
    to: { opacity: 1, transform: "translateX(0)" },
    config: { duration: 1000 },
  });

  const fadeInRight = useSpring({
    from: { opacity: 0, transform: "translateX(100%)" },
    to: { opacity: 1, transform: "translateX(0)" },
    config: { duration: 1000 },
  });

  return (
    <div className="flex w-full h-screen">
      <animated.div
        style={fadeInLeft}
        className="md:flex justify-center items-center w-1/2 hidden"
      >
        <div className="h-full w-full">
          <img src="/3d-smartphone.png" alt="" className="" />
        </div>
      </animated.div>
      <animated.div className="flex justify-center items-center md:w-1/2 w-full">
        <LoginForm />
      </animated.div>
    </div>
  );
}
