import React from "react";
import { useSpring, animated } from "@react-spring/web";

const ErrorPage = () => {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  const slideIn = useSpring({
    from: { transform: "translateY(-50px)" },
    to: { transform: "translateY(0)" },
    config: { duration: 500 },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <animated.div style={fadeIn} className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
        <animated.p style={slideIn} className="text-3xl text-gray-700 mb-8">
          Something went wrong.
        </animated.p>
        <animated.div style={fadeIn}>
          <p className="text-xl text-gray-600 mb-4">
            We apologize for the inconvenience. Please try again later.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Go back to homepage
          </a>
        </animated.div>
      </animated.div>
    </div>
  );
};

export default ErrorPage;
