import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
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
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDays, format } from "date-fns";
import { Calendar } from "../ui/calendar";

interface CreateProjectDialogProps {
  fetchProjects: () => void;
}

export default function CreateProjectDialog({
  fetchProjects,
}: CreateProjectDialogProps) {
  const [date, setDate] = useState<Date>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const clearState = () => {
    setTitle("");
    setDescription("");
    setDate(undefined);
    setImage(null);
    setCroppedImage(null);
    setIsLoading(false);
  };
  const validateInput = () => {
    if (!title) {
      throw new Error("Please enter a title.");
    }
    if (!description) {
      throw new Error("Please enter a description.");
    }
    if (!date) {
      throw new Error("Please enter a deadline.");
    }
    if (!image) {
      throw new Error("Please upload an image.");
    }
    if (date && new Date() > date) {
      throw new Error("The deadline cannot be in the past.");
    }
  };
  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setIsCropping(true);
    }
  };

  const handleCrop = async () => {
    if (image && croppedArea) {
      const croppedImg = await getCroppedImg(image, croppedArea);
      setCroppedImage(croppedImg);
      setIsCropping(false);
    }
  };

  const randomFileName = () => Math.random().toString(36).substring(2);

  const generatePin = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 4 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  const handleCreate = async () => {
    try {
      validateInput();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
      return;
    }
    setIsLoading(true);
    const file = croppedImage
      ? await fetch(croppedImage).then((res) => res.blob())
      : null;

    if (file) {
      const { data, error } = await supabase.storage
        .from("project-icon")
        .upload(`${randomFileName()}.jpg`, file);
      if (error) console.log(error);

      const { data: projectData, error: projectError } = await supabase
        .from("project")
        .insert({
          title,
          desc: description,
          deadline: date,
          icon: data?.path,
          pin: generatePin(),
          owner: localStorage.getItem("id"),
        })
        .select("id");
      if (projectError) console.log(projectError);

      const { data: userProjectData, error: userProjectError } = await supabase
        .from("userProject")
        .insert({
          userId: localStorage.getItem("id"),
          projectId: projectData?.[0].id,
        });
      if (userProjectError) console.log(userProjectError);

      // Fetch projects and close dialog
      fetchProjects();
      toast({
        title: "Project Created",
        description: "Project has been created successfully",
      });
      setIsOpen(false);
      clearState();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            Create Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              You can create new Project here
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
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                    />
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="picture" className="text-right">
                Image
              </Label>
              <Input
                id="picture"
                type="file"
                accept=".jpg,.jpeg,.png"
                className="col-span-3 text-sm"
                onChange={handleFileChange}
              />
            </div>
            {isCropping && image && (
              <div className="relative h-64 w-full">
                <Cropper
                  image={URL.createObjectURL(image)}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
                <Button
                  onClick={handleCrop}
                  className="absolute top-2 right-2 z-10"
                >
                  Crop
                </Button>
              </div>
            )}
            {croppedImage && (
              <div className="my-4">
                <img
                  src={croppedImage}
                  alt="Cropped"
                  className="w-32 h-32 object-cover"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" onClick={handleCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
