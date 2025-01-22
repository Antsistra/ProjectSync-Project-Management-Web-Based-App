import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input"; // Import Input component
import { Button } from "@/components/ui/button"; // Import Button component

export default function MemberContribution() {
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("userProject")
      .select(`user:userId(name,supabaseId)`)
      .eq("projectId", id);
    if (error) {
      console.log(error);
    }
    setMembers(data);
    setLoading(false);
  };

  const fetchTask = async () => {
    const { data, error } = await supabase
      .from("projectTask")
      .select(`handleBy, status`)
      .eq("projectId", id);
    if (error) {
      console.log(error);
    }

    const taskStats = (data || []).reduce((acc: any, task: any) => {
      if (!acc[task.handleBy]) {
        acc[task.handleBy] = { inProgress: 0, completed: 0, total: 0 };
      }
      acc[task.handleBy].total += 1;
      if (task.status === "In Progress") {
        acc[task.handleBy].inProgress += 1;
      } else if (task.status === "Done") {
        acc[task.handleBy].completed += 1;
      }
      return acc;
    }, {});

    setMembers((prevMembers: any) =>
      prevMembers.map((member: any) => {
        const stats = taskStats[member.user.supabaseId] || {
          inProgress: 0,
          completed: 0,
          total: 0,
        };
        return {
          ...member,
          stats,
        };
      })
    );
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (members.length > 0) {
      fetchTask();
    }
  }, [members]);

  const filteredMembers = members.filter((member: any) =>
    member.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * membersPerPage,
    currentPage * membersPerPage
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Member Stats </CardTitle>
          <CardDescription>List of Member Stats</CardDescription>
        </CardHeader>
        <CardContent className="">
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <Table>
            <TableCaption>A list of Member Project Stats</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/6">Name</TableHead>
                <TableHead className="w-1/6">In Progress</TableHead>
                <TableHead className="w-1/6">Completed </TableHead>
                <TableHead className="w-1/6">Total Task</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.map((member: any) => (
                <TableRow key={member.user.id}>
                  <TableCell className="w-3/6">{member.user.name}</TableCell>
                  <TableCell className="w-1/6">
                    {member.stats?.inProgress || 0}
                  </TableCell>
                  <TableCell className="w-1/6">
                    {member.stats?.completed || 0}
                  </TableCell>
                  <TableCell className="w-1/6">
                    {member.stats?.total || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            {Array.from(
              { length: Math.ceil(filteredMembers.length / membersPerPage) },
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
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}
