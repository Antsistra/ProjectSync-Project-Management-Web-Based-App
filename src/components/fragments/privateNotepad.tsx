import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function PrivateNotepad() {
  const [note, setNote] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  useEffect(() => {
    const fetchNote = async () => {
      const { data, error } = await supabase
        .from("notepad")
        .select("note")
        .eq("userId", localStorage.getItem("id"));
      if (error) {
        console.log(error);
      } else {
        if (data && data.length > 0) {
          setNotes(data[0].note);
          setNote(data[0].note); // Set initial note value
        }
      }
    };
    fetchNote();
  }, []);

  const handleInputNote = async () => {
    try {
      const { data, error } = await supabase
        .from("notepad")
        .select("note")
        .eq("userId", localStorage.getItem("id"));
      if (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "An error occurred while fetching note",
        });
        return;
      }
      if (data && data.length > 0) {
        const { error } = await supabase
          .from("notepad")
          .update({
            note: note,
          })
          .eq("userId", localStorage.getItem("id"));
        if (error) {
          console.log(error);
          toast({
            title: "Error",
            description: "An error occurred while updating note",
          });
        } else {
          toast({
            title: "Note Updated",
            description: "Note has been updated successfully",
          });
          setNotes(note);
        }
      } else {
        const { error } = await supabase.from("notepad").insert([
          {
            userId: localStorage.getItem("id"),
            note: note,
          },
        ]);
        if (error) {
          console.log(error);
          toast({
            title: "Error",
            description: "An error occurred while creating note",
          });
        } else {
          toast({
            title: "Note Created",
            description: "Note has been created successfully",
          });
          setNotes(note);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing note",
      });
    }
  };

  return (
    <>
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Private Notepad</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={note}
            className="h-36"
            placeholder="Empty Notepad. :("
            onChange={(e) => setNote(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => handleInputNote()}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
