import DashboardContent from "../fragments/dashboardContent";
import { Toaster } from "../ui/toaster";

export default function DashboardLayout() {
  return (
    <>
      <div className=" pl-4 md:pl-28 mt-8 h-full">
        <Toaster />
        <DashboardContent />
      </div>
    </>
  );
}
