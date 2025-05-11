"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { fetchPublicCompetitionById, registerTeam } from "@/Redux/features/participationSlice"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    UsersIcon,
    DollarSignIcon,
    PlusIcon,
    MinusIcon,
    TrophyIcon,
} from "lucide-react"

function PublicCompetitionDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentCompetition, loading } = useSelector((state) => state.participation)

    useEffect(() => {
        const toastId = toast.loading("Loading competition details...")
        dispatch(fetchPublicCompetitionById(id))
            .then(() => {
                toast.dismiss(toastId)
            })
            .catch((error) => {
                toast.error(error.message || "Failed to load competition details", { id: toastId })
            })
    }, [dispatch, id])

    // Form state
    const [teamName, setTeamName] = useState("")
    const [participants, setParticipants] = useState([{ name: "", email: "", phone: "", institution: "" }])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Mock data for heads
    const mockHeads = [
        {
            _id: "1",
            name: "John Smith",
            email: "john.smith@fast.edu.pk",
            role: "Event Head",
            department: "Computer Science"
        },
        {
            _id: "2",
            name: "Sarah Johnson",
            email: "sarah.johnson@fast.edu.pk",
            role: "Event Coordinator",
            department: "Computer Science"
        }
    ]

    const addParticipant = () => {
        if (participants.length < currentCompetition?.maxParticipantsPerTeam) {
            setParticipants([...participants, { name: "", email: "", phone: "", institution: "" }])
        } else {
            toast.error(`Maximum ${currentCompetition?.maxParticipantsPerTeam} participants allowed`)
        }
    }

    const removeParticipant = (index) => {
        if (participants.length > 1) {
            setParticipants(participants.filter((_, i) => i !== index))
        } else {
            toast.error("At least one participant is required")
        }
    }

    const updateParticipant = (index, field, value) => {
        const updatedParticipants = [...participants]
        updatedParticipants[index][field] = value
        setParticipants(updatedParticipants)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Show loading toast
        const toastId = toast.loading("Registering your team...")

        try {
            // Validate team name
            if (!teamName.trim()) {
                toast.error("Please enter a team name", { id: toastId })
                setIsSubmitting(false)
                return
            }

            // Validate participants
            const validParticipants = participants.every(
                (p) => p.name.trim() && p.email.trim() && p.phone.trim() && p.institution.trim()
            )

            if (!validParticipants) {
                toast.error("Please fill in all participant details", { id: toastId })
                setIsSubmitting(false)
                return
            }

            // Prepare team data according to server requirements
            const teamData = {
                competitionId: id,
                teamName: teamName.trim(),
                participants: participants.map(p => ({
                    name: p.name.trim(),
                    email: p.email.trim(),
                    phone: p.phone.trim(),
                    institution: p.institution.trim()
                }))
            }

            // Dispatch the registerTeam action
            const resultAction = await dispatch(registerTeam(teamData))

            if (registerTeam.fulfilled.match(resultAction)) {
                toast.success("Team registered successfully! You will receive an email with the bank details.", { id: toastId })
                // Reset form
                setTeamName("")
                setParticipants([{ name: "", email: "", phone: "", institution: "" }])
            } else {
                toast.error(resultAction.payload || "Failed to register team", { id: toastId })
            }
        } catch (error) {
            toast.error(error.message || "An error occurred while registering the team", { id: toastId })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6">
                <div className="container mx-auto max-w-7xl">
                    <Card className="border-0 shadow-xl">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Loading Competition</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Please wait while we fetch the competition details...
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!currentCompetition) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6">
                <div className="container mx-auto max-w-7xl">
                    <Card className="border-0 shadow-xl">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Competition not found</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                The competition you're looking for doesn't exist or has been removed.
                            </p>
                            <Button onClick={() => navigate("/competitions")}>Back to Competitions</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const formatDate = (dateString) => {
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const formatTime = (dateString) => {
        const options = { hour: "2-digit", minute: "2-digit" }
        return new Date(dateString).toLocaleTimeString(undefined, options)
    }

    const daysUntilDeadline = () => {
        const deadline = new Date(currentCompetition.registrationDeadline)
        const today = new Date()
        const diffTime = Math.abs(deadline - today)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const renderEventHeads = () => {
        const heads = currentCompetition?.heads?.length > 0 ? currentCompetition.heads : mockHeads

        return (
            <>
                <Separator />
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Event Coordinators</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {heads.map((head) => (
                            <div
                                key={head._id}
                                className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-xl font-semibold text-purple-700 dark:text-purple-300">
                                            {head.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="space-y-2 flex-grow">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {head.name}
                                            </h4>
                                            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                                {head.role || "Event Coordinator"}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <a href={`mailto:${head.email}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                                    {head.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-7xl">
                {/* Competition Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                        {currentCompetition.name}
                    </h1>
                    <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">Join the competition and showcase your skills</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Competition Details - Takes 2/3 of the space on large screens */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Card */}
                        <Card className="overflow-hidden border-0 shadow-xl">
                            <div className="relative h-80 w-full">
                                <img
                                    src={currentCompetition.imageUrl || "https://via.placeholder.com/1200x600"}
                                    alt={currentCompetition.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5">
                                            ${currentCompetition.registrationFee} Registration
                                        </Badge>
                                        <Badge className="bg-green-600 hover:bg-green-700 px-4 py-1.5">
                                            ${currentCompetition.winnerPrize} Prize Pool
                                        </Badge>
                                        <Badge variant="outline" className="bg-black/40 text-white border-white/20">
                                            {daysUntilDeadline()} days left to register
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-gray-700 dark:text-gray-200 text-lg">{currentCompetition.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Event Details Card */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-2">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Event Details</h2>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Prizes */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Prizes</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900/30">
                                            <div className="flex items-center gap-3 mb-2">
                                                <TrophyIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                                <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400">Winner</h4>
                                            </div>
                                            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                                                ${currentCompetition.winnerPrize}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                                            <div className="flex items-center gap-3 mb-2">
                                                <TrophyIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-400">Runner Up</h4>
                                            </div>
                                            <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                                                ${currentCompetition.runnerUpPrize}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Event Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                                                <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {formatDate(currentCompetition.eventDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                                                <ClockIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {formatTime(currentCompetition.eventDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                                                <MapPinIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Venue</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{currentCompetition.venue}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                                                <UsersIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Team Size</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    Up to {currentCompetition.maxParticipantsPerTeam} members
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                                                <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Registration Deadline</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {formatDate(currentCompetition.registrationDeadline)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                                                <DollarSignIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Registration Fee</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    ${currentCompetition.registrationFee}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {renderEventHeads()}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Registration Form - Takes 1/3 of the space on large screens */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
                                <CardHeader className="text-my-purple  ">
                                    <h2 className="text-2xl font-bold text-my-purple ">Team Registration</h2>
                                    <p className="text-my-purple">Register your team for {currentCompetition.name}</p>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="teamName" className="text-gray-700 dark:text-gray-200">
                                                Team Name
                                            </Label>
                                            <Input
                                                id="teamName"
                                                value={teamName}
                                                onChange={(e) => setTeamName(e.target.value)}
                                                required
                                                placeholder="Enter your team name"
                                                className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                                                    Team Members ({participants.length}/{currentCompetition.maxParticipantsPerTeam})
                                                </h3>
                                                <Button
                                                    type="button"
                                                    onClick={addParticipant}
                                                    disabled={participants.length >= currentCompetition.maxParticipantsPerTeam}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/30"
                                                >
                                                    <PlusIcon className="h-4 w-4 mr-1" />
                                                    Add Member
                                                </Button>
                                            </div>

                                            <Accordion type="single" collapsible className="w-full border rounded-lg overflow-hidden">
                                                {participants.map((participant, index) => (
                                                    <AccordionItem
                                                        key={index}
                                                        value={`participant-${index}`}
                                                        className={index !== 0 ? "border-t" : ""}
                                                    >
                                                        <AccordionTrigger className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-medium">
                                                            {participant.name || `Member ${index + 1}`}
                                                        </AccordionTrigger>
                                                        <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <h4 className="font-medium text-gray-700 dark:text-gray-200">Member Details</h4>
                                                                {participants.length > 1 && (
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => removeParticipant(index)}
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                                    >
                                                                        <MinusIcon className="h-4 w-4 mr-1" />
                                                                        Remove
                                                                    </Button>
                                                                )}
                                                            </div>
                                                            <div className="grid gap-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor={`name-${index}`} className="text-gray-700 dark:text-gray-200">
                                                                        Full Name
                                                                    </Label>
                                                                    <Input
                                                                        id={`name-${index}`}
                                                                        value={participant.name}
                                                                        onChange={(e) => updateParticipant(index, "name", e.target.value)}
                                                                        required
                                                                        placeholder="John Doe"
                                                                        className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor={`email-${index}`} className="text-gray-700 dark:text-gray-200">
                                                                        Email
                                                                    </Label>
                                                                    <Input
                                                                        id={`email-${index}`}
                                                                        type="email"
                                                                        value={participant.email}
                                                                        onChange={(e) => updateParticipant(index, "email", e.target.value)}
                                                                        required
                                                                        placeholder="john@example.com"
                                                                        className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor={`phone-${index}`} className="text-gray-700 dark:text-gray-200">
                                                                        Phone
                                                                    </Label>
                                                                    <Input
                                                                        id={`phone-${index}`}
                                                                        type="tel"
                                                                        value={participant.phone}
                                                                        onChange={(e) => updateParticipant(index, "phone", e.target.value)}
                                                                        required
                                                                        placeholder="+1 (555) 123-4567"
                                                                        className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor={`institution-${index}`} className="text-gray-700 dark:text-gray-200">
                                                                        Institution
                                                                    </Label>
                                                                    <Input
                                                                        id={`institution-${index}`}
                                                                        value={participant.institution}
                                                                        onChange={(e) => updateParticipant(index, "institution", e.target.value)}
                                                                        required
                                                                        placeholder="University/College name"
                                                                        className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-6 border-t">
                                    <Button
                                        type="submit"
                                        onClick={handleSubmit}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700 h-12 text-lg font-medium"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Registering..." : "Register Team"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicCompetitionDetail
