import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";

export default function MemberDialog({ trigger }: any) {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<any>(null);
  const [owner, setOwner] = useState<string | null>(null);
  const fetchMember = async () => {
    const { data, error } = await supabase
      .from("userProject")
      .select(`id,User (supabaseId ,name,email)`)
      .eq("projectId", id);
    if (error) {
      console.error(error);
    }
    setMember(data);
    console.log(data);
  };

  const getOwner = async () => {
    const { data, error } = await supabase
      .from("project")
      .select("owner")
      .eq("id", id)
      .single();
    if (error) {
      console.error(error);
    }
    setOwner(data?.owner);
  };

  const handleKick = async (userId: string) => {
    const { data, error } = await supabase
      .from("userProject")
      .delete()
      .eq("projectId", id)
      .eq("userId", userId);
    if (error) {
      console.error(error);
    } else {
      const { data, error } = await supabase.from("projectLog").insert({
        projectId: id,
        desc: ``,
        type: `Has been kicked from the project`,
        userId: userId,
      });
      if (error) {
        console.error(error);
      }
    }
    fetchMember();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2);
  };

  useEffect(() => {
    fetchMember();
    getOwner();
  }, []);
  return (
    <>
      <Dialog>
        <DialogTrigger className="">{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Member List</DialogTitle>
          </DialogHeader>
          {member?.map((data: any) => (
            <DialogDescription key={data.User.supabaseId}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {getInitials(data.User.name)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold">{data.User.name}</p>
                    <p className="text-sm text-gray-500">{data.User.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {owner === data.User.supabaseId ? (
                    <span className="text-gray-500">Owner</span>
                  ) : (
                    <span className="text-gray-500">Member</span>
                  )}
                  {owner === localStorage.getItem("id") &&
                    owner !== data.User.supabaseId && (
                      <Button onClick={() => handleKick(data.User.supabaseId)}>
                        Kick
                      </Button>
                    )}
                </div>
              </div>
            </DialogDescription>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
