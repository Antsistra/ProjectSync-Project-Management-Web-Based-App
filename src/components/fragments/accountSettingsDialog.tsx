import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { IoSettings } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function AccountSettingsDialog() {
  const { toast } = useToast();
  useEffect(() => {
    fillName();
  }, []);
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fillName = async () => {
    const { data, error } = await supabase
      .from("User")
      .select("name, email")
      .eq("supabaseId", localStorage.getItem("id"));
    if (error) {
      console.error(error);
    }

    if (data && data.length > 0) {
      setFullName(data[0].name);
      setEmail(data[0].email);
    }
  };
  const updateName = async () => {
    const { error } = await supabase
      .from("User")
      .update({ name: fullName })
      .eq("supabaseId", localStorage.getItem("id"));
    if (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Name updated successfully",
      });
    }
  };
  const handleSubmit = () => {
    if (fullName === "") {
      toast({
        title: "Error",
        description: "Full name cannot be empty",
        variant: "destructive",
      });
    } else {
      updateName();
    }
    // handleClose();
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full text-start flex items-center p-2 text-sm hover:bg-gray-100"
      >
        <IoSettings className="mr-2" /> Account Settings
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogClose onClick={handleClose} />
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-1"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input id="email" value={email} disabled />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={() => handleSubmit()}
            >
              Change Name
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
