import React, { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import AddProjectTaskDialog from "./addProjectTaskDialog";
import { supabase } from "@/lib/supabase";
import { Link, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import ImportantNotes from "./importantNotes";
import { useTrail, animated } from "@react-spring/web";

interface TaskCardProps {
  id: string;
  title: string;
  tags: { name: string; color: string }[];
  assignBy: string;
  priority: string;
  difficulty: string;
}

const getInitials = (name: string) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return initials.toUpperCase();
};

const getRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  assignBy,
  priority,
  difficulty,
}) => {
  return (
    <a href={`/project/task/${id}`}>
      <div className="bg-white p-4 rounded-lg border border-gray-100 mt-4">
        {/* Tags */}

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-800 mb-3">{title}</h3>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {assignBy ? (
              <div
                className={`w-6 h-6 ${getRandomColor()} rounded-full flex items-center justify-center`}
              >
                <span className="text-xs text-white">
                  {getInitials(assignBy)}
                </span>
              </div>
            ) : (
              <></>
            )}

            <span className="text-xs text-gray-500">{assignBy}</span>
          </div>
          <div className="gap-x-4 flex">
            <span
              className={`rounded-full px-2 py-0.5 
          ${priority === "High" ? "bg-orange-50 text-orange-600" : ""}
          ${priority === "Low" ? "bg-yellow-50 text-yellow-600" : ""}
          ${priority === "Very High" ? "bg-red-50 text-red-600" : ""}
        `}
            >
              {priority}
            </span>
            <span
              className={`rounded-full px-2 py-0. ${
                difficulty === "Easy" ? "bg-orange-50 text-orange-600" : ""
              }
              ${difficulty === "Medium" ? "bg-orange-50 text-orange-600" : ""}
              ${difficulty === "Hard" ? "bg-orange-50 text-orange-600" : ""}`}
            >
              {difficulty}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

interface Task {
  id: string;
  title: string;
  tags: { name: string; color: string }[];
  assignBy: string;
  priority: string;
  difficulty: string;
  User?: { name: string };
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  count: number;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  status,
  count,
}) => {
  const trail = useTrail(tasks.length, {
    from: { opacity: 0, transform: "translate3d(0,40px,0)" },
    to: { opacity: 1, transform: "translate3d(0,0px,0)" },
  });

  return (
    <div className="w-full md:min-w-[280px] md:flex-1  ">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-2 h-2 rounded-full
            ${status === "open" ? "bg-gray-400" : ""}
            ${status === "progress" ? "bg-blue-400" : ""}
            ${status === "done" ? "bg-green-400" : ""}
          `}
          ></div>
          <h2 className="font-medium text-gray-700">{title}</h2>
          <span className="text-xs text-gray-500">({count})</span>
        </div>
        <button className="p-1">
          <MoreHorizontal size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Tasks Container */}
      <div className="space-y-3 ">
        {trail.map((style, index) => (
          <animated.div key={tasks[index].id} style={style}>
            <TaskCard
              {...tasks[index]}
              assignBy={tasks[index].User?.name || "Unassigned"}
            />
          </animated.div>
        ))}
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const [selectedStatus, setSelectedStatus] = useState("open");

  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  const [tasks, setTasks] = useState<{
    open: Task[];
    inProgress: Task[];
    done: Task[];
  }>({
    open: [],
    inProgress: [],
    done: [],
  });

  const getCurrentTasks = () => {
    switch (selectedStatus) {
      case "open":
        return {
          title: "Open",
          tasks: tasks.open,
          status: "open",
          count: tasks.open.length,
        };
      case "progress":
        return {
          title: "In Progress",
          tasks: tasks.inProgress,
          status: "progress",
          count: tasks.inProgress.length,
        };
      case "done":
        return {
          title: "Done",
          tasks: tasks.done,
          status: "done",
          count: tasks.done.length,
        };
      default:
        return {
          title: "Open",
          tasks: tasks.open,
          status: "open",
          count: tasks.open.length,
        };
    }
  };

  const { id } = useParams();
  const fetchProjectTask = async () => {
    const { data, error } = await supabase
      .from("projectTask")
      .select(`*,User!projectTask_assignBy_fkey(name)`)
      .eq("projectId", id);
    if (error) {
      console.error("Error fetching project tasks:", error);
    }
    if (data) {
      console.log(data[6]?.User?.name);
    }
    const openTasks = data?.filter((task) => task.status === "Open") || [];
    const inProgressTasks =
      data?.filter((task) => task.status === "In Progress") || [];
    const doneTasks = data?.filter((task) => task.status === "Done") || [];
    setTasks({
      open: openTasks,
      inProgress: inProgressTasks,
      done: doneTasks,
    });
  };
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const getUserRole = async () => {
    const { data, error } = await supabase
      .from("project")
      .select("*")
      .eq("id", id)
      .eq("owner", localStorage.getItem("id"))
      .single();
    if (error) {
      console.error("Error fetching user role:", error);
    }
    if (data) {
      setIsOwner(true);
    }
  };

  useEffect(() => {
    getUserRole();
    fetchProjectTask();
  }, []);
  return (
    <>
      <div className="w-full p-6">
        <AddProjectTaskDialog
          fetchProjectTask={fetchProjectTask}
          trigger={<Button>Add Task</Button>}
        ></AddProjectTaskDialog>
        <ImportantNotes
          trigger={<Button className="ml-4">Important Notes</Button>}
        ></ImportantNotes>
        {isOwner ? (
          <Link to={`/project/report/${id}`}>
            <Button className="md:ml-4 mt-4 md:mt-0">Project Stats</Button>
          </Link>
        ) : (
          <></>
        )}
        {/* Mobile Status Selector */}

        <div className="md:hidden mb-4 mt-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile View - Single Column */}
        <a href={`/project/${id}`}>
          <div className="md:hidden">
            <TaskColumn {...getCurrentTasks()} />
          </div>
        </a>

        {/* Desktop View - Three Columns */}
        <div className="hidden md:flex md:flex-row gap-6 mt-8">
          <TaskColumn
            title="Open"
            tasks={tasks.open}
            status="open"
            count={tasks.open.length}
          />

          <TaskColumn
            title="In Progress"
            tasks={tasks.inProgress}
            status="progress"
            count={tasks.inProgress.length}
          />
          <TaskColumn
            title="Done"
            tasks={tasks.done}
            status="done"
            count={tasks.done.length}
          />
        </div>
      </div>
    </>
  );
};

export default TaskBoard;
