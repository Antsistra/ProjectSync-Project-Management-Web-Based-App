import { Label, Pie, PieChart } from "recharts";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";

const COLORS = [
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#FF4444",
  "#AA00FF",
  "#FF00AA",
];

export function MemberTaskChart() {
  const { id } = useParams<{ id: string }>();
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("userProject")
      .select(`user:userId(name,supabaseId)`)
      .eq("projectId", id);
    if (error) {
      console.log(error);
      return [];
    }
    return data;
  };

  const fetchTaskStats = async (members: any[]) => {
    const { data, error } = await supabase
      .from("projectTask")
      .select(`handleBy, status`)
      .eq("projectId", id);
    if (error) {
      console.log(error);
      return [];
    }

    const taskStats = (data || []).reduce((acc: any, task: any) => {
      const handler = task.handleBy || "Open";
      if (!acc[handler]) {
        acc[handler] = { inProgress: 0, completed: 0, open: 0, total: 0 };
      }
      acc[handler].total += 1;
      if (task.status === "In Progress") {
        acc[handler].inProgress += 1;
      } else if (task.status === "Done") {
        acc[handler].completed += 1;
      } else if (task.status === "Open") {
        acc[handler].open += 1;
      }
      return acc;
    }, {});

    const chartData = members.map((member: any, index: number) => {
      const stats = taskStats[member.user.supabaseId] || {
        inProgress: 0,
        completed: 0,
        open: 0,
        total: 0,
      };
      return {
        name: member.user.name,
        tasks: stats.total,
        fill: COLORS[index % COLORS.length],
      };
    });

    // Add open tasks to chart data
    if (taskStats["Open"]) {
      chartData.push({
        name: "Open",
        tasks: taskStats["Open"].total,
        fill: COLORS[chartData.length % COLORS.length],
      });
    }

    setTotalTasks(chartData.reduce((acc, curr) => acc + curr.tasks, 0));
    setChartData(chartData);
  };

  useEffect(() => {
    const fetchData = async () => {
      const members = await fetchMembers();
      if (members.length > 0) {
        await fetchTaskStats(members);
      }
    };
    fetchData();
  }, [id]);

  const chartConfig = chartData.reduce((acc, curr) => {
    acc[curr.name] = { label: curr.name, color: curr.fill };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Member Contribution</CardTitle>
        <CardDescription>
          {totalTasks} tasks assigned to members
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {totalTasks === 0 ? (
          <div className="text-center font-bold">No Task Available</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="tasks"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalTasks.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Tasks
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Task distribution among members
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total tasks for the project
        </div>
      </CardFooter>
    </Card>
  );
}
