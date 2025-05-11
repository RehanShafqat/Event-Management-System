"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import AssignTask from "../components/Tasks/AssignTask"
import TaskList from "../components/Tasks/TaskList"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { PlusCircle, ClipboardList, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { ROLES } from "../utils/roles"

const Tasks = () => {
    const [showAssignForm, setShowAssignForm] = useState(false)
    const { user } = useSelector((state) => state.authentication)
    const { tasks } = useSelector((state) => state.tasks)

    // Check if user can assign tasks (officers cannot assign tasks)
    const canAssignTasks = user.role !== ROLES.OFFICER

    // Calculate task statistics
    const getTaskStats = () => {
        if (!tasks || !tasks.length) return { total: 0, completed: 0, inProgress: 0, overdue: 0 }

        return {
            total: tasks.length,
            completed: tasks.filter((task) => task.status === "completed").length,
            inProgress: tasks.filter((task) => task.status === "in-progress").length,
            overdue: tasks.filter((task) => task.status === "overdue").length,
        }
    }

    const stats = getTaskStats()

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
                    <p className="text-muted-foreground mt-1">Manage and track tasks across your organization</p>
                </div>

                {canAssignTasks && (
                    <Button onClick={() => setShowAssignForm(!showAssignForm)} className="flex items-center gap-2" size="lg">
                        <PlusCircle className="h-5 w-5" />
                        {showAssignForm ? "Hide Form" : "Assign New Task"}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.total}</h3>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <ClipboardList className="h-6 w-6 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Completed</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.completed}</h3>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.inProgress}</h3>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.overdue}</h3>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {showAssignForm && canAssignTasks && (
                <div className="my-6">
                    <AssignTask onSuccess={() => setShowAssignForm(false)} />
                </div>
            )}

            <Tabs defaultValue="all" className="mt-6">
                <TabsList className="mb-4">
                    <TabsTrigger value="all">All Tasks</TabsTrigger>
                    <TabsTrigger value="assigned-to-me">Assigned to Me</TabsTrigger>
                    <TabsTrigger value="assigned-by-me">Assigned by Me</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <TaskList filter="all" />
                </TabsContent>
                <TabsContent value="assigned-to-me">
                    <TaskList filter="assigned-to-me" />
                </TabsContent>
                <TabsContent value="assigned-by-me">
                    <TaskList filter="assigned-by-me" />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Tasks
