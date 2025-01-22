import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddTaskDialog from "./addTaskDialog";
import PersonalTaskDialog from "./personalTaskDialog"; // Import PersonalTaskDialog
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns"; // Import format and differenceInDays functions

export default function TaskCard() {
  interface Task {
    id: number;
    userId: string;
    title: string;
    description: string;
    deadline: any;
    category: string;
    priority: string;
    status: string;
  }

  const [taskArray, setTaskArray] = useState<Task[]>([]);
  const [taskObject, setTaskObject] = useState<{ [key: number]: Task }>({});
  const [totalTask, setTotalTask] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [completed, setCompleted] = useState<number>(0);
  const [totalProject, setTotalProject] = useState<number>(0);

  const fetchCompletedTask = async () => {
    const { count, error } = await supabase
      .from("UserTask")
      .select("*", { count: "exact" })
      .eq("userId", localStorage.getItem("id"))
      .eq("status", "Completed");
    if (error) {
      console.error("Error fetching completed task:", error);
    }
    if (count) {
      setCompleted(count);
    }
  };
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

  const fetchTask = async () => {
    const { data, error } = await supabase
      .from("UserTask")
      .select("*")
      .eq("userId", localStorage.getItem("id"));
    if (error) {
      console.log(error);
    } else {
      setTaskArray(data);
      const taskObj = data.reduce(
        (acc: { [key: number]: Task }, task: Task) => {
          acc[task.id] = task;
          return acc;
        },
        {}
      );
      setTaskObject(taskObj);
    }
  };

  const fetchTotalProject = async () => {
    const { count, data, error } = await supabase
      .from("userProject")
      .select("*", { count: "exact" })
      .eq("userId", localStorage.getItem("id"));
    if (error) {
      console.error("Error fetching total project:", error);
    }
    if (count !== null) {
      setTotalProject(count);
    }
  };

  useEffect(() => {
    fetchTask();
    fetchTotalTask();
    fetchCompletedTask();
    fetchTotalProject();
  }, []);

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-600  text-center rounded-xl md:rounded-full font-semibold ";
      case "Middle":
        return "bg-orange-600  text-center rounded-xl md:rounded-full font-semibold ";
      case "Low":
        return "bg-orange-400 text-center rounded-xl md:rounded-full font-semibold ";
      default:
        return "";
    }
  };

  const getDaysLeft = (deadline: any) => {
    const daysLeft = differenceInDays(new Date(deadline), new Date());
    if (daysLeft > 1) {
      return `${daysLeft} days left`;
    } else if (daysLeft === 1) {
      return "1 day left";
    } else if (daysLeft === 0) {
      return "Due today";
    } else {
      return "Overdue";
    }
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 pr-4 pb-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card className="">
            <CardHeader>
              <CardTitle className="text-2xl">Total Project</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold">
              <p>{totalProject}</p>
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
              <p>{completed}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <h1 className="text-2xl font-bold">Assigned Task</h1>
            <AddTaskDialog
              fetchTask={fetchTask}
              fetchTotalTask={fetchTotalTask}
            />
          </CardTitle>
          <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="border-separate border-spacing-y-3  ">
            <TableHeader>
              <TableRow>
                <TableHead className="">Deadline</TableHead>
                <TableHead>Task</TableHead>

                <TableHead className="text-center">Priority</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="cursor-pointer">
              {Object.values(taskObject).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No Task Assigned, Let's add one!
                  </TableCell>
                </TableRow>
              ) : (
                Object.values(taskObject)
                  .sort(
                    (a, b) =>
                      new Date(a.deadline).getTime() -
                      new Date(b.deadline).getTime()
                  ) // Sort by closest deadline
                  .slice(0, 5) // Menampilkan maksimal 5 task
                  .map((task) => (
                    <TableRow
                      key={task.id}
                      onClick={() => handleRowClick(task)}
                    >
                      <TableCell>{getDaysLeft(task.deadline)}</TableCell>
                      <TableCell className="truncate md:max-w-[200px] max-w-[70px]">
                        {task.title}
                      </TableCell>

                      <TableCell className={getPriorityClass(task.priority)}>
                        {task.priority}
                      </TableCell>
                      <TableCell className="text-right turncate">
                        {task.status}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="justify-end">
          <Link to="/my-task">
            <Button> Show More</Button>
          </Link>
        </CardFooter>
      </Card>
      {selectedTask && (
        <PersonalTaskDialog
          fetchTotalTask={fetchTotalTask}
          fetchTask={fetchTask}
          open={openDialog}
          task={selectedTask}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}
