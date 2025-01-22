import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { IoSettings } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function UpdatePasswordDialog() {
  const { toast } = useToast();

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) {
        toast({
          title: "Error updating password",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password updated successfully",
          description: "Your password has been updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const validatePassword = () => {
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure the passwords match",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        <IoSettings className="mr-2" /> Update Password
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogClose onClick={handleClose} />
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="text" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                type="password"
                id="newPassword"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="text" className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              onClick={() => handleChangePassword()}
            >
              Change Password
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
