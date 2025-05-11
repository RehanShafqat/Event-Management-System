import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { confirmTeamPayment } from "@/Redux/features/competitionSlice";
import { uploadToCloudinary } from "@/utils/uploadFile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, CheckCircle, Clock, XCircle } from "lucide-react";
import { DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const TeamDetailsModal = ({ open, onClose, team }) => {
    const [paymentProof, setPaymentProof] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.authentication);

    const canUpdatePayment = ["President", "VP", "AVP"].includes(currentUser?.role);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const imageUrl = await uploadToCloudinary(file, setIsSubmitting);
                setPaymentProof(imageUrl);
            } catch (error) {
                console.error("Error uploading payment proof:", error);
                toast.error("Failed to upload payment proof");
            }
        }
    };

    const handlePaymentUpdate = async () => {
        if (!paymentProof) return;

        const toastId = toast.loading("Confirming payment...");
        try {
            setIsSubmitting(true);
            await dispatch(confirmTeamPayment({
                registrationId: team._id,
                paymentProofUrl: paymentProof
            })).unwrap();

            toast.dismiss(toastId);
            toast.success("Payment confirmed successfully");
            onClose();
        } catch (error) {
            console.error("Error updating payment:", error);
            toast.dismiss(toastId);
            toast.error(error.message || "Failed to confirm payment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPaymentStatusIcon = (status) => {
        switch (status) {
            case "confirmed":
                return <CheckCircle className="h-4 w-4" />;
            case "pending":
                return <Clock className="h-4 w-4" />;
            case "rejected":
                return <XCircle className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getPaymentStatusVariant = (status) => {
        switch (status) {
            case "confirmed":
                return "success";
            case "pending":
                return "warning";
            case "rejected":
                return "destructive";
            default:
                return "default";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="p-6 lg:min-w-4xl xl:min-w-4xl">
                <DialogHeader className="pb-4">
                    <DialogTitle>Team Details</DialogTitle>
                    <DialogDescription>
                        View and manage team information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {/* Team Information */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Team Name</Label>
                                    <p className="text-lg font-medium">{team.teamName}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Registration Date</Label>
                                    <p className="text-lg font-medium">
                                        {new Date(team.registrationDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Payment Status</Label>
                                    <Badge
                                        variant={getPaymentStatusVariant(team.paymentStatus)}
                                        className={`flex items-center gap-1 ${team.paymentStatus === "confirmed"
                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                            : team.paymentStatus === "rejected"
                                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                            }`}
                                    >
                                        {getPaymentStatusIcon(team.paymentStatus)}
                                        {team.paymentStatus.charAt(0).toUpperCase() + team.paymentStatus.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team Members Table */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Team Members</h3>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Institution</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {team.participants.map((participant, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{participant.name}</TableCell>
                                            <TableCell>{participant.email}</TableCell>
                                            <TableCell>{participant.phone}</TableCell>
                                            <TableCell>{participant.institution}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Payment Update Section */}
                    {canUpdatePayment && team.paymentStatus === "pending" && (
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="paymentProof">Payment Proof</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="paymentProof"
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                            className="flex-1"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => document.getElementById('paymentProof').click()}
                                        >
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {paymentProof && (
                                        <p className="text-sm text-muted-foreground">
                                            Selected file: {paymentProof.name}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                    {canUpdatePayment && team.paymentStatus === "pending" && (
                        <Button
                            onClick={handlePaymentUpdate}
                            disabled={!paymentProof || isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Confirm Payment"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TeamDetailsModal; 