import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function CompetitionStaff({ competition }) {
    const staffMembers = [
        { role: "AVP", members: [competition.avp] },
        { role: "Head", members: competition.heads },
        { role: "Deputy", members: competition.deputies },
        { role: "Officer", members: competition.officers },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Competition Staff
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Department</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staffMembers.map((staffGroup) => (
                                staffGroup.members.map((member, index) => (
                                    <TableRow key={`${staffGroup.role}-${index}`}>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                staffGroup.role === "AVP" ? "bg-purple-100 text-purple-800" :
                                                    staffGroup.role === "Head" ? "bg-blue-100 text-blue-800" :
                                                        staffGroup.role === "Deputy" ? "bg-green-100 text-green-800" :
                                                            "bg-yellow-100 text-yellow-800"
                                            }>
                                                {staffGroup.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={member.imageUrl} alt={member.name} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{member.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell>{member.department || "Not specified"}</TableCell>
                                    </TableRow>
                                ))
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
} 