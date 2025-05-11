import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ROLES } from "@/utils/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import api from "@/api/apiCalls";

const ROLE_HIERARCHY = {
    [ROLES.PRESIDENT]: ROLES.VP,
    [ROLES.VP]: ROLES.AVP,
    [ROLES.AVP]: ROLES.HEAD,
    [ROLES.HEAD]: ROLES.DEPUTY,
    [ROLES.DEPUTY]: ROLES.OFFICER,
};

const RoleManagement = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user: currentUser } = useSelector((state) => state.authentication);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.user.getUsersByRole(ROLE_HIERARCHY[currentUser.role]);
            setUsers(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch users");
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.role) {
            fetchUsers();
        }
    }, [currentUser?.role]);

    const handleAddUser = async () => {
        try {
            setLoading(true);
            await api.user.createUser({
                ...newUser,
                role: ROLE_HIERARCHY[currentUser.role],
            });
            toast.success("User added successfully");
            setIsAddDialogOpen(false);
            setNewUser({ name: "", email: "", password: "", role: "" });
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add user");
            console.error("Error adding user:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            setLoading(true);
            await api.user.deleteUser(userId);
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete user");
            console.error("Error deleting user:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser?.role || !ROLE_HIERARCHY[currentUser.role]) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">You don't have permission to manage roles.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage {ROLE_HIERARCHY[currentUser.role]}s</h1>
                <Button onClick={() => setIsAddDialogOpen(true)}>Add {ROLE_HIERARCHY[currentUser.role]}</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{ROLE_HIERARCHY[currentUser.role]}s List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteUser(user._id)}
                                            disabled={loading}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New {ROLE_HIERARCHY[currentUser.role]}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddUser} disabled={loading || !newUser.name || !newUser.email || !newUser.password}>
                            {loading ? "Adding..." : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RoleManagement; 