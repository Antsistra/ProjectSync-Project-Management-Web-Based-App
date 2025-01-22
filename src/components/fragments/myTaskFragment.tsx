import { useEffect, useState } from "react";
import { Input } from "../ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { differenceInDays } from "date-fns"; // Import differenceInDays function
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MyTaskAdd from "./myTaskAdd";

export default function MyTaskFragment() {
  const id = localStorage.getItem("id");
  const [name, setName] = useState(null);
  const [task, setTask] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [filterStatus, setFilterStatus] = useState("none");

  const fetchTask = async () => {
    const { data, error } = await supabase
      .from("UserTask")
      .select(`* , User(name)`)
      .eq("userId", id);
    if (error) {
      console.error(error);
    }
    if (data) {
      setName(data[0]?.User?.name);
      setTask(data);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const filteredTasks = task
    ?.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      filterStatus !== "none"
        ? item.status.toLowerCase() === filterStatus.toLowerCase()
        : true
    )
    .sort((a, b) => {
      if (sortOption === "deadline") {
        return new Date(a.deadline) > new Date(b.deadline) ? 1 : -1;
      } else if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "priority") {
        const priorityOrder: { [key: string]: number } = {
          high: 1,
          medium: 2,
          low: 3,
        };
        return (
          priorityOrder[a.priority.toLowerCase()] -
          priorityOrder[b.priority.toLowerCase()]
        );
      } else if (sortOption === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysLeft = (deadline: string) => {
    const daysLeft = differenceInDays(new Date(deadline), new Date());
    if (daysLeft > 1) {
      return { text: `${daysLeft} days left`, className: "" };
    } else if (daysLeft === 1) {
      return { text: "1 day left", className: "" };
    } else if (daysLeft === 0) {
      return { text: "Due today", className: "" };
    } else {
      return {
        text: "Overdue",
        className: "bg-red-600 rounded text-center text-white font-bold",
      };
    }
  };

  const handleRowClick = (task: any) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("UserTask")
      .delete()
      .eq("id", selectedTask.id);
    if (error) {
      console.error(error);
    } else {
      fetchTask();
      closeDialog();
    }
  };

  const handleStart = async () => {
    const { data, error } = await supabase
      .from("UserTask")
      .update({ status: "In Progress" })
      .eq("id", selectedTask.id);
    if (error) {
      console.error(error);
    } else {
      fetchTask();
      closeDialog();
    }
  };

  const handleFinish = async () => {
    const { data, error } = await supabase
      .from("UserTask")
      .update({ status: "Completed" })
      .eq("id", selectedTask.id);
    if (error) {
      console.error(error);
    } else {
      fetchTask();
      closeDialog();
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredTasks?.length || 0) / itemsPerPage);

  return (
    <div className="flex flex-col min-h-screen justify-center">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {name ? `${name}'s Tasks` : "My Tasks"}
          </h1>
          <p className="text-gray-600">Here are list of your tasks</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="">
            <MyTaskAdd fetchTask={fetchTask}></MyTaskAdd>
          </div>
          <div className="">
            <div className="flex flex-col md:flex-col gap-y-4 mt-4 gap-x-4">
              <div>
                <h1>Sort By</h1>
                <Select onValueChange={(value) => setSortOption(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h1>Filter Status</h1>
                <Select onValueChange={(value) => setFilterStatus(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="not started">Not Started</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 w-full"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block mb-6">
          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Deadline</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems?.map((data) => {
                  const deadlineInfo = getDaysLeft(data.deadline);
                  return (
                    <TableRow
                      key={data.id}
                      className="hover:bg-gray-50 cursor-pointer h-12" // Increase row height
                      onClick={() => handleRowClick(data)}
                    >
                      <TableCell
                        className={`font-medium ${deadlineInfo.className}`}
                      >
                        {deadlineInfo.text}
                      </TableCell>
                      <TableCell>{data.title}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(
                            data.priority
                          )}`}
                        >
                          {data.priority}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            data.status
                          )}`}
                        >
                          {data.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile View - Simple List */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {currentItems?.map((data) => (
            <div
              key={data.id}
              className="bg-white rounded-lg shadow p-4 cursor-pointer"
              onClick={() => handleRowClick(data)}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{data.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                      data.status
                    )}`}
                  >
                    {data.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{getDaysLeft(data.deadline).text}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(
                      data.priority
                    )}`}
                  >
                    {data.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredTasks && filteredTasks.length > itemsPerPage && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={currentPage === 1 ? "disabled-class" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages ? "disabled-class" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Task Detail Dialog */}
        {selectedTask && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <h1 className="text-xl font-bold">{selectedTask.title}</h1>
              {selectedTask.description}
              <p>
                <strong>Deadline:</strong>{" "}
                {getDaysLeft(selectedTask.deadline).text}
              </p>
              <p>
                <strong>Priority:</strong> {selectedTask.priority}
              </p>
              <p>
                <strong>Status:</strong> {selectedTask.status}
              </p>
              <p></p>
              {selectedTask.status === "Not Started" ? (
                <Button onClick={() => handleStart()}>Start</Button>
              ) : selectedTask.status === "In Progress" ? (
                <Button onClick={() => handleFinish()}>Finish</Button>
              ) : selectedTask.status === "Completed" ? (
                <Button className="disabled bg-teal-800 hover:bg-teal-800 ">
                  Finished
                </Button>
              ) : null}
              <Button onClick={() => handleDelete()}>Delete</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
