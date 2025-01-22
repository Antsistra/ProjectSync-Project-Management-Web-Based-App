import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function LogTable() {
  const { id } = useParams<{ id: string }>();
  const [logs, setLogs] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("projectLog")
      .select(`* , User(name)`)
      .eq("projectId", id);
    if (error) {
      console.log(error);
    }
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [id]);

  const handleDateSelect = (day: Date | undefined) => {
    if (selectedDate && day && selectedDate.getTime() === day.getTime()) {
      setSelectedDate(null); // Reset filter if the same date is clicked
    } else {
      setSelectedDate(day || null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredLogs = selectedDate
    ? logs.filter((log: any) => {
        const logDate = new Date(log.created_at);
        return (
          logDate.getFullYear() === selectedDate.getFullYear() &&
          logDate.getMonth() === selectedDate.getMonth() &&
          logDate.getDate() === selectedDate.getDate()
        );
      })
    : logs;

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  return (
    <>
      <h1 className="mt-8 mb-2 text-2xl font-semibold">Project Log</h1>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Table>
        <TableCaption>A list of Project Log.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">Date</TableHead>
            <TableHead className="w-5/6">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={2}>Loading...</TableCell>
            </TableRow>
          ) : paginatedLogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                No Log Found
              </TableCell>
            </TableRow>
          ) : (
            paginatedLogs.map((log: any) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.created_at), "EEE dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <span className="font-bold">{log.User.name} </span> {log.type}{" "}
                  {log.desc}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(filteredLogs.length / logsPerPage) },
          (_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              onClick={() => handlePageChange(index + 1)}
              className="mx-1"
            >
              {index + 1}
            </Button>
          )
        )}
      </div>
    </>
  );
}
