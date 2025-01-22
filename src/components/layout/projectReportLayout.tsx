import { useEffect, useState } from "react";
import LogTable from "../fragments/logTable";
import MemberContribution from "../fragments/memberContribution";
import { Toaster } from "../ui/toaster";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { MemberTaskChart } from "../fragments/memberTaskChart";
import ProjectProgressChart from "../fragments/projectProgressChart";

export default function ProjectReportLayout() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const fetchProject = async () => {
    const { data, error } = await supabase
      .from("project")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.log(error);
    }
    setProject(data);
  };

  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <div className=" px-4 md:px-28 mt-8 h-full">
      <h1 className="text-2xl font-bold mb-8">
        {project ? project.title : "Loading..."}
      </h1>
      <div className="flex md:flex-row flex-col gap-x-4 gap-y-4">
        <div className="flex md:w-4/6 ">
          <MemberContribution></MemberContribution>
        </div>
        <div className="md:flex">
          <MemberTaskChart></MemberTaskChart>
        </div>
        <div className="md:flex">
          <ProjectProgressChart></ProjectProgressChart>
        </div>
      </div>
      <div>
        <LogTable></LogTable>
      </div>
      <Toaster />
    </div>
  );
}
