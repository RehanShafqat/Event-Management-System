import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { PlusCircle, Pencil, Trash2, Search, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { fetchCompetitions, deleteCompetition } from "@/Redux/features/competitionSlice"

export default function CompetitionsPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { competitions, loading, error } = useSelector((state) => state.competitions)
    const [searchQuery, setSearchQuery] = useState("")
    const [competitionToDelete, setCompetitionToDelete] = useState(null)

    useEffect(() => {
        if (!competitions)
            dispatch(fetchCompetitions())
    }, [dispatch, competitions])

    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])

    const handleView = (id) => {
        navigate(`/competitions/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/crud/competitions/${id}?mode=edit`);
    };

    const handleDelete = async () => {
        if (!competitionToDelete) return

        try {
            await dispatch(deleteCompetition(competitionToDelete)).unwrap()
            toast.success("Competition deleted successfully")
        } catch (error) {
            toast.error(error.message || "Failed to delete competition")
        } finally {
            setCompetitionToDelete(null)
        }
    }

    const filteredCompetitions = competitions?.filter((competition) =>
        competition.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="container py-10">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-10">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-2xl font-bold">Competitions</CardTitle>
                        <CardDescription>Manage your competitions, events, and activities</CardDescription>
                    </div>
                    <Button onClick={() => navigate("/crud/competitions/new")}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Competition
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                                placeholder="Search competitions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />
                            <Button variant="outline" size="icon">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex h-96 items-center justify-center">
                            <div className="text-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                                <p className="mt-2 text-sm text-muted-foreground">Loading competitions...</p>
                            </div>
                        </div>
                    ) : filteredCompetitions?.length === 0 ? (
                        <div className="flex h-96 items-center justify-center">
                            <div className="text-center">
                                <p className="text-lg font-medium">No competitions found</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {searchQuery ? "Try adjusting your search" : "Create your first competition to get started"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Registration Fee</TableHead>
                                        <TableHead className="hidden md:table-cell">Registration Deadline</TableHead>
                                        <TableHead className="hidden md:table-cell">Event Date</TableHead>
                                        <TableHead className="hidden lg:table-cell">Venue</TableHead>
                                        <TableHead className="hidden lg:table-cell">Team Size</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCompetitions?.map((competition) => (
                                        <TableRow key={competition._id}>
                                            <TableCell className="font-medium">{competition.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`${competition.status === "upcoming"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : competition.status === "ongoing"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {competition.status.charAt(0).toUpperCase() + competition.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>${competition.registrationFee}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(competition.registrationDeadline).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(competition.eventDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">{competition.venue}</TableCell>
                                            <TableCell className="hidden lg:table-cell">{competition.maxParticipantsPerTeam}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleView(competition._id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" onClick={() => handleEdit(competition._id)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => setCompetitionToDelete(competition._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog
                open={!!competitionToDelete}
                onOpenChange={() => setCompetitionToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            competition.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}