import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function TaskNoteDialog({ trigger }: any) {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const updateNotes = async () => {
    const { data, error } = await supabase
      .from("projectTaskNote")
      .select("*")
      .eq("projectTaskId", id);
    if (error) {
      console.error(error);
    }
    if (!data || data.length === 0 || data[0].id === "") {
      const createNotes = await supabase.from("projectTaskNote").insert([
        {
          projectTaskId: id,
          note: notes,
        },
      ]);
      if (createNotes.error) {
        toast({
          title: "Error",
          description: "Failed to create note",
          variant: "destructive",
        });
      }
      toast({
        title: "Success",
        description: "Note created successfully",
      });
    } else {
      const updatesNote = await supabase
        .from("projectTaskNote")
        .update({ note: notes })
        .eq("projectTaskId", id);
      if (updatesNote.error) {
        toast({
          title: "Error",
          description: "Failed to update note",
          variant: "destructive",
        });
      }
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    }
  };

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("projectTaskNote")
      .select("*")
      .eq("projectTaskId", id);
    if (error) {
      console.error(error);
    }
    if (data && data.length > 0) {
      setNotes(data[0].note);
    }
  };
  // }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger>{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Notes</DialogTitle>
            <DialogDescription>
              Add notes to this task to keep track of important information.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            className="h-40"
            onChange={(e) => setNotes(e.target.value)}
            value={notes}
          />
          <Button onClick={() => updateNotes()}>Save Note</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
