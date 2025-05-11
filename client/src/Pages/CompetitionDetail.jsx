import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Edit, Save, Trash2, Calendar, Trophy, Users, Info, Loader2, ChevronRight, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CompetitionForm from "@/components/MyComponents/CompetitionForm";
import { fetchCompetitionParticipants } from "@/Redux/features/competitionSlice";

export default function CompetitionDetail() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { competitions, participants, loading, error } = useSelector((state) => state.competitions);
    const [isEditing, setIsEditing] = useState(searchParams.get('mode') === 'edit');
    const [activeTab, setActiveTab] = useState("details");

    const isNewCompetition = id === "new";
    const competition = competitions?.find(comp => comp._id === id);

    useEffect(() => {
        console.log("useEffect triggered");
        console.log("id:", id);
        console.log("isNewCompetition:", isNewCompetition);

        if (!isNewCompetition) {
            console.log("Making API call to fetch participants");
            dispatch(fetchCompetitionParticipants(id));
        }
    }, [dispatch, id, isNewCompetition]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Loading state with animation
    if (loading && !isNewCompetition) {
        return (
            <div className="min-h-screen  flex items-center justify-center p-4">
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
    if (!competition && !isNewCompetition) {
        return (
            <div className="min-h-screen  flex items-center justify-center p-4">
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
                    <CardFooter className=" flex justify-center p-4">
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
                                    {isNewCompetition ? "New" : competition?.name || "Details"}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                                {isNewCompetition ? (
                                    <>Create New Competition</>
                                ) : (
                                    <>
                                        {competition?.name}
                                        {competition?.status && (
                                            <Badge className="ml-2" variant={competition.status === "active" ? "success" : "secondary"}>
                                                {competition.status}
                                            </Badge>
                                        )}
                                    </>
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

                            {!isNewCompetition && !isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            )}


                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="container max-w-7xl mx-auto px-4 pt-8">
                {/* Info cards for existing competition */}
                {!isNewCompetition && !isEditing && (
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
                                            {competition?.status || "Active"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Participants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <div className="mr-3 bg-blue-100 p-2 rounded-full">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold">
                                            {competition?.participants || 0} Registered
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Date</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <div className="mr-3 bg-purple-100 p-2 rounded-full">
                                        <Calendar className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold">
                                            {competition?.date || "Not scheduled"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Tabs for existing competition in view mode */}
                {!isNewCompetition && !isEditing ? (
                    <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab} value={activeTab}>
                        <div className="border-b">
                            <TabsList className="bg-transparent h-12">
                                <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                                    <Info className="mr-2 h-4 w-4" />
                                    Details
                                </TabsTrigger>
                                <TabsTrigger value="participants" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                                    <Users className="mr-2 h-4 w-4" />
                                    Participants
                                </TabsTrigger>
                                <TabsTrigger value="schedule" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Schedule
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="details" className="pt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Competition Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                                            <p className="text-lg">{competition?.name}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                                            <p>{competition?.description || "No description provided."}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Rules</h3>
                                            <p>{competition?.rules || "No rules specified."}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Prize</h3>
                                            <p>{competition?.prize || "No prize information."}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="participants" className="pt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Participants</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="flex h-96 items-center justify-center">
                                            <div className="text-center">
                                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                                                <p className="mt-2 text-sm text-muted-foreground">Loading participants...</p>
                                            </div>
                                        </div>
                                    ) : participants?.length === 0 ? (
                                        <div className="flex h-96 items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-lg font-medium">No participants found</p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    No participants have registered for this competition yet.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Phone</TableHead>
                                                        <TableHead>Institution</TableHead>
                                                        <TableHead>Team</TableHead>
                                                        <TableHead>Payment Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {participants?.map((participant, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-medium">{participant.name}</TableCell>
                                                            <TableCell>{participant.email}</TableCell>
                                                            <TableCell>{participant.phone}</TableCell>
                                                            <TableCell>{participant.institution}</TableCell>
                                                            <TableCell>{participant.teamName}</TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={participant.isPaid
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-yellow-100 text-yellow-800"
                                                                    }
                                                                >
                                                                    {participant.isPaid ? "Paid" : "Unpaid"}
                                                                </Badge>
                                                            </TableCell>
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
                                    <p className="text-muted-foreground">
                                        {competition?.date ?
                                            `This competition is scheduled for ${competition.date}.` :
                                            "This competition has not been scheduled yet."}
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                ) : (
                    // Form for editing or creating
                    <Card className="shadow-sm">
                        <CardHeader className="border-b">
                            <CardTitle>
                                {isNewCompetition ? "Create New Competition" : "Edit Competition"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <CompetitionForm
                                competition={competition}
                                isEditing={!isNewCompetition && isEditing}
                            />
                        </CardContent>

                    </Card>
                )}
            </div>
        </div>
    );
}
