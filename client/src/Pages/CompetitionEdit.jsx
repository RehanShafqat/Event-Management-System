"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, Calendar, Users, DollarSign, MapPin, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for users (AVP, heads, deputies, officers)
const mockUsers = [
    {
        id: "1",
        name: "John Doe",
        role: "AVP",
        email: "john.doe@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "2",
        name: "Jane Smith",
        role: "Head",
        email: "jane.smith@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "3",
        name: "Mike Johnson",
        role: "Head",
        email: "mike.johnson@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "4",
        name: "Sarah Williams",
        role: "Deputy",
        email: "sarah.williams@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "5",
        name: "Alex Brown",
        role: "Deputy",
        email: "alex.brown@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "6",
        name: "Chris Davis",
        role: "Officer",
        email: "chris.davis@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "7",
        name: "Pat Wilson",
        role: "Officer",
        email: "pat.wilson@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "8",
        name: "Taylor Moore",
        role: "Officer",
        email: "taylor.moore@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
    },
]

// Mock data for competitions
const mockCompetitions = [
    {
        id: "1",
        name: "Hackathon 2023",
        description:
            "Annual coding competition for students. Participants will work in teams to develop innovative solutions to real-world problems. Prizes will be awarded for the best projects in various categories including innovation, technical complexity, and user experience.",
        registrationFee: 50,
        registrationDeadline: new Date(2023, 10, 15),
        eventDate: new Date(2023, 11, 1),
        venue: "Main Campus Auditorium",
        maxParticipantsPerTeam: 4,
        status: "upcoming",
        avp: "1",
        heads: ["2", "3"],
        deputies: ["4", "5"],
        officers: ["6", "7", "8"],
        createdAt: new Date(2023, 9, 1),
        updatedAt: new Date(2023, 9, 10),
    },
    {
        id: "2",
        name: "Debate Championship",
        description:
            "Inter-university debate competition where teams will debate on current social and political issues. This event aims to promote critical thinking and public speaking skills among students.",
        registrationFee: 30,
        registrationDeadline: new Date(2023, 9, 20),
        eventDate: new Date(2023, 10, 5),
        venue: "Conference Hall B",
        maxParticipantsPerTeam: 2,
        status: "ongoing",
        avp: "1",
        heads: ["2"],
        deputies: ["4"],
        officers: ["6", "7"],
        createdAt: new Date(2023, 8, 15),
        updatedAt: new Date(2023, 8, 25),
    },
    {
        id: "3",
        name: "Science Fair",
        description:
            "Annual science project exhibition where students can showcase their scientific research and innovations. Projects will be judged by a panel of professors and industry experts.",
        registrationFee: 25,
        registrationDeadline: new Date(2023, 7, 30),
        eventDate: new Date(2023, 8, 15),
        venue: "Science Building",
        maxParticipantsPerTeam: 3,
        status: "completed",
        avp: "1",
        heads: ["3"],
        deputies: ["5"],
        officers: ["8"],
        createdAt: new Date(2023, 6, 1),
        updatedAt: new Date(2023, 6, 10),
    },
]

export default function CompetitionsEditPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [competition, setCompetition] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate API call to fetch competition details
        setTimeout(() => {
            const foundCompetition = mockCompetitions.find((comp) => comp.id === id)
            if (foundCompetition) {
                setCompetition(foundCompetition)
            } else {
                toast.error("The requested competition could not be found.")
            }
            setIsLoading(false)
        }, 1000)
    }, [id])

    // Get user details by ID
    const getUserDetails = (id) => {
        return (
            mockUsers.find((user) => user.id === id) || {
                name: "Unknown User",
                email: "unknown@example.com",
                avatar: "/placeholder.svg?height=40&width=40",
            }
        )
    }

    // Format date for display
    const formatDate = (date) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case "upcoming":
                return "bg-blue-100 text-blue-800"
            case "ongoing":
                return "bg-green-100 text-green-800"
            case "completed":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (isLoading) {
        return (
            <div className="container py-10">
                <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                        <p className="mt-2 text-sm text-muted-foreground">Loading competition details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!competition) {
        return (
            <div className="container py-10">
                <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg font-medium">Competition not found</p>
                        <p className="mt-1 text-sm text-muted-foreground">The requested competition could not be found.</p>
                        <Button variant="outline" className="mt-4" onClick={() => navigate("/competitions")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Competitions
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-10">
            <div className="mb-6">
                <Button variant="outline" onClick={() => navigate("/competitions")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Competitions
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl">{competition.name}</CardTitle>
                                    <CardDescription>Created on {formatDate(competition.createdAt)}</CardDescription>
                                </div>
                                <Badge variant="outline" className={getStatusColor(competition.status)}>
                                    {competition.status.charAt(0).toUpperCase() + competition.status.slice(1)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{competition.description}</p>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Registration Deadline</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(competition.registrationDeadline)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Event Date</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(competition.eventDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Venue</p>
                                        <p className="text-sm text-muted-foreground">{competition.venue}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Registration Fee</p>
                                        <p className="text-sm text-muted-foreground">${competition.registrationFee}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Team Size</p>
                                        <p className="text-sm text-muted-foreground">
                                            Maximum {competition.maxParticipantsPerTeam} participants per team
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Last Updated</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(competition.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Competition Staff</CardTitle>
                            <CardDescription>People managing this competition</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">AVP</h3>
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage src={getUserDetails(competition.avp).avatar || "/placeholder.svg"} />
                                        <AvatarFallback>{getUserDetails(competition.avp).name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{getUserDetails(competition.avp).name}</p>
                                        <p className="text-xs text-muted-foreground">{getUserDetails(competition.avp).email}</p>
                                    </div>
                                </div>
                            </div>

                            {competition.heads.length > 0 && (
                                <div>
                                    <Separator className="my-2" />
                                    <h3 className="text-sm font-medium text-muted-foreground my-3">Heads ({competition.heads.length})</h3>
                                    <div className="space-y-3">
                                        {competition.heads.map((headId) => (
                                            <div key={headId} className="flex items-center space-x-3">
                                                <Avatar>
                                                    <AvatarImage src={getUserDetails(headId).avatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{getUserDetails(headId).name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{getUserDetails(headId).name}</p>
                                                    <p className="text-xs text-muted-foreground">{getUserDetails(headId).email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {competition.deputies.length > 0 && (
                                <div>
                                    <Separator className="my-2" />
                                    <h3 className="text-sm font-medium text-muted-foreground my-3">
                                        Deputies ({competition.deputies.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {competition.deputies.map((deputyId) => (
                                            <div key={deputyId} className="flex items-center space-x-3">
                                                <Avatar>
                                                    <AvatarImage src={getUserDetails(deputyId).avatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{getUserDetails(deputyId).name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{getUserDetails(deputyId).name}</p>
                                                    <p className="text-xs text-muted-foreground">{getUserDetails(deputyId).email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {competition.officers.length > 0 && (
                                <div>
                                    <Separator className="my-2" />
                                    <h3 className="text-sm font-medium text-muted-foreground my-3">
                                        Officers ({competition.officers.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {competition.officers.map((officerId) => (
                                            <div key={officerId} className="flex items-center space-x-3">
                                                <Avatar>
                                                    <AvatarImage src={getUserDetails(officerId).avatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{getUserDetails(officerId).name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{getUserDetails(officerId).name}</p>
                                                    <p className="text-xs text-muted-foreground">{getUserDetails(officerId).email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
