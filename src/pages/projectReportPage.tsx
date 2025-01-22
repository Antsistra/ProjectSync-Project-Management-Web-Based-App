import Footer from "@/components/fragments/footer";
import ProjectReportLayout from "@/components/layout/projectReportLayout";
import { AppSidebar } from "@/components/fragments/appSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function ProjectReportPage() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger className="-ml-1" />
          <ProjectReportLayout />
          <Footer></Footer>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
