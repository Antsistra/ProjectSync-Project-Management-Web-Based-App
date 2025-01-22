import { AppSidebar } from "@/components/fragments/appSidebar";
import Footer from "@/components/fragments/footer";
import DashboardLayout from "@/components/layout/dashboardLayout";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import useHandleSession from "@/hooks/useHandleSession";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function DashboardPage() {
  const userId = localStorage.getItem("id");
  const checkSession = async () => {
    if (!userId) {
      window.location.href = "/login";
    }
    const { data, error } = await supabase
      .from("User")
      .select("id")
      .eq("supabaseId", userId);
    if (error) {
      console.error(error);
    }
    if (!data || data.length === 0) {
      window.location.href = "/login";
    }
  };
  useEffect(() => {
    checkSession();
  }, []);
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger className="-ml-1" />
          <DashboardLayout />
          <Footer></Footer>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
