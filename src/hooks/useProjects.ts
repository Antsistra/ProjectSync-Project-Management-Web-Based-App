import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Project {
  id: any;
  title: any;
  icon: any;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListProject = async () => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      setError("User ID not found in localStorage");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("userProject")
      .select(
        `
        project:projectId (
          id,
          title,
          icon
        )
      `
      )
      .eq("userId", userId);

    if (error) {
      setError("Error fetching projects: " + error.message);
      setLoading(false);
      return;
    }

    setProjects(data.flatMap((item) => item.project));
    setLoading(false);
  };

  useEffect(() => {
    fetchListProject();
  }, []);

  return { projects, loading, error, fetchListProject };
};
