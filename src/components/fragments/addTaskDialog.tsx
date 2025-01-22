import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addDays, format, isBefore } from "date-fns"; // Import isBefore function
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { supabase } from "@/lib/supabase";
import { Textarea } from "../ui/textarea";

interface AddTaskDialogProps {
  fetchTask: () => void;
  fetchTotalTask: () => void;
}

export default function AddTaskDialog({
  fetchTask,
  fetchTotalTask,
}: AddTaskDialogProps) {
  const [title, setTitle] = React.useState<string>("");
  const supabaseId = localStorage.getItem("id");
  const [priority, setPriority] = React.useState<string>("");
  const [date, setDate] = React.useState<Date>();
  const [desc, setDesc] = React.useState<string>("");
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const clearState = () => {
    setTitle("");
    setPriority("");
    setDate(undefined);
    setDesc("");
  };
  const validateDate = (date: Date) => {
    if (isBefore(date, new Date())) {
      throw new Error("The deadline cannot be in the past.");
    }
  };

  const validateInput = () => {
    if (!title) {
      throw new Error("Please enter a title.");
    }
    if (!desc) {
      throw new Error("Please enter a description.");
    }
    if (!priority) {
      throw new Error("Please select a priority.");
    }
  };

  const handleInput = async () => {
    setIsLoading(true);
    try {
      validateInput();
      if (date) {
        validateDate(date);
      } else {
        throw new Error("Please select a date.");
      }
      const { error } = await supabase.from("UserTask").insert({
        userId: supabaseId,
        title: title,
        deadline: date,
        description: desc,
        category: "Personal",
        priority: priority,
        status: "Not Started",
      });
      if (error) {
      } else {
        toast({
          title: "Task Added",
          description: "Task has been added successfully",
        });
        clearState(); // Clear the input
        setIsOpen(false); // Close the dialog
        fetchTask(); // Fetch tasks again to update the table
        fetchTotalTask(); // Fetch total tasks again to update the counter
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <span className="loading loading-dots loading-lg text-white"></span>
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum,
              dolor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input
                onChange={(e) => setTitle(e.target.value)}
                id="name"
                className="col-span-3"
                placeholder="Task Title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Description
              </Label>
              <Textarea
                placeholder="Type your message here."
                className="col-span-3"
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Date
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
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Priority
              </Label>
              <Select onValueChange={(value) => setPriority(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Middle">Middle</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                handleInput();
              }}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
