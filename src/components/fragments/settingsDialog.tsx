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

export default function AccountSettingsDialog() {
  const getDetails = async () => {
    const { data, error } = await supabase
      .from("User")
      .select("name")
      .eq("supabaseId", localStorage.getItem("id"));
    if (error) {
      console.error(error);
    }
    console.log(data);
  };
  useEffect(() => {
    getDetails();
  }, []);
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
    handleClose();
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
            <DialogTitle>Settings</DialogTitle>
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
              <Input id="email" value="user@example.com" disabled />
            </div>
            <Button type="submit" className="w-full">
              Change Name
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
