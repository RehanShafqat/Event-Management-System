import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, ListChecks, ChevronRight, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { fetchMeetings } from "@/Redux/features/meetingSlice";
import { fetchTasks } from "@/Redux/features/taskSlice";

export function OfficerDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.authentication);
    const { meetings } = useSelector((state) => state.meetings);
    const { tasks } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchMeetings());
        dispatch(fetchTasks());
    }, [dispatch]);

    // Filter meetings relevant to the officer
    const myMeetings = meetings.filter(
        (meeting) => meeting.attendees.some(attendee => attendee._id === user.id) &&
            meeting.status === "scheduled" &&
            new Date(meeting.dateTime) > new Date()
    );

    // Filter tasks assigned to the officer
    const myTasks = tasks.filter((task) => task.assignedTo?._id === user.id);
    const pendingTasks = myTasks.filter((task) => task.status === "pending");
    const completedTasks = myTasks.filter((task) => task.status === "completed");

    // Combine meetings and tasks for recent activities
    const recentActivities = [
        ...myMeetings.map(meeting => ({
            type: 'meeting',
            title: meeting.title,
            description: `Scheduled for ${new Date(meeting.dateTime).toLocaleDateString()}`,
            time: meeting.dateTime,
            icon: <Calendar className="h-4 w-4 text-blue-500" />
        })),
        ...myTasks.map(task => ({
            type: 'task',
            title: task.title,
            description: `Status: ${task.status}`,
            time: task.dueDate,
            icon: <ListChecks className="h-4 w-4 text-green-500" />
        }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    return (
        <div className="min-h-screen">
            <div className="flex-1 p-4">
                {/* Welcome Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
                    <p className="text-muted-foreground">Here's an overview of your tasks and meetings</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                    <StatCard
                        title="Upcoming Meetings"
                        value={myMeetings.length}
                        icon={<Calendar className="h-5 w-5 text-primary" />}
                        onClick={() => navigate('/meetings')}
                    />
                    <StatCard
                        title="Pending Tasks"
                        value={pendingTasks.length}
                        icon={<ListChecks className="h-5 w-5 text-primary" />}
                        onClick={() => navigate('/tasks')}
                    />
                    <StatCard
                        title="Completed Tasks"
                        value={completedTasks.length}
                        icon={<CheckCircle className="h-5 w-5 text-primary" />}
                        onClick={() => navigate('/tasks')}
                    />
                </div>

                {/* Recent Activity and Task Summary */}
                <div className="grid gap-4 lg:grid-cols-3 mb-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Recent Activity</span>
                                <Button variant="ghost" size="sm" onClick={() => navigate('/meetings')}>
                                    View All <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <ActivityItem
                                    key={index}
                                    title={activity.title}
                                    description={activity.description}
                                    time={getTimeAgo(activity.time)}
                                    icon={activity.icon}
                                    onClick={() => navigate(activity.type === 'meeting' ? '/meetings' : '/tasks')}
                                />
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Tasks Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Pending</span>
                                    <span className="text-sm font-medium">{pendingTasks.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">In Progress</span>
                                    <span className="text-sm font-medium">
                                        {myTasks.filter(t => t.status === "in_progress").length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Completed</span>
                                    <span className="text-sm font-medium">{completedTasks.length}</span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate('/tasks')}
                            >
                                View All Tasks
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, onClick }) {
    return (
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onClick}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

function ActivityItem({ title, description, time, icon, onClick }) {
    return (
        <div
            className="flex items-start gap-4 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
            onClick={onClick}
        >
            <div className="p-2 rounded-lg">{icon}</div>
            <div className="flex-1">
                <h4 className="font-medium">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Badge variant="outline">
                {time}
            </Badge>
        </div>
    );
}

function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((date - now) / 1000);

    if (diffInSeconds < 0) return 'Just now';

    let interval = diffInSeconds / 31536000;
    if (interval > 1) return `in ${Math.floor(interval)}y`;

    interval = diffInSeconds / 2592000;
    if (interval > 1) return `in ${Math.floor(interval)}mo`;

    interval = diffInSeconds / 86400;
    if (interval > 1) return `in ${Math.floor(interval)}d`;

    interval = diffInSeconds / 3600;
    if (interval > 1) return `in ${Math.floor(interval)}h`;

    interval = diffInSeconds / 60;
    if (interval > 1) return `in ${Math.floor(interval)}m`;

    return `in ${Math.floor(diffInSeconds)}s`;
}
