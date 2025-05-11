import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications, updateApplicationStatus } from "@/Redux/features/recruitmentSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ROLES } from "@/utils/roles";

const ROLE_HIERARCHY = {
    [ROLES.PRESIDENT]: ROLES.VP,
    [ROLES.VP]: ROLES.AVP,
    [ROLES.AVP]: ROLES.HEAD,
    [ROLES.HEAD]: ROLES.DEPUTY,
    [ROLES.DEPUTY]: ROLES.OFFICER,
};

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800",
    shortlisted: "bg-blue-100 text-blue-800",
    interviewed: "bg-purple-100 text-purple-800",
    selected: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
};

const RecruitmentApplications = () => {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [statusData, setStatusData] = useState({ status: "", notes: "" });
    const dispatch = useDispatch();
    const { applications, loading } = useSelector((state) => state.recruitment);
    const { user: currentUser } = useSelector((state) => state.authentication);

    useEffect(() => {
        if (currentUser?.role) {
            dispatch(fetchApplications({ role: ROLE_HIERARCHY[currentUser.role] }));
        }
    }, [dispatch, currentUser?.role]);

    const handleStatusUpdate = async () => {
        try {
            await dispatch(updateApplicationStatus({
                id: selectedApplication._id,
                statusData
            })).unwrap();

            toast.success("Application status updated successfully");
            setIsStatusDialogOpen(false);
            setSelectedApplication(null);
            setStatusData({ status: "", notes: "" });
        } catch (error) {
            toast.error(error.message || "Failed to update application status");
        }
    };

    const getStatusBadge = (status) => (
        <Badge className={`${STATUS_COLORS[status]} hover:${STATUS_COLORS[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );

    if (!currentUser?.role || !ROLE_HIERARCHY[currentUser.role]) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">You don't have permission to view applications.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Recruitment Applications</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{ROLE_HIERARCHY[currentUser.role]} Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Experience</TableHead>
                                <TableHead>Skills</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((application) => (
                                <TableRow key={application._id}>
                                    <TableCell>{application.name}</TableCell>
                                    <TableCell>{application.email}</TableCell>
                                    <TableCell className="max-w-xs truncate">{application.experience}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {application.skills.map((skill, index) => (
                                                <Badge key={index} variant="secondary">{skill}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedApplication(application);
                                                setStatusData({ status: application.status, notes: application.notes || "" });
                                                setIsStatusDialogOpen(true);
                                            }}
                                        >
                                            Update Status
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Application Status</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={statusData.status}
                                onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                            >
                                <option value="pending">Pending</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="interviewed">Interviewed</option>
                                <option value="selected">Selected</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea
                                value={statusData.notes}
                                onChange={(e) => setStatusData({ ...statusData, notes: e.target.value })}
                                placeholder="Add any notes about the application..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStatusUpdate}
                            disabled={loading || !statusData.status}
                        >
                            {loading ? "Updating..." : "Update Status"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RecruitmentApplications; 