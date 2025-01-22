import { Pie, PieChart, Cell, Label } from "recharts";

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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";

export default function ProjectProgressChart() {
  const { id } = useParams<{ id: string }>();
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  const fetchTaskStats = async () => {
    const { data, error } = await supabase
      .from("projectTask")
      .select(`status`)
      .eq("projectId", id);
    if (error) {
      console.log(error);
      return [];
    }

    const total = data.length;
    const completed = data.filter((task: any) => task.status === "Done").length;

    setTotalTasks(total);
    setCompletedTasks(completed);

    const progress = (completed / total) * 100;

    setChartData([
      { name: "Completed", value: completed },
      { name: "Remaining", value: total - completed },
    ]);
  };

  useEffect(() => {
    fetchTaskStats();
  }, [id]);

  const COLORS = ["#00C49F", "#FF8042"];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Project Progress</CardTitle>
        <CardDescription>Percentage of project completion</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {totalTasks === 0 ? (
          <div className="text-center font-bold">
            No Task Available, Please Add some Task
          </div>
        ) : (
          <ChartContainer
            className="mx-auto aspect-square max-h-[250px]"
            config={
              {
                /* your config here */
              }
            }
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
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
                            {((completedTasks / totalTasks) * 100).toFixed(2)}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Completed
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
          Project completion progress
        </div>
        <div className="leading-none text-muted-foreground">
          Showing the percentage of completed tasks
        </div>
      </CardFooter>
    </Card>
  );
}
