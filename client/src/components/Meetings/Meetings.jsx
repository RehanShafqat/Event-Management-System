import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetings } from "../../Redux/features/meetingSlice";
import { Button } from "../ui/button";
import { Plus, Calendar, Clock, CalendarX, Search, Loader2, User } from 'lucide-react';
import MeetingList from "./MeetingList";
import CreateMeeting from "./CreateMeeting";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";

const Meetings = () => {
    const dispatch = useDispatch();
    const { meetings, loading } = useSelector((state) => state.meetings);
    const { user } = useSelector((state) => state.authentication);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("my-meetings");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchMeetings());
    }, [dispatch]);

    // Filter meetings based on search query
    const filterMeetings = (meetingList) => {
        if (!searchQuery.trim()) return meetingList;

        const query = searchQuery.toLowerCase();
        return meetingList.filter(meeting =>
            meeting.title.toLowerCase().includes(query) ||
            meeting.description.toLowerCase().includes(query) ||
            meeting.location.toLowerCase().includes(query)
        );
    };

    // Filter my meetings (meetings where user is organizer or attendee)
    const myMeetings = filterMeetings(meetings.filter(
        (meeting) => meeting.organizer._id === user.id || meeting.attendees.some(attendee => attendee._id === user._id)
    ));

    const upcomingMeetings = filterMeetings(meetings.filter(
        (meeting) => meeting.status === "scheduled" && new Date(meeting.dateTime) > new Date()
    ));

    const pastMeetings = filterMeetings(meetings.filter(
        (meeting) => meeting.status === "scheduled" && new Date(meeting.dateTime) <= new Date()
    ));

    const cancelledMeetings = filterMeetings(meetings.filter(
        (meeting) => meeting.status === "cancelled"
    ));


    const myMeetingsCount = meetings.filter(
        (meeting) => meeting.organizer._id === user.id
    ).length;

    const upcomingCount = meetings.filter(
        (meeting) => meeting.status === "scheduled" && new Date(meeting.dateTime) > new Date()
    ).length;

    const pastCount = meetings.filter(
        (meeting) => meeting.status === "scheduled" && new Date(meeting.dateTime) <= new Date()
    ).length;

    const cancelledCount = meetings.filter(
        (meeting) => meeting.status === "cancelled"
    ).length;

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Meetings</h1>
                    <p className="text-muted-foreground mt-1">Manage your scheduled meetings</p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Meeting
                </Button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search meetings by title, description or location..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                    <TabsTrigger value="my-meetings" className="relative">
                        <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>My Meetings</span>
                            {myMeetingsCount > 0 && (
                                <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                                    {myMeetingsCount}
                                </span>
                            )}
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="relative">
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Upcoming</span>
                            {upcomingCount > 0 && (
                                <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                                    {upcomingCount}
                                </span>
                            )}
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="past" className="relative">
                        <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Past</span>
                            {pastCount > 0 && (
                                <span className="ml-2 bg-muted text-muted-foreground text-xs rounded-full px-2 py-0.5">
                                    {pastCount}
                                </span>
                            )}
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="relative">
                        <div className="flex items-center">
                            <CalendarX className="mr-2 h-4 w-4" />
                            <span>Cancelled</span>
                            {cancelledCount > 0 && (
                                <span className="ml-2 bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5">
                                    {cancelledCount}
                                </span>
                            )}
                        </div>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="my-meetings">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="mr-2 h-5 w-5 text-primary" />
                                My Meetings
                            </CardTitle>
                            <CardDescription>
                                Meetings where you are the organizer or an attendee
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <MeetingList
                                    meetings={myMeetings}
                                    loading={loading}
                                    type="my-meetings"
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="upcoming">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5 text-primary" />
                                Upcoming Meetings
                            </CardTitle>
                            <CardDescription>
                                Meetings that are scheduled to take place in the future
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <MeetingList
                                    meetings={upcomingMeetings}
                                    loading={loading}
                                    type="upcoming"
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="past">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                                Past Meetings
                            </CardTitle>
                            <CardDescription>
                                Meetings that have already taken place
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <MeetingList
                                    meetings={pastMeetings}
                                    loading={loading}
                                    type="past"
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cancelled">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CalendarX className="mr-2 h-5 w-5 text-destructive" />
                                Cancelled Meetings
                            </CardTitle>
                            <CardDescription>
                                Meetings that have been cancelled
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <MeetingList
                                    meetings={cancelledMeetings}
                                    loading={loading}
                                    type="cancelled"
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Calendar className="mr-2 h-5 w-5 text-primary" />
                            Create New Meeting
                        </DialogTitle>
                    </DialogHeader>
                    <CreateMeeting onSuccess={() => setIsCreateDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Meetings;
