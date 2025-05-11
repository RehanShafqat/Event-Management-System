"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTasks, updateTaskStatus, deleteTask } from "../../Redux/features/taskSlice"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { format } from "date-fns"
import {
    Trash2,
    CheckCircle2,
    Clock,
    Search,
    AlertTriangle,
    Loader2,
    ClipboardList,
    ArrowUpDown,
    Eye,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Input } from "../ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

const TaskList = ({ filter = "all" }) => {
    const dispatch = useDispatch()
    const { tasks, loading } = useSelector((state) => state.tasks)
    const { user } = useSelector((state) => state.authentication)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState({ key: "dueDate", direction: "asc" })
    const [selectedTask, setSelectedTask] = useState(null)

    useEffect(() => {
        dispatch(fetchTasks())
    }, [dispatch])

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await dispatch(updateTaskStatus({ id: taskId, statusData: { status: newStatus } })).unwrap()
            toast.success("Task status updated successfully")
        } catch (error) {
            toast.error(error.message || "Failed to update task status")
        }
    }

    const handleDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await dispatch(deleteTask(taskId)).unwrap()
                toast.success("Task deleted successfully")
            } catch (error) {
                toast.error(error.message || "Failed to delete task")
            }
        }
    }

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case "urgent":
                return (
                    <Badge variant="destructive" className="font-medium">
                        Urgent
                    </Badge>
                )
            case "high":
                return <Badge className="bg-orange-500 hover:bg-orange-600 font-medium">High</Badge>
            case "medium":
                return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">Medium</Badge>
            case "low":
                return <Badge className="bg-green-500 hover:bg-green-600 font-medium">Low</Badge>
            default:
                return (
                    <Badge variant="outline" className="font-medium">
                        Unknown
                    </Badge>
                )
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return (
                    <Badge className="bg-green-500 hover:bg-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                    </Badge>
                )
            case "in-progress":
                return (
                    <Badge className="bg-blue-500 hover:bg-blue-600 font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        In Progress
                    </Badge>
                )
            case "overdue":
                return (
                    <Badge variant="destructive" className="font-medium flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Overdue
                    </Badge>
                )
            default:
                return (
                    <Badge variant="secondary" className="font-medium">
                        Assigned
                    </Badge>
                )
        }
    }

    const filteredTasks = tasks
        .filter((task) => {
            // Apply filter
            if (filter === "assigned-to-me") {
                return task.assignedTo._id === user.id
            } else if (filter === "assigned-by-me") {
                return task.assignedBy._id === user.id
            }
            return true
        })
        .filter((task) => {
            // Apply search
            if (!searchTerm) return true
            const searchLower = searchTerm.toLowerCase()
            return (
                task.title.toLowerCase().includes(searchLower) ||
                task.description.toLowerCase().includes(searchLower) ||
                task.assignedTo.name.toLowerCase().includes(searchLower) ||
                task.assignedBy.name.toLowerCase().includes(searchLower)
            )
        })

    // Sort tasks
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortConfig.key === "dueDate") {
            const dateA = new Date(a.dueDate)
            const dateB = new Date(b.dueDate)
            return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA
        } else if (sortConfig.key === "priority") {
            const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 }
            return sortConfig.direction === "asc"
                ? priorityOrder[a.priority] - priorityOrder[b.priority]
                : priorityOrder[b.priority] - priorityOrder[a.priority]
        } else {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1
            }
            return 0
        }
    })

    const requestSort = (key) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key, direction })
    }

    if (loading) {
        return (
            <Card className="w-full">
                <CardContent className="p-10 flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading tasks...</p>
                </CardContent>
            </Card>
        )
    }

    if (filteredTasks.length === 0) {
        return (
            <Card className="w-full">
                <CardContent className="p-10 flex flex-col items-center justify-center">
                    <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                        {searchTerm
                            ? "No tasks match your search criteria. Try a different search term."
                            : filter === "assigned-to-me"
                                ? "You don't have any tasks assigned to you yet."
                                : filter === "assigned-by-me"
                                    ? "You haven't assigned any tasks yet."
                                    : "There are no tasks in the system yet."}
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle>
                        {filter === "assigned-to-me"
                            ? "Tasks Assigned to Me"
                            : filter === "assigned-by-me"
                                ? "Tasks I've Assigned"
                                : "All Tasks"}
                    </CardTitle>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">
                                    <Button
                                        variant="ghost"
                                        onClick={() => requestSort("title")}
                                        className="flex items-center gap-1 font-semibold"
                                    >
                                        Title
                                        <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead className="hidden md:table-cell">Assigned By</TableHead>
                                <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => requestSort("dueDate")}
                                        className="flex items-center gap-1 font-semibold"
                                    >
                                        Due Date
                                        <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => requestSort("priority")}
                                        className="flex items-center gap-1 font-semibold"
                                    >
                                        Priority
                                        <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedTasks.map((task) => (
                                <TableRow key={task._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="truncate max-w-[200px]">{task.title}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[200px] hidden sm:inline">
                                                {task.description.substring(0, 50)}
                                                {task.description.length > 50 ? "..." : ""}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{task.assignedBy.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{task.assignedTo.name}</TableCell>
                                    <TableCell>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span className="whitespace-nowrap">{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>{format(new Date(task.dueDate), "MMMM dd, yyyy HH:mm")}</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setSelectedTask(task)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>{task.title}</DialogTitle>
                                                        <DialogDescription>Task details and information</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">Assigned By</p>
                                                                <p>{task.assignedBy.name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                                                                <p>{task.assignedTo.name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                                                                <p>{format(new Date(task.dueDate), "MMMM dd, yyyy HH:mm")}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                                                <div className="mt-1">{getStatusBadge(task.status)}</div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">Priority</p>
                                                                <div className="mt-1">{getPriorityBadge(task.priority)}</div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                                                            <p className="text-sm whitespace-pre-line">{task.description}</p>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            {task.assignedTo._id === user.id && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={task.status === "completed"}
                                                        >
                                                            Update
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleStatusChange(task._id, "in-progress")}>
                                                            Mark as In Progress
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(task._id, "completed")}>
                                                            Mark as Completed
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}

                                            {(task.assignedBy._id === user.id || user.role === "President") && (
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete(task._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default TaskList
