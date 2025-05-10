"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import api from "../api/apiCalls"

export default function ProfilePage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const { user, loading } = useSelector((state) => state.authentication)
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        department: "",
        imageUrl: "",
    })
    const [isDirty, setIsDirty] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (user) {
            console.log("Setting initial user data:", user);
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                department: user.department || "",
                imageUrl: user.imageUrl || "",
            });
            setIsDirty(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const hasChanges =
                profileData.name !== user.name ||
                profileData.department !== user.department ||
                profileData.imageUrl !== user.imageUrl;

            setIsDirty(hasChanges);
        }
    }, [profileData, user]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            navigate("/login")
        }
    }, [user, loading, navigate])

    const departments = ["Engineering", "Marketing", "Sales", "Human Resources", "Finance", "Product", "Design", "SE"]

    // Add this useEffect to log the current department value

    const uploadToCloudinary = async (file) => {
        setIsLoading(true)
        const toastId = toast.loading("Uploading image...")

        try {
            // Create a FormData object to send the file
            const formData = new FormData()
            formData.append("file", file)
            formData.append("upload_preset", "softec")

            // Make the API call to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/driuxeclu/image/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            )

            if (!response.ok) {
                throw new Error("Failed to upload image")
            }

            const data = await response.json()

            // Update profile data with the new avatar URL
            setProfileData(prev => ({
                ...prev,
                imageUrl: data.secure_url,
            }))

            // Don't show success toast here, let the profile update handle it
            toast.dismiss(toastId)
        } catch (err) {
            console.error("Error uploading image:", err)
            toast.error("Failed to upload image. Please try again.", { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }

    const handleAvatarChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            uploadToCloudinary(file)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setProfileData({
            ...profileData,
            [name]: value,
        })
    }

    const handleDepartmentChange = (value) => {
        console.log("Department changed to:", value);
        setProfileData(prev => ({
            ...prev,
            department: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const toastId = toast.loading("Updating profile...")

        try {
            // Only proceed if there are actual changes
            if (!isDirty) {
                toast.dismiss(toastId);
                return;
            }

            console.log("Updating profile with data:", {
                userId: user.id,
                profileData: {
                    name: profileData.name,
                    department: profileData.department,
                    imageUrl: profileData.imageUrl
                }
            });

            const response = await api.user.updateProfile(user.id, {
                name: profileData.name,
                department: profileData.department,
                imageUrl: profileData.imageUrl
            });

            console.log("Profile update response:", response.data);

            if (response.data.success) {
                // Update Redux state with the data from the server
                const updatedUser = {
                    ...user,
                    ...response.data.data
                };

                console.log("Updating localStorage with:", updatedUser);
                // Update localStorage
                localStorage.setItem("user", JSON.stringify(updatedUser));

                // Update Redux state through dispatch
                dispatch({
                    type: 'authentication/updateUser',
                    payload: updatedUser
                });

                toast.success("Profile updated successfully", { id: toastId });
                setIsDirty(false); // Reset dirty state after successful update
            } else {
                throw new Error(response.data.message || "Failed to update profile");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error(err.response?.data?.message || "Failed to update profile. Please try again.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-[800px]">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Loading profile information...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-8">
                        <div className="animate-pulse space-y-4 w-full">
                            <div className="flex justify-center">
                                <div className="h-24 w-24 rounded-full bg-gray-200"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[800px]">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>View and edit your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-8">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={profileData.imageUrl || "/placeholder.svg"} alt={profileData.name} />
                                    <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById("avatar-upload").click()}
                                        disabled={isLoading}
                                    >
                                        Change Avatar
                                    </Button>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" value={profileData.name} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                    <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select
                                        value={profileData.department || user?.department || ""}
                                        onValueChange={handleDepartmentChange}
                                    >
                                        <SelectTrigger id="department">
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept} value={dept}>
                                                    {dept}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input
                                        id="role"
                                        name="role"
                                        value={user.role}
                                        disabled
                                    />
                                    <p className="text-xs text-muted-foreground">Your role cannot be changed</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                        setProfileData({
                            name: user.name || "",
                            email: user.email || "",
                            department: user.department || "",
                            imageUrl: user.imageUrl || "",
                        });
                        setIsDirty(false);
                    }}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !isDirty}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
