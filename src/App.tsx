import { useEffect } from "react";
import { useSpring, animated, config, useScroll } from "@react-spring/web";
import {
  ArrowRight,
  CheckCircle2,
  BarChart2,
  Users2,
  Boxes,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Zap,
  Target,
  Clock,
  Shield,
  BarChart,
  WandSparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";

export default function App() {
  const [{ scrollY }, setScrollY] = useSpring(() => ({ scrollY: 0 }));
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY.start({ scrollY: window.scrollY });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollY]);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  const parallaxCards = useSpring({
    from: { transform: "translateY(100px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
    delay: 300,
    config: config.gentle,
  });

  const backgroundParallax = useSpring({
    transform: scrollY.to((y) => `translateY(${y * 0.5}px)`),
  });

  const vectorParallax1 = useSpring({
    from: { transform: "translate3d(0,0px,0) rotate(0deg)" },
    to: async (next) => {
      while (true) {
        await next({ transform: "translate3d(20px,20px,0) rotate(5deg)" });
        await next({ transform: "translate3d(0px,0px,0) rotate(0deg)" });
      }
    },
    config: { duration: 4000 },
    loop: true,
  });

  const vectorParallax2 = useSpring({
    from: { transform: "translate3d(0,0px,0) rotate(0deg)" },
    to: async (next) => {
      while (true) {
        await next({ transform: "translate3d(-20px,20px,0) rotate(-5deg)" });
        await next({ transform: "translate3d(0px,0px,0) rotate(0deg)" });
      }
    },
    config: { duration: 3500 },
    loop: true,
  });

  const floatingAnimation = useSpring({
    from: { transform: "translateY(0px)" },
    to: async (next) => {
      while (true) {
        await next({ transform: "translateY(20px)" });
        await next({ transform: "translateY(0px)" });
      }
    },
    config: { duration: 2000 },
    loop: true,
  });

  const features = [
    {
      icon: <BarChart2 className="w-6 h-6 text-[#3785d8]" />,
      title: "Planning & Tracking",
      description: "Plan, track, and manage your projects with ease",
    },
    {
      icon: <Users2 className="w-6 h-6 text-[#3785d8]" />,
      title: "Team Collaboration",
      description: "Seamless communication and task management for teams",
    },
    {
      icon: <Boxes className="w-6 h-6 text-[#3785d8]" />,
      title: "Easy to Use",
      description: "Simple and intuitive interface for better productivity",
    },
  ];

  const developers = [
    {
      name: "Yulianingsih",
      role: "Developer",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah&accessories[]&accessoriesProbability=0&clothesColor=25557c,262e33,3c4f5c,5199e4,929598,a7ffc4,b1e2ff,e6e6e6,ff488e,ff5c5c,ffafb9,ffffff,65c9ff,ffffb1&clothing=hoodie&eyebrows=default,defaultNatural&eyes=closed,cry,default,eyeRoll,happy,hearts,side,squint&facialHair[]&facialHairColor[]&facialHairProbability=0&hairColor=2c1b18&mouth=smile,twinkle,default&skinColor=ffdbb4&top=hijab,shortRound,shortWaved",
      social: {
        instagram: "https://www.instagram.com/yuliansh__/",
      },
    },
    {
      name: "Hadi Nur Muhammad",
      role: "Lead Developer",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Oliver&accessoriesProbability=100&clothesColor=25557c,262e33,3c4f5c,5199e4,929598,a7ffc4,b1e2ff,e6e6e6,ff488e,ff5c5c,ffafb9,ffffff,65c9ff,ffffb1&clothing=hoodie&eyebrows=default,defaultNatural,flatNatural,frownNatural&facialHair[]&facialHairColor[]&facialHairProbability=0&hairColor=2c1b18&mouth=smile,twinkle,default",
      social: {
        github: "https://www.github.com/Antsistra",
        instagram: "https://www.instagram.com/hadinmd_/",
      },
    },
    {
      name: "Ucu Sukaya",
      role: "Developer",
      image:
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Katherine&accessories[]&accessoriesProbability=0&clothesColor=25557c,262e33,3c4f5c,5199e4,929598,a7ffc4,b1e2ff,e6e6e6,ff488e,ff5c5c,ffafb9,ffffff,65c9ff,ffffb1&clothing=hoodie&eyebrows=default,defaultNatural&eyes=closed,cry,default,eyeRoll,happy,hearts,side,squint&facialHair[]&facialHairColor[]&facialHairProbability=0&hairColor=2c1b18&mouth=smile,twinkle,default&skinColor=614335,ae5d29,d08b5b,fd9841,ffdbb4,edb98a",
      social: {
        instagram: "https://www.instagram.com/jvple_/",
      },
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-8 h-8 text-[#3785d8]" />,
      title: "Increased Productivity",
      description: "Boost your team's efficiency with streamlined workflows",
    },
    {
      icon: <Target className="w-8 h-8 text-[#3785d8]" />,
      title: "Goal Achievement",
      description: "Track and accomplish project milestones effectively",
    },
    {
      icon: <Clock className="w-8 h-8 text-[#3785d8]" />,
      title: "Time Management",
      description: "Optimize resource allocation and meet deadlines",
    },
    {
      icon: <WandSparkles className="w-8 h-8 text-[#3785d8]" />,
      title: "User-friendly interface",
      description: "Intuitive design for easy navigation and usability",
    },
    {
      icon: <BarChart className="w-8 h-8 text-[#3785d8]" />,
      title: "Customizable workflows",
      description: "Adapt the platform to suit your team's unique needs",
    },
    {
      icon: <Users2 className="w-8 h-8 text-[#3785d8]" />,
      title: "Team Synergy",
      description: "Foster collaboration and team communication",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">
              Project<span className="text-[#3785d8]">Sync</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button className="bg-[#3785d8]">Sign in</Button>
            </Link>
          </div>
        </nav>

        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Animated Gradient Blobs */}
            <animated.div
              style={backgroundParallax}
              className="absolute inset-0"
            >
              <div className="absolute top-20 left-10 w-72 h-72 bg-[#3785d8]/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-[#3785d8]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </animated.div>

            {/* Animated Vector Elements */}
            <animated.div
              style={vectorParallax1}
              className="absolute top-20 right-[20%]"
            >
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="#3785d8"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  className="animate-spin"
                  style={{ animationDuration: "20s" }}
                />
                <circle
                  cx="100"
                  cy="100"
                  r="40"
                  stroke="#3785d8"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  className="animate-spin"
                  style={{
                    animationDuration: "15s",
                    animationDirection: "reverse",
                  }}
                />
              </svg>
            </animated.div>

            <animated.div
              style={vectorParallax2}
              className="absolute bottom-40 left-[15%]"
            >
              <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                <rect
                  x="30"
                  y="30"
                  width="100"
                  height="100"
                  stroke="#3785d8"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  className="animate-spin"
                  style={{ animationDuration: "25s" }}
                />
                <rect
                  x="50"
                  y="50"
                  width="60"
                  height="60"
                  stroke="#3785d8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="animate-spin"
                  style={{
                    animationDuration: "18s",
                    animationDirection: "reverse",
                  }}
                />
              </svg>
            </animated.div>

            {/* Floating Dots Grid */}
            <animated.div
              style={floatingAnimation}
              className="absolute inset-0"
            >
              <div className="grid grid-cols-12 gap-8 p-8 opacity-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#3785d8]"
                    style={{
                      animation: `pulse 2s infinite ${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </animated.div>

            {/* Rotating Circles */}
            <animated.div
              style={{
                transform: scrollYProgress.to(
                  (val) => `rotate(${val * 360}deg)`
                ),
              }}
              className="absolute top-1/4 right-1/4 w-64 h-64 border-8 border-[#3785d8]/10 rounded-full"
            >
              <div
                className="absolute inset-0 border-4 border-[#3785d8]/5 rounded-full animate-spin"
                style={{ animationDuration: "15s" }}
              ></div>
              <div
                className="absolute inset-8 border-4 border-[#3785d8]/5 rounded-full animate-spin"
                style={{
                  animationDuration: "10s",
                  animationDirection: "reverse",
                }}
              ></div>
            </animated.div>
          </div>

          {/* Add a subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none"></div>

          {/* Hero Section */}
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
              <animated.div style={fadeIn} className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Project Management
                </h1>
                <h2 className="text-4xl md:text-5xl font-bold text-[#3785d8] mb-6">
                  Sync Your Team, Elevate your goals
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Streamline your workflow, boost productivity, and deliver
                  projects on time with ProjectSync's powerful management tools.
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/register">
                    <button className="bg-[#3785d8] hover:bg-[#3785d8]-dark text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transform transition hover:scale-105">
                      Get Started <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </animated.div>

              {/* Features Grid */}
              <animated.div
                style={parallaxCards}
                className="mt-24 grid md:grid-cols-3 gap-8"
              >
                {features.map((feature, index) => (
                  <animated.div
                    key={index}
                    style={{
                      transform: scrollYProgress.to(
                        (val) => `translateY(${(1 - val) * 50 * (index + 1)}px)`
                      ),
                    }}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="bg-[#3785d8]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </animated.div>
                ))}
              </animated.div>
            </div>
          </div>

          {/* Benefits Section */}

          {/* Team Section */}
          <div className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[#3785d8] mb-4">
                  Meet Our Team
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  The brilliant minds behind ProjectSync
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                {developers.map((developer, index) => (
                  <animated.div
                    key={index}
                    style={{
                      transform: scrollYProgress.to(
                        (val) => `translateY(${(1 - val) * 50 * (index + 1)}px)`
                      ),
                    }}
                    className="text-center"
                  >
                    <div className="relative group">
                      <div className="relative w-48 h-48 mx-auto mb-6">
                        <img
                          src={developer.image}
                          alt={developer.name}
                          className="rounded-full bg-white p-2 shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-full bg-[#3785d8]/10 transform scale-0 group-hover:scale-105 transition-transform"></div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {developer.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{developer.role}</p>
                      <div className="flex justify-center space-x-4 ">
                        {developer.social.github && (
                          <a
                            href={developer.social.github}
                            className="text-gray-600 hover:text-[#3785d8] transition-colors hover:cursor-pointer"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {developer.social.instagram && (
                          <a
                            href={developer.social.instagram}
                            className="text-gray-600 hover:text-[#3785d8] transition-colors hover:cursor-pointer"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </animated.div>
                ))}
              </div>
            </div>
          </div>
          <animated.div
            style={parallaxCards}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose ProjectSync?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the advantages of modern simple project management
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <animated.div
                  key={index}
                  style={{
                    transform: scrollYProgress.to(
                      (val) => `translateY(${(1 - val) * 30 * (index % 3)}px)`
                    ),
                  }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="bg-[#3785d8]/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </animated.div>
              ))}
            </div>
          </animated.div>
          {/* Footer */}
        </div>
        <footer className="bg-slate-800 text-white mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">ProjectSync</h3>
                <p className="text-gray-400">
                  Sync your team, elevate your goals
                </p>
              </div>
            </div>

            <div className="border-t border-gray-800  mt-12 pt-8 text-center text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} ProjectSync. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
