"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { format, isPast, isFuture } from "date-fns"
import {
    MoreVertical,
    Calendar,
    MapPin,
    Users,
    Edit,
    XCircle,
    Trash2,
    Clock,
    User,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Plus,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { cancelMeeting, deleteMeeting } from "../../Redux/features/meetingSlice"
import { toast } from "sonner"
import EditMeeting from "./EditMeeting"
import { Textarea } from "../ui/textarea"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

const MeetingList = ({ meetings, loading, type }) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.authentication)
    const [selectedMeeting, setSelectedMeeting] = useState(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [cancelReason, setCancelReason] = useState("")
    const [expandedMeetings, setExpandedMeetings] = useState({})
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const toggleExpand = (meetingId) => {
        setExpandedMeetings((prev) => ({
            ...prev,
            [meetingId]: !prev[meetingId],
        }))
    }

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a reason for cancellation")
            return
        }

        try {
            await dispatch(cancelMeeting({ id: selectedMeeting._id, reason: cancelReason })).unwrap()
            toast.success("Meeting cancelled successfully")
            setIsCancelDialogOpen(false)
            setCancelReason("")
            setSelectedMeeting(null)
        } catch (error) {
            toast.error(error.message || "Failed to cancel meeting")
        }
    }

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteMeeting(id)).unwrap()
            toast.success("Meeting deleted successfully")
        } catch (error) {
            toast.error(error.message || "Failed to delete meeting")
        }
    }

    const getStatusBadge = (meeting) => {
        const meetingDate = new Date(meeting.dateTime)

        if (meeting.status === "cancelled") {
            return <Badge variant="destructive">Cancelled</Badge>
        } else if (isPast(meetingDate)) {
            return <Badge variant="outline">Completed</Badge>
        } else if (isFuture(meetingDate)) {
            // Check if meeting is happening soon (within 24 hours)
            const isUpcoming = meetingDate.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
            return isUpcoming ? (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                    Upcoming Soon
                </Badge>
            ) : (
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Scheduled
                </Badge>
            )
        }

        return null
    }

    const getInitials = (name) => {
        if (!name) return "?"
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-center space-y-4">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
                    <p className="text-muted-foreground">Loading meetings...</p>
                </div>
            </div>
        )
    }

    if (meetings.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed rounded-lg">
                <div className="space-y-4">
                    {type === "upcoming" ? (
                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                    ) : type === "past" ? (
                        <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                    ) : (
                        <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                    )}
                    <h3 className="text-lg font-medium">No {type} meetings found</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        {type === "upcoming"
                            ? "You don't have any upcoming meetings scheduled. Create a new meeting to get started."
                            : type === "past"
                                ? "You don't have any past meetings. Once meetings are completed, they will appear here."
                                : "You don't have any cancelled meetings. Cancelled meetings will appear here."}
                    </p>
                    {type === "upcoming" && (
                        <Button variant="outline" className="mt-2" onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Meeting
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {meetings.map((meeting) => {
                const isExpanded = expandedMeetings[meeting._id]
                const meetingDate = new Date(meeting.dateTime)
                const isPastMeeting = isPast(meetingDate)

                return (
                    <div
                        key={meeting._id}
                        className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                    >
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-semibold">{meeting.title}</h3>
                                        {getStatusBadge(meeting)}
                                    </div>

                                    <p className="text-muted-foreground line-clamp-2">{meeting.description}</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            <span>{format(meetingDate, "EEEE, MMMM d, yyyy")}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span>{format(meetingDate, "h:mm a")}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span>{meeting.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            <span>
                                                {meeting.organizer._id === user._id
                                                    ? "Organized by you"
                                                    : `Organized by ${meeting.organizer.name}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-start">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => {
                                                        setSelectedMeeting(meeting)
                                                        setIsDetailsDialogOpen(true)
                                                    }}
                                                >
                                                    <Users className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>View attendees</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleExpand(meeting._id)}>
                                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </Button>

                                    {type === "upcoming" && !isPastMeeting && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {(user.role === "President" || meeting.organizer._id === user.id) && (
                                                    <>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedMeeting(meeting)
                                                                setIsEditDialogOpen(true)
                                                            }}
                                                            className="flex items-center"
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedMeeting(meeting)
                                                                setIsCancelDialogOpen(true)
                                                            }}
                                                            className="flex items-center"
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Cancel
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}
                                                {user.role === "President" && (
                                                    <DropdownMenuItem
                                                        className="text-destructive flex items-center"
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    "Are you sure you want to delete this meeting? This action cannot be undone.",
                                                                )
                                                            ) {
                                                                handleDelete(meeting._id)
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="mt-4 pt-4 border-t">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Description</h4>
                                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                                                {meeting.description || "No description provided."}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Attendees ({meeting.attendees.length})</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {meeting.attendees.slice(0, 5).map((attendee) => (
                                                    <TooltipProvider key={attendee._id}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback>{getInitials(attendee.name)}</AvatarFallback>
                                                                </Avatar>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    {attendee.name} ({attendee.role})
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                ))}

                                                {meeting.attendees.length > 5 && (
                                                    <Avatar className="h-8 w-8 bg-muted">
                                                        <AvatarFallback>+{meeting.attendees.length - 5}</AvatarFallback>
                                                    </Avatar>
                                                )}

                                                {meeting.attendees.length === 0 && (
                                                    <p className="text-sm text-muted-foreground">No attendees yet</p>
                                                )}
                                            </div>
                                        </div>

                                        {meeting.status === "cancelled" && (
                                            <div className="bg-red-50 p-3 rounded-md">
                                                <div className="flex items-start">
                                                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-red-800">Cancellation Reason</h4>
                                                        <p className="text-sm text-red-700 mt-1">
                                                            {meeting.cancellationReason || "No reason provided."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Edit className="mr-2 h-5 w-5 text-primary" />
                            Edit Meeting
                        </DialogTitle>
                    </DialogHeader>
                    {selectedMeeting && (
                        <EditMeeting
                            meeting={selectedMeeting}
                            onSuccess={() => {
                                setIsEditDialogOpen(false)
                                setSelectedMeeting(null)
                                toast.success("Meeting updated successfully")
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Cancel Dialog */}
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <XCircle className="mr-2 h-5 w-5 text-destructive" />
                            Cancel Meeting
                        </DialogTitle>
                        <DialogDescription>This will notify all attendees that the meeting has been cancelled.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm">Please provide a reason for cancelling this meeting:</p>
                        <Textarea
                            className="min-h-[100px]"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Enter reason for cancellation..."
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsCancelDialogOpen(false)
                                    setCancelReason("")
                                    setSelectedMeeting(null)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleCancel}>
                                Confirm Cancellation
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Attendees Dialog */}
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Users className="mr-2 h-5 w-5 text-primary" />
                            Meeting Attendees
                        </DialogTitle>
                        <DialogDescription>{selectedMeeting?.title}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedMeeting?.attendees.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No attendees for this meeting</p>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                {selectedMeeting?.attendees.map((attendee) => (
                                    <div key={attendee._id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                                        <Avatar>
                                            <AvatarFallback>{getInitials(attendee.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{attendee.name}</p>
                                            <p className="text-sm text-muted-foreground">{attendee.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MeetingList
