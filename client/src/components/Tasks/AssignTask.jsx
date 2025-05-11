"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSubordinates, createTask } from "../../Redux/features/taskSlice"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ClipboardList, AlertTriangle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const AssignTask = ({ onSuccess }) => {
    const dispatch = useDispatch()
    const { subordinates, loading, error } = useSelector((state) => state.tasks)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        priority: "medium",
    })

    useEffect(() => {
        dispatch(fetchSubordinates())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSelectChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const taskData = {
                ...formData,
                assignedToId: formData.assignedTo,
            }
            delete taskData.assignedTo
            await dispatch(createTask(taskData)).unwrap()
            toast.success("Task assigned successfully")
            setFormData({
                title: "",
                description: "",
                assignedTo: "",
                dueDate: "",
                priority: "medium",
            })
            if (onSuccess) onSuccess()
        } catch (error) {
            toast.error(error.message || "Failed to assign task")
        }
    }

    // Set min date to today
    const today = new Date().toISOString().split("T")[0]

    return (
        <Card className="shadow-md border-primary/10">
            <CardHeader className="space-y-1 bg-muted/30 pb-4">
                <CardTitle className="text-2xl flex items-center gap-2">
                    <ClipboardList className="h-6 w-6 text-primary" />
                    Assign New Task
                </CardTitle>
                <CardDescription>Create and assign a new task to your team members</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter task title"
                                className="w-full"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assignedTo">Assign To</Label>
                            <Select
                                value={formData.assignedTo}
                                onValueChange={(value) => handleSelectChange("assignedTo", value)}
                                required
                            >
                                <SelectTrigger id="assignedTo" className="w-full">
                                    <SelectValue placeholder="Select a team member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {loading ? (
                                        <SelectItem value="loading" disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : subordinates.length === 0 ? (
                                        <SelectItem value="no-members" disabled>
                                            No team members found
                                        </SelectItem>
                                    ) : (
                                        subordinates.map((subordinate) => (
                                            <SelectItem key={subordinate._id} value={subordinate._id}>
                                                {subordinate.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide detailed task description"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="dueDate" className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                Due Date
                            </Label>
                            <Input
                                id="dueDate"
                                type="datetime-local"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                min={today}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Priority
                            </Label>
                            <RadioGroup
                                value={formData.priority}
                                onValueChange={(value) => handleSelectChange("priority", value)}
                                className="flex space-x-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="low" id="low" />
                                    <Label htmlFor="low" className="text-green-600 font-medium">
                                        Low
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="medium" id="medium" />
                                    <Label htmlFor="medium" className="text-yellow-600 font-medium">
                                        Medium
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="high" id="high" />
                                    <Label htmlFor="high" className="text-orange-600 font-medium">
                                        High
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="urgent" id="urgent" />
                                    <Label htmlFor="urgent" className="text-red-600 font-medium">
                                        Urgent
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-2 border-t bg-muted/30">
                    <Button type="button" variant="outline" onClick={onSuccess}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Assigning..." : "Assign Task"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default AssignTask
