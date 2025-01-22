import { AppSidebar } from "@/components/fragments/appSidebar";
import Footer from "@/components/fragments/footer";
import ProjectDashboardLayout from "@/components/layout/projectDashboardLayout";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDashboardPage() {
  const { id } = useParams();
  const [projectExists, setProjectExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const checkProject = async () => {
    const { data, error } = await supabase
      .from("project")
      .select("id")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error checking project:", error);
    }
    if (data) {
      setProjectExists(true);
    } else {
      window.location.href = "/dashboard";
    }
    setLoading(false);
    console.log(data);
  };

  const checkUserExists = async () => {
    const { data, error } = await supabase
      .from("userProject")
      .select("userId")
      .eq("projectId", id)
      .eq("userId", localStorage.getItem("id"))
      .single();
    if (error) {
      console.error("Error checking user:", error);
    }
    if (!data) {
      window.location.href = "/dashboard";
    }
    console.log(data);
  };
  useEffect(() => {
    checkProject();
    checkUserExists();
  }, []);
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger className="-ml-1" />
          <ProjectDashboardLayout />
          <Footer></Footer>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
