import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
export default function PinDialog({
  pin,
  trigger,
}: {
  pin: string;
  trigger: React.ReactNode;
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(pin);
    toast({
      title: "Pin Copied to clipboard",
    });
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitation Pin</DialogTitle>
        </DialogHeader>
        <h1 className="text-2xl font-bold text-black text-center"> {pin}</h1>
        <Button onClick={() => handleCopy()}>Copy</Button>
      </DialogContent>
    </Dialog>
  );
}
