import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { addDays, format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function AddProjectTaskDialog({
  fetchProjectTask,
  trigger,
}: {
  fetchProjectTask: () => void;
  trigger: any;
}) {
  const { id } = useParams();
  const [title, setTitle] = React.useState<string>("");
  const [desc, setDesc] = React.useState<string>("");
  const [difficulty, setDifficulty] = React.useState<string>("");
  const [priority, setPriority] = React.useState<string>("");
  const [date, setDate] = React.useState<Date>();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const validateInput = () => {
    if (!title) {
      throw new Error("Please enter a title.");
    }
    if (!desc) {
      throw new Error("Please enter a description.");
    }
    if (!date) {
      throw new Error("Please enter a deadline.");
    }
    if (!difficulty) {
      throw new Error("Please select a difficulty.");
    }
    if (!priority) {
      throw new Error("Please select a priority.");
    }
    if (date < new Date()) {
      throw new Error("The deadline cannot be in the past.");
    }
  };
  const handleAddTask = async () => {
    try {
      validateInput();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
      return;
    }
    const { data, error } = await supabase.from("projectTask").insert({
      title: title,
      description: desc,
      difficulty: difficulty,
      priority: priority,
      deadline: date,
      projectId: id,
      status: "Open",
      assignBy: localStorage.getItem("id"),
    });
    if (error) {
      console.error("Error adding task:", error);
      return;
    } else {
      const { data: logData, error: logError } = await supabase
        .from("projectLog")
        .insert({
          projectId: id,
          desc: `${title}  to the project Task.`,
          type: "Add Task",
          userId: localStorage.getItem("id"),
        });
      if (logError) {
        console.error("Error adding log:", logError);
        return;
      }
    }
    toast({
      title: "Task Added",
      description: "Task has been added to the project board.",
    });
    fetchProjectTask();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="">{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task </DialogTitle>
          <DialogDescription>
            Add a new task to the project board.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="Title">Title</Label>
          <Input
            type="text"
            id="title"
            placeholder="Lorem Ipsum"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="Title">Description</Label>
          <Textarea
            placeholder="Describe your task here"
            onChange={(e) => setDesc(e.target.value)}
          ></Textarea>
        </div>
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="Title">Difficulty</Label>
          <Select onValueChange={(value) => setDifficulty(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="Title">Priority</Label>
          <Select onValueChange={(value) => setPriority(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Middle">Middle</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="Title">Deadline</Label>
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
        </div>
        <Button onClick={() => handleAddTask()}>Add Task</Button>
      </DialogContent>
    </Dialog>
  );
}
