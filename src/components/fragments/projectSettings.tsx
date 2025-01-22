// projectSettings.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useCallback, useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { addDays, format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { supabase } from "@/lib/supabase";

interface ProjectSettingsProps {
  project: {
    id: string;
    title: string;
    desc: string;
    deadline?: string;
  };
  trigger: React.ReactNode;
  onUpdate: () => void;
}

export default function ProjectSettings({
  project,
  onUpdate,
  trigger,
}: ProjectSettingsProps) {
  const [date, setDate] = useState<Date | undefined>(
    project.deadline ? new Date(project.deadline) : undefined
  );
  const [title, setTitle] = useState<string>(project.title);
  const [description, setDescription] = useState<string>(project.desc);

  const { toast } = useToast();
  const validateEdit = () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a title for the project.",
      });
      return false;
    }
    if (!description) {
      toast({
        title: "Error",
        description: "Please enter a description for the project.",
        variant: "destructive",
      });
      return false;
    }
    if (!date) {
      toast({
        title: "Error",
        description: "Please enter a deadline for the project.",
        variant: "destructive",
      });
      return false;
    }
    if (date < new Date()) {
      toast({
        title: "Error",
        description: "Deadline cannot be in the past.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("userProject")
      .delete()
      .match({ projectId: project.id });
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    const { data: data2, error: error2 } = await supabase
      .from("project")
      .delete()
      .match({ id: project.id });
    if (error2) {
      toast({
        title: "Error",
        description: error2.message,
        variant: "destructive",
      });
    }
    toast({
      title: "Project Deleted",
      description: "The project has been deleted.",
    });
    window.location.href = "/dashboard";
  };
  useEffect(() => {
    setTitle(project.title);
    setDescription(project.desc);
    setDate(project.deadline ? new Date(project.deadline) : undefined);
  }, [project]);

  const handleUpdate = async () => {
    if (!validateEdit()) return;
    const { data, error } = await supabase
      .from("project")
      .update({
        title,
        desc: description,
        deadline: date,
      })
      .match({ id: project.id });
    if (error) {
      toast({
        title: "Error",
        description: error.message,
      });
      return;
    } else {
      const { data, error } = await supabase.from("projectLog").insert({
        projectId: project.id,
        userId: localStorage.getItem("id"),
        desc: `The project details`,
        type: `Update`,
      });
      if (error) {
        console.error(error);
      }
    }
    toast({
      title: "Project Updated",
      description: "The project has been updated.",
    });
    onUpdate();
  };

  return (
    <Dialog>
      <DialogTrigger className="">{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Update the project settings here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Project Title
            </Label>
            <Input
              onChange={(e) => setTitle(e.target.value)}
              id="name"
              placeholder="Lorem ipsum"
              className="col-span-3"
              value={title}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Deadline" className="text-right">
              Deadline
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="flex w-auto flex-col space-y-2 p-2"
              >
                <Select
                  onValueChange={(value) =>
                    setDate(addDays(new Date(), parseInt(value)))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="0">Today</SelectItem>
                    <SelectItem value="1">Tomorrow</SelectItem>
                    <SelectItem value="3">In 3 days</SelectItem>
                    <SelectItem value="7">In a week</SelectItem>
                  </SelectContent>
                </Select>
                <div className="rounded-md border">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </div>
              </PopoverContent>
            </Popover>
          </div>{" "}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Project Description
            </Label>
            <Input
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              className="col-span-3"
              placeholder="lorem ipsum dolor sit amet"
              value={description}
            />
          </div>
        </div>
        <Button onClick={() => handleUpdate()}>Edit 📝</Button>
        <Button onClick={() => handleDelete()}>Delete 📝</Button>
      </DialogContent>
    </Dialog>
  );
}
