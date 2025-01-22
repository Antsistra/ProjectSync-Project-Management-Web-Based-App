import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function SummaryCard() {
  const [totalTask, setTotalTask] = useState<number>(0);
  const fetchTotalTask = async () => {
    const { count, error } = await supabase
      .from("UserTask")
      .select("*", { count: "exact" })
      .eq("userId", localStorage.getItem("id"));
    if (error) {
      console.error("Error fetching total task:", error);
    }
    if (count) {
      setTotalTask(count);
    }
  };
  useEffect(() => {
    fetchTotalTask();
  }, []);
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 pr-4 pb-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card className="">
            <CardHeader>
              <CardTitle className="text-2xl">Total Project</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold">
              <p>2</p>
            </CardContent>
          </Card>
          <Card className="">
            <CardHeader>
              <CardTitle className="text-2xl">Total Task</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold">
              <p>{totalTask}</p>
            </CardContent>
          </Card>
          <Card className="">
            <CardHeader>
              <CardTitle className="text-2xl">Completed Task</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold">
              <p>2</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
