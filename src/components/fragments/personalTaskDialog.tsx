import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { format } from "date-fns"; // Import format function
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface PersonalTaskDialogProps {
  open: boolean;
  task: {
    id: number;
    userId: string;
    title: string;
    description: string;
    deadline: any;
    category: string;
    priority: string;
    status: string;
  };
  onClose: () => void;
  fetchTask: () => void;
  fetchTotalTask: () => void;
}

export default function PersonalTaskDialog({
  open,
  task,
  onClose,
  fetchTask,
  fetchTotalTask,
}: PersonalTaskDialogProps) {
  const { toast } = useToast();
  if (!task) return null;

  const getStatusTask = async () => {
    const { data, error } = await supabase
      .from("UserTask")
      .select("status")
      .eq("id", task.id);
    if (error) {
      console.error("Error fetching task:", error);
    }
    if (data) {
      console.log(data);
    }
  };

  const handleStart = async () => {
    const { data, error } = await supabase
      .from("UserTask")
      .select("status")
      .eq("id", task.id);
    if (error) {
      console.error("Error fetching task:", error);
    }
    if (data && data[0].status === "In Progress") {
      toast({
        title: "Task Already Completed",
        description: "Task has been completed already",
        variant: "destructive",
      });
    } else {
      const { data: DataUpdate, error: ErrorUpdate } = await supabase
        .from("UserTask")
        .update({ status: "In Progress" })
        .eq("id", task.id);
      if (ErrorUpdate) {
        console.error("Error updating task:", ErrorUpdate);
      } else {
        toast({
          title: "Task Already Started",
          description: "Task has been started already",
        });
        fetchTask();
        fetchTotalTask();
      }
    }
  };

  const handleComplete = async () => {
    const { data, error } = await supabase
      .from("UserTask")
      .select("status")
      .eq("id", task.id);
    if (error) {
      console.error("Error fetching task:", error);
    }
    if (data && data[0].status === "Completed") {
      toast({
        title: "Task Already Completed",
        description: "Task has been completed already",
        variant: "destructive",
      });
    } else {
      const { data: DataUpdate, error: ErrorUpdate } = await supabase
        .from("UserTask")
        .update({ status: "Completed" })
        .eq("id", task.id);
      if (ErrorUpdate) {
        console.error("Error updating task:", ErrorUpdate);
      } else {
        toast({
          title: "Task Completed",
          description: "Task has been completed successfully",
        });
        fetchTask();
        fetchTotalTask();
      }
    }
  };
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("UserTask")
      .delete()
      .eq("id", task.id);
    if (error) {
      console.error("Error deleting task:", error);
    }
    toast({
      title: "Task Deleted",
      description: "Task has been deleted successfully",
    });
    onClose();
    fetchTask();
    fetchTotalTask();
  };
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-600 pl-4 pr-4  text-center rounded-full font-bold text-white";
      case "Middle":
        return "bg-orange-600 pl-4 pr-4  text-center rounded-full font-bold text-white";
      case "Low":
        return "bg-orange-400 pl-4 pr-4  text-center rounded-full font-bold text-white";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Task Detail</DialogTitle>
          <DialogDescription className="flex flex-col gap-y-2 ">
            <h1 className="font-bold text-xl text-black">{task.title}</h1>
            <p>{task.description}</p>
            <p>Deadline: {format(new Date(task.deadline), "dd/MM/yyyy")}</p>
            <p>Category: {task.category}</p>
            <h1>
              Priority :{" "}
              <span className={getPriorityClass(task.priority)}>
                {task.priority}
              </span>
            </h1>
            <p>Status: {task.status}</p>
          </DialogDescription>
          <div className="md:col-span-2 md:flex flex gap-y-2  flex-col justify-center gap-x-4 pt-4">
            <Button className="" onClick={() => handleStart()}>
              Start 💚
            </Button>
            <Button className="" onClick={() => handleDelete()}>
              Delete 🗑️
            </Button>
            <Button className="" onClick={() => handleComplete()}>
              Finish 🏁
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
