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
    [ROLES.PRESIDENT]: null,
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
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [statusData, setStatusData] = useState({ status: "", notes: "" });
    const dispatch = useDispatch();
    const { applications, loading, error } = useSelector((state) => state.recruitment);
    const { user: currentUser } = useSelector((state) => state.authentication);

    useEffect(() => {
        if (currentUser?.role) {
            const filters = currentUser.role === ROLES.PRESIDENT
                ? {}
                : { role: ROLE_HIERARCHY[currentUser.role] };
            dispatch(fetchApplications(filters));
        }
    }, [dispatch, currentUser?.role]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

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

    if (!currentUser?.role || (currentUser.role !== ROLES.PRESIDENT && !ROLE_HIERARCHY[currentUser.role])) {
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
                    <CardTitle>
                        {currentUser.role === ROLES.PRESIDENT
                            ? "All Applications"
                            : `${ROLE_HIERARCHY[currentUser.role]} Applications`}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <p className="text-muted-foreground">Loading applications...</p>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="flex justify-center items-center py-8">
                            <p className="text-muted-foreground">No applications found.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Competition</TableHead>
                                    <TableHead>Applied Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((application) => (
                                    <TableRow key={application._id}>
                                        <TableCell>{application.name}</TableCell>
                                        <TableCell>{application.email}</TableCell>
                                        <TableCell>{application.competition?.name || "N/A"}</TableCell>
                                        <TableCell>{application.appliedRole}</TableCell>
                                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedApplication(application);
                                                        setIsDetailsDialogOpen(true);
                                                    }}
                                                >
                                                    View Details
                                                </Button>
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
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
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
                                className="w-full bg-background p-2 border rounded-md"
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

            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                    </DialogHeader>
                    {selectedApplication && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Name</Label>
                                    <p className="font-medium">{selectedApplication.name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Email</Label>
                                    <p className="font-medium">{selectedApplication.email}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Competition</Label>
                                    <p className="font-medium">{selectedApplication.competition?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Applied Role</Label>
                                    <p className="font-medium">{selectedApplication.appliedRole}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <div>{getStatusBadge(selectedApplication.status)}</div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-muted-foreground">Experience</Label>
                                <p className="mt-1 whitespace-pre-wrap">{selectedApplication.experience}</p>
                            </div>

                            <div>
                                <Label className="text-muted-foreground">Skills</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedApplication.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </div>

                            {selectedApplication.notes && (
                                <div>
                                    <Label className="text-muted-foreground">Notes</Label>
                                    <p className="mt-1 whitespace-pre-wrap">{selectedApplication.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RecruitmentApplications; 