import ProjectTaskDetail from "../fragments/projectTaskDetail";
import { Toaster } from "../ui/toaster";

export default function DetailPageLayout() {
  return (
    <>
      <div className="md:p-8 p-4">
        <ProjectTaskDetail></ProjectTaskDetail>
        <Toaster></Toaster>
      </div>
    </>
  );
}
