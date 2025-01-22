import { Button } from "@/components/ui/button";
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
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface JoinProjectDialogProps {
  fetchProjects: () => void;
}

export default function JoinProjectDialog({
  fetchProjects,
}: JoinProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  const handleJoin = async () => {
    const { data: projectId, error } = await supabase
      .from("project")
      .select("id")
      .eq("pin", pin);
    if (error) {
      console.log(error);
    }
    if (!projectId || projectId.length === 0) {
      toast({
        title: "Project Not Found",
        description: "Project with the given pin not found",
        variant: "destructive",
      });
    }
    if (projectId && projectId.length > 0) {
      const { data: userProject, error: userProjectError } = await supabase
        .from("userProject")
        .select("*")
        .eq("userId", localStorage.getItem("id"))
        .eq("projectId", projectId[0].id);
      if (userProjectError) {
        console.log(userProjectError);
      }
      if (userProject && userProject.length > 0) {
        toast({
          title: "Error Joining Project",
          description: "You have already joined the project",
          variant: "destructive",
        });
      } else {
        const { data, error } = await supabase.from("userProject").insert({
          userId: localStorage.getItem("id"),
          projectId: projectId[0].id,
        });
        if (error) {
          console.log(error);
        }
        const { data: logData, error: logError } = await supabase
          .from("projectLog")
          .insert({
            projectId: projectId[0].id,
            desc: `the project.`,
            type: "Joined",
            userId: localStorage.getItem("id"),
          });
        if (logError) {
          console.error("Error adding log:", logError);
          return;
        }
        toast({
          title: "Project Joined",
          description: "You have joined the project successfully",
        });

        fetchProjects();
        setIsOpen(false);
      }
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="">
            Join Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Project</DialogTitle>
            <DialogDescription>You can join a project here</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-2 justify-center items-center">
            <Label htmlFor="pin" className="text-">
              Project Pin
            </Label>
            <Input
              onChange={(e) => setPin(e.target.value)}
              id="pin"
              placeholder="1234"
              className="col-span-3 text-center"
              maxLength={4}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              onClick={() => handleJoin()}
            >
              Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
