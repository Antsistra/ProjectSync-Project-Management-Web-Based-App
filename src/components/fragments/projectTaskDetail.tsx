import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { format, set } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import TaskNoteDialog from "./taskNoteDialog";

export default function ProjectTaskDetail() {
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState<any>([]);
  const { toast } = useToast();
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [handleBy, setHandleBy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  // const [isOwner, setIsOwner] = useState(false);

  // const { id } = useParams<{ id: string }>();

  const getHandleBy = async () => {
    const { data, error } = await supabase
      .from("User")
      .select("name")
      .eq("supabaseId", localStorage.getItem("id"));
    if (error) {
      console.error(error);
    }
    if (data) {
      setHandleBy(data[0].name);
      console.log(data);
    }
  };
  const handleStartTask = async () => {
    if (!projectDetails) return; // Add null check
    const { data, error } = await supabase
      .from("projectTask")
      .update({ status: "In Progress", handleBy: localStorage.getItem("id") })
      .eq("id", projectDetails.id);
    if (error) {
      console.error(error);
    } else {
      const { data: logData, error: logError } = await supabase
        .from("projectLog")
        .insert({
          projectId: projectDetails.projectId,
          desc: `${projectDetails.title}`,
          type: "Started Task",
          userId: localStorage.getItem("id"),
        });
      if (logError) {
        console.error(logError);
      }
    }

    toast({
      title: "Task Started",
      description: "Task has been started",
    });
    fetchProjectTask();
  };

  const handleDeleteTask = async () => {
    const { data: dataComment, error: errorComment } = await supabase
      .from("projectTaskComment")
      .delete()
      .eq("taskId", projectDetails.id);
    if (errorComment) {
      console.error(errorComment);
    }
    const { data, error } = await supabase
      .from("projectTask")
      .delete()
      .eq("id", projectDetails.id);
    if (error) {
      console.error(error);
    } else {
      const { data, error } = await supabase.from("projectLog").insert({
        projectId: projectDetails.projectId,
        desc: `${projectDetails.title}  From the project.`,
        type: "Delete Task",
        userId: localStorage.getItem("id"),
      });
      if (error) {
        console.error(error);
      }
    }
    toast({
      title: "Task Deleted",
      description: "Task has been deleted",
    });
    window.location.href = "/project/" + projectDetails.projectId;
    fetchProjectTask();
  };

  const handleFinishTask = async () => {
    if (!projectDetails) return; // Add null check
    const { data, error } = await supabase
      .from("projectTask")
      .update({ status: "Done" })
      .eq("id", projectDetails.id);
    if (error) {
      console.error(error);
    } else {
      const { data, error } = await supabase.from("projectLog").insert({
        projectId: projectDetails.projectId,
        desc: `${projectDetails.title}`,
        type: "Finished Task",
        userId: localStorage.getItem("id"),
      });
      if (error) {
        console.error(error);
      }
    }
    toast({
      title: "Task Finished",
      description: "Task has been finished",
    });
    fetchProjectTask();
  };

  useEffect(() => {
    getHandleBy();
    fetchProjectTask();
    fetchComment();
  }, []);

  const { id } = useParams<{ id: string }>();
  const fetchProjectTask = async () => {
    const { data, error } = await supabase
      .from("projectTask")
      .select(
        `
        *,
        assignByUser:User!projectTask_assignBy_fkey(name),
        handleByUser:User!projectTask_handleBy_fkey(name),
        project(owner)
      `
      )
      .eq("id", id);

    if (error) {
      console.error("Error fetching project task:", error);
      return;
    }

    if (data && data.length > 0) {
      console.log(data);
      const projectTask = data[0];

      // Set project details with assignByUser and handleByUser names
      setProjectDetails({
        ...projectTask,
        assignByUser: projectTask.assignByUser?.name || null,
        handleByUser: projectTask.handleByUser?.name || null,
      });

      // Set the owner ID from the related project
      setOwnerId(projectTask.project?.owner || null);
    } else {
      window.location.href = "/dashboard";
    }

    setFadeOut(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleSubmitComment = async () => {
    if (comment === "") return;
    const { data, error } = await supabase.from("projectTaskComment").insert({
      taskId: projectDetails.id,
      userId: localStorage.getItem("id"),
      comment: comment,
    });
    if (error) {
      console.error(error);
    }
    toast({
      title: "Comment Added",
      description: "Comment has been added",
    });
    setComment("");
    fetchComment();
  };

  const fetchComment = async () => {
    const { data, error } = await supabase
      .from("projectTaskComment")
      .select(`* , User(name)`)
      .eq("taskId", id);
    if (error) {
      console.error(error);
    }
    setComment("");
    setAllComments(data);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEE dd/MM/yyyy");
  };

  const getColorFromInitials = (initials: string) => {
    const colors = [
      "bg-red-400",
      "bg-green-400",
      "bg-blue-400",
      "bg-yellow-400",
      "bg-purple-400",
    ];
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  return (
    <div className="container mx-auto p-2 md:p-4">
      {loading ? (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="text-[#3785d8] loading loading-infinity loading-lg"></span>
        </div>
      ) : (
        <div className="transition-opacity duration-500 opacity-100">
          {/* Main content section */}
          <div className=" md:w-2/3 mx-auto">
            {projectDetails ? (
              <>
                <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">
                  {projectDetails.title}
                </h1>
                <div className="bg-white p-3 md:p-4 rounded-lg shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    <div>
                      <h2 className="text-sm md:text-base font-semibold">
                        Created Time
                      </h2>
                      <p className="text-sm md:text-base">
                        {formatDate(projectDetails.created_at)}
                      </p>
                    </div>
                    <div>
                      <h2 className="text-sm md:text-base font-semibold">
                        Status
                      </h2>
                      <p className="text-sm md:text-base">
                        {projectDetails.status}
                      </p>
                    </div>
                    <div>
                      <h2 className="text-sm md:text-base font-semibold">
                        Priority
                      </h2>
                      <p className="text-sm md:text-base">
                        {projectDetails.priority}
                      </p>
                    </div>
                    <div>
                      <h2 className="text-sm md:text-base font-semibold">
                        Deadline
                      </h2>
                      <p className="text-sm md:text-base">
                        {formatDate(projectDetails.deadline)}
                      </p>
                    </div>
                    <div>
                      <h2 className="text-sm md:text-base font-semibold">
                        Assign By
                      </h2>
                      <p className="text-sm md:text-base">
                        {projectDetails.assignByUser || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <h2 className="text-sm md:text-base font-semibold">
                        Handled by
                      </h2>
                      <p className="text-sm md:text-base">
                        {projectDetails.handleByUser || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <h2 className="text-sm md:text-base font-semibold">
                        Difficulty
                      </h2>
                      <p className="text-sm md:text-base">
                        {projectDetails.difficulty}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description section */}
                <div className="mt-3 md:mt-4 bg-white p-3 md:p-4 rounded-lg shadow-md">
                  <h2 className="text-lg md:text-xl font-semibold mb-2">
                    Project Description
                  </h2>
                  <p className="text-sm md:text-base">
                    {projectDetails.description}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col md:flex-row md:justify-end mt-3 md:mt-4 gap-2 md:gap-x-4">
                  {ownerId === localStorage.getItem("id") &&
                    projectDetails.status === "Open" && (
                      <Button onClick={handleDeleteTask}> Delete Task</Button>
                    )}

                  {projectDetails.status === "Open" ? (
                    <Button
                      onClick={handleStartTask}
                      className="w-full md:w-auto"
                    >
                      Start Task
                    </Button>
                  ) : projectDetails.status === "In Progress" ? (
                    projectDetails.handleBy === localStorage.getItem("id") ? (
                      <Button
                        onClick={handleFinishTask}
                        className="w-full md:w-auto"
                      >
                        Finish
                      </Button>
                    ) : (
                      <h1 className="bg-yellow-600 h-9 px-4 py-1 items-center rounded-md text-white font-bold text-center">
                        Project on Handled{" "}
                        {projectDetails.handleByUser
                          .split(" ")
                          .slice(0, 2)
                          .join(" ")}
                      </h1>
                    )
                  ) : projectDetails.status === "Done" ? (
                    <h1 className="bg-teal-600 h-9 px-4 py-1 items-center rounded-md text-white font-bold text-center">
                      Task Finished
                    </h1>
                  ) : null}
                  <TaskNoteDialog
                    trigger={
                      <Button className="w-full md:w-auto">Show Notes</Button>
                    }
                  ></TaskNoteDialog>
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          {/* Comments section */}
          <div className=" md:w-2/3 mx-auto mt-6 md:mt-8">
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
              Comments
            </h2>
            {allComments.map((commentList: any) => {
              const initials = commentList.User?.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .substring(0, 2);
              const bgColor = getColorFromInitials(initials);
              return (
                <div
                  className="flex items-start gap-x-2 md:gap-x-4 mt-3 md:mt-4 bg-white p-3 md:p-4 rounded-lg shadow-md w-full"
                  key={commentList.id}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base`}
                  >
                    <span>{initials}</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-1 md:gap-y-0 w-full">
                      <h3 className="text-xs md:text-sm font-semibold truncate max-w-[200px]">
                        {commentList.User?.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500">
                        {formatDate(commentList.created_at)}
                      </p>
                    </div>
                    <div className="mt-1 w-full overflow-hidden">
                      <p className="text-sm md:text-base break-all md:break-words">
                        {commentList.comment}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comment input section */}
          <div className="w-full md:w-2/3 mx-auto mt-6 md:mt-8">
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
              Enter Your Comment Here
            </h2>
            <Textarea
              className="w-full mb-2 md:mb-4 max-w-full"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <Button className="w-full" onClick={handleSubmitComment}>
              Submit Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
