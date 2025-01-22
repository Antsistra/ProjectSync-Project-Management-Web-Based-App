import { AppSidebar } from "@/components/fragments/appSidebar";
import Footer from "@/components/fragments/footer";
import MyTaskLayout from "@/components/layout/myTaskLayout";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function MyTaskPage() {
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
        <MyTaskLayout></MyTaskLayout>
        <Toaster></Toaster>
        <Footer></Footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
