import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import PinDialog from "./pinDialog";
import ProjectSettings from "./projectSettings";
import MemberDialog from "./memberDialog";
import { Button } from "../ui/button";
import { format, differenceInDays } from "date-fns";
import { useSpring, animated } from "@react-spring/web";

export default function ProjectJumbotron() {
  const fadeInUp = useSpring({
    from: { opacity: 0, transform: "translateY(20%)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 1500, easing: (t) => t * (2 - t) },
    delay: 800,
  });
  const imgBaseUrl = import.meta.env.VITE_SUPABASE_IMG_BASE_URL;
  const { id } = useParams();
  interface Project {
    id: string;
    title: string;
    desc: string;
    icon?: string;
    created_at: string;
    deadline?: string;
    pin?: string;
  }
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleExitProject = async () => {
    const { error } = await supabase
      .from("userProject")
      .delete()
      .eq("userId", localStorage.getItem("id"))
      .eq("projectId", id);
    if (error) {
      console.error("Error exiting project:", error);
    }

    window.location.href = "/dashboard";
  };
  const getUserRole = async () => {
    const { data, error } = await supabase
      .from("project")
      .select("*")
      .eq("id", id)
      .eq("owner", localStorage.getItem("id"))
      .single();
    if (error) {
      console.error("Error fetching user role:", error);
    }
    if (data) {
      setIsOwner(true);
    }
  };

  const fetchProject = async () => {
    if (!id) {
      console.error("No project ID found in URL");
      return;
    }

    const { data, error } = await supabase
      .from("project")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      return;
    }

    setProject(data);
    setFadeOut(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getDaysLeft = (deadline: string) => {
    const daysLeft = differenceInDays(new Date(deadline), new Date());
    if (daysLeft > 1) {
      return `${daysLeft} days left`;
    } else if (daysLeft === 1) {
      return "1 day left";
    } else if (daysLeft === 0) {
      return "Due today";
    } else {
      return "Overdue";
    }
  };

  useEffect(() => {
    fetchProject();
    getUserRole();
  }, [id]);

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

  if (!project) {
    return <p>Project not found</p>;
  }

  return (
    <>
      <animated.div style={fadeInUp}>
        <div className="md:ml-4 md:mr-4 bg-slate-200 md:p-6 pb-6 pr-4 pl-4 pt-4 rounded-lg">
          {/* Card Header with Gradient */}
          <div className="w-full p-6 rounded-lg bg-gradient-to-r from-pink-500 via-purple-400 to-blue-300">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <img
                  className="w-10 h-10 rounded-full"
                  src={`${imgBaseUrl}${project.icon}`}
                  alt={project.title || "Project Icon"}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Title */}
                <div className="text-white">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-sm opacity-90">{project.desc}</p>
                </div>

                {/* Timestamps */}
                <div className="mt-4 flex gap-8 text-sm text-white/90">
                  <div>
                    <p className="uppercase text-xs opacity-70 mb-1">CREATED</p>
                    <p>
                      {format(new Date(project.created_at), "EEE MM/dd/yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase text-xs opacity-70 mb-1">
                      DEADLINE
                    </p>
                    <p>
                      {project.deadline
                        ? getDaysLeft(project.deadline)
                        : "No deadline"}
                    </p>
                  </div>
                </div>

                {isOwner ? (
                  <div className="flex justify-end mt-4 md:mt-0 gap-x-4">
                    <PinDialog
                      pin={project.pin || ""}
                      trigger={<Button>Reveal Pin</Button>}
                    />

                    <ProjectSettings
                      project={project}
                      onUpdate={fetchProject}
                      trigger={<Button>Project Settings</Button>}
                    />
                  </div>
                ) : (
                  <div className="flex justify-end mt-4 md:mt-0 gap-x-4">
                    <Button onClick={() => handleExitProject()}>
                      Exit Project
                    </Button>
                    <PinDialog
                      trigger={<Button>Reveal Pin</Button>}
                      pin={project.pin || ""}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="mt-4 space-y-4">
            {/* Created At */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs">🕒</span>
              </div>
              <span className="text-sm text-gray-600">Created At</span>
              <span className="text-sm text-gray-800">
                {format(new Date(project.created_at), "EEE MM/dd/yyyy")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs">🫂</span>
              </div>
              <span className="text-sm text-gray-600">Member</span>
              <MemberDialog
                trigger={<Button>Show Member </Button>}
              ></MemberDialog>
            </div>
          </div>
        </div>
      </animated.div>
    </>
  );
}
