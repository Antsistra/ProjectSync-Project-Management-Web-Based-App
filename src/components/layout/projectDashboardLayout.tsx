import ProjectJumbotron from "../fragments/projectJumbotron";
import ProjectTaskBoard from "../fragments/projectTaskBoard";
import { Toaster } from "../ui/toaster";

export default function ProjectDashboardLayout() {
  return (
    <>
      <div className="h-full">
        <ProjectJumbotron></ProjectJumbotron>
        <ProjectTaskBoard></ProjectTaskBoard>
        <Toaster></Toaster>
      </div>
    </>
  );
}
