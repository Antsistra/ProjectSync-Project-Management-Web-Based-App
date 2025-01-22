import { AppSidebar } from "@/components/fragments/appSidebar";
import Footer from "@/components/fragments/footer";
import DetailPageLayout from "@/components/layout/detailPageLayout";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function TaskDetailPage() {
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger className="-ml-1" />
        <DetailPageLayout></DetailPageLayout>
        <Footer></Footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
