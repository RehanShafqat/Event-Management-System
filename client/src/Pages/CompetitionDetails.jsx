import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Edit, Save, Trash2, Calendar, Trophy, Users, Info, Loader2, ChevronRight, Clock, MapPin, DollarSign, Medal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchCompetitionTeams } from "@/Redux/features/competitionSlice";
import CompetitionForm from "@/components/MyComponents/CompetitionForm";
import { fetchCompetitions } from "../Redux/features/competitionSlice";
import CompetitionStaff from "@/components/MyComponents/CompetitionStaff";
import TeamDetailsModal from "@/components/MyComponents/TeamDetailsModal";

export default function CompetitionDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { competitions, teams, loading, error } = useSelector((state) => state.competitions);
    const [activeTab, setActiveTab] = useState("details");
    const competition = competitions?.find(comp => comp._id === id);
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        if (!competitions) {
            dispatch(fetchCompetitions());
        }
        dispatch(fetchCompetitionTeams(id));
    }, [dispatch, id, competitions]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Loading state with animation
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center p-8">
                    <div className="flex flex-col items-center">
                        <div className="relative w-20 h-20 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
                            <Trophy className="absolute inset-0 m-auto h-10 w-10 text-primary/70" />
                        </div>
                        <CardTitle className="text-2xl mb-2">Loading Competition</CardTitle>
                        <p className="text-muted-foreground">Please wait while we fetch the competition details...</p>
                    </div>
                </Card>
            </div>
        );
    }

    // Error state
    if (!competition) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md overflow-hidden">
                    <div className="bg-red-50 p-6 flex justify-center">
                        <div className="bg-red-100 rounded-full p-4">
                            <Trophy className="h-12 w-12 text-red-500" />
                        </div>
                    </div>
                    <CardContent className="pt-6 text-center">
                        <CardTitle className="text-2xl mb-3">Competition Not Found</CardTitle>
                        <p className="text-muted-foreground mb-6">
                            The competition you're looking for doesn't exist or has been removed.
                        </p>
                    </CardContent>
                    <CardFooter className="bg-gray-50 flex justify-center p-4">
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={() => navigate("/crud/competitions")}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Competitions
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // Main content
    return (
        <div className="min-h-screen  pb-12">
            {/* Header */}
            <div className="bg-background border-b sticky top-0 z-10 shadow-sm">
                <div className="container max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <button
                                    className="hover:text-primary transition-colors"
                                    onClick={() => navigate("/crud/competitions")}
                                >
                                    Competitions
                                </button>
                                <ChevronRight className="h-3 w-3" />
                                <span className="font-medium text-foreground">
                                    {competition?.name || "Details"}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                                {competition?.name}
                                {competition?.status && (
                                    <Badge className="ml-2" variant={competition.status === "active" ? "success" : "secondary"}>
                                        {competition.status}
                                    </Badge>
                                )}
                            </h1>
                        </div>

                        <div className="flex gap-2 self-end sm:self-auto">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/crud/competitions")}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="container max-w-7xl mx-auto px-4 pt-8">
                {/* Competition Image */}
                {competition?.imageUrl && (
                    <div className="mb-8">
                        <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                            <img
                                src={competition.imageUrl}
                                alt={competition.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Info cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <div className="mr-3 bg-green-100 p-2 rounded-full">
                                    <Trophy className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold">
                                        {competition?.status ? competition.status.charAt(0).toUpperCase() + competition.status.slice(1) : "Active"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Teams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <div className="mr-3 bg-blue-100 p-2 rounded-full">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold">
                                        {teams?.length || 0} Registered
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Teams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <div className="mr-3 bg-purple-100 p-2 rounded-full">
                                    <DollarSign className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold">
                                        {teams?.filter(team => team.paymentStatus === "confirmed").length || 0} Teams
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Staff Section */}
                <div className="mb-8">
                    <CompetitionStaff competition={competition} />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab} value={activeTab}>
                    <div className="border-b">
                        <TabsList className="bg-transparent h-12">
                            <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                                <Info className="mr-2 h-4 w-4" />
                                Details
                            </TabsTrigger>
                            <TabsTrigger value="participants" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                                <Users className="mr-2 h-4 w-4" />
                                Teams
                            </TabsTrigger>
                            <TabsTrigger value="schedule" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                                <Clock className="mr-2 h-4 w-4" />
                                Schedule
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="details" className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-5 w-5 text-primary" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                                        <p className="text-lg font-medium">{competition?.name}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                                        <p className="text-base leading-relaxed">{competition?.description || "No description provided."}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Venue</h3>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <p>{competition?.venue || "No venue specified."}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Team Size</h3>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <p>Maximum {competition?.maxParticipantsPerTeam || 0} participants per team</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Financial Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        Financial Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Registration Fee</h3>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-lg font-medium">${competition?.registrationFee || 0}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Winner Prize</h3>
                                        <div className="flex items-center gap-2">
                                            <Trophy className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-lg font-medium">${competition?.winnerPrize || 0}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Runner-up Prize</h3>
                                        <div className="flex items-center gap-2">
                                            <Medal className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-lg font-medium">${competition?.runnerUpPrize || 0}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-primary" />
                                        Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Status</h3>
                                        <Badge
                                            variant="outline"
                                            className={competition?.status === "upcoming"
                                                ? "bg-blue-100 text-blue-800"
                                                : competition?.status === "ongoing"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }
                                        >
                                            {competition?.status || "Not set"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="participants" className="pt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Registered Teams</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex h-96 items-center justify-center">
                                        <div className="text-center">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                                            <p className="mt-2 text-sm text-muted-foreground">Loading teams...</p>
                                        </div>
                                    </div>
                                ) : teams?.length === 0 ? (
                                    <div className="flex h-96 items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-lg font-medium">No teams found</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                No teams have registered for this competition yet.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Team Name</TableHead>
                                                    <TableHead>Registration Date</TableHead>
                                                    <TableHead>Payment Status</TableHead>
                                                    <TableHead>Number of Participants</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {teams?.map((team, index) => (
                                                    <TableRow
                                                        key={index}
                                                        className="cursor-pointer hover:bg-muted/50"
                                                        onClick={() => setSelectedTeam(team)}
                                                    >
                                                        <TableCell className="font-medium">{team.teamName}</TableCell>
                                                        <TableCell>{new Date(team.registrationDate).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={team.paymentStatus === "confirmed"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : team.paymentStatus === "rejected"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-yellow-100 text-yellow-800"
                                                                }
                                                            >
                                                                {team.paymentStatus}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{team.participants?.length || 0}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="schedule" className="pt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Registration Deadline</h3>
                                        <p>{competition?.registrationDeadline ? new Date(competition.registrationDeadline).toLocaleDateString() : "Not set"}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Event Date</h3>
                                        <p>{competition?.eventDate ? new Date(competition.eventDate).toLocaleDateString() : "Not set"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {selectedTeam && (
                <TeamDetailsModal
                    team={selectedTeam}
                    open={!!selectedTeam}
                    onClose={() => setSelectedTeam(null)}
                />
            )}
        </div>
    );
}
