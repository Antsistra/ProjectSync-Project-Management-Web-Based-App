import TaskCard from "./taskCard";
import PrivateNotepad from "./privateNotepad";
import { useEffect, useState } from "react";
import { getUserById } from "@/utils/authUtils";
import ProjectCarousel from "./projectCarousel";

export default function DashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      getUserById(id)
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setUser(data[0]);
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        })
        .finally(() => {
          setFadeOut(true);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });
    } else {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, []);

  if (loading) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="loading loading-infinity loading-lg text-white"></span>
      </div>
    );
  }

  return (
    <div className="transition-opacity duration-500 opacity-100">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-3xl font-bold">
          Welcome Back {user ? user.name : "Loading..."}
        </h1>
        <h2 className="text-lg font-light mb-8">
          Monitor all of your project here
        </h2>
      </div>

      <div className="flex flex-1 flex-col gap-4 pr-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="md:col-span-2 ">
            <TaskCard />
          </div>
          <PrivateNotepad />
        </div>
      </div>
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold mt-8">Projects</h1>
        <ProjectCarousel></ProjectCarousel>
      </div>
    </div>
  );
}
