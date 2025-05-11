import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/api/apiCalls";

const RecruitmentForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [competitions, setCompetitions] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        appliedRole: "",
        experience: "",
        skills: "",
        resumeUrl: "",
        competitionId: "",
    });

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const response = await api.participation.getAllPublicCompetitions();
                setCompetitions(response.data.data);
            } catch (error) {
                toast.error("Failed to fetch competitions");
            }
        };
        fetchCompetitions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            appliedRole: value,
        }));
    };

    const handleCompetitionChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            competitionId: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert skills string to array and transform competitionId to competition
            const applicationData = {
                ...formData,
                skills: formData.skills.split(",").map((skill) => skill.trim()),
                competition: formData.competitionId, // Transform competitionId to competition
            };
            delete applicationData.competitionId; // Remove the old field

            await api.recruitment.submitApplication(applicationData);
            toast.success("Application submitted successfully!");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Apply to Join SOFTEC
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="competitionId">Competition</Label>
                            <Select
                                value={formData.competitionId}
                                onValueChange={handleCompetitionChange}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a competition" />
                                </SelectTrigger>
                                <SelectContent>
                                    {competitions.map((competition) => (
                                        <SelectItem key={competition._id} value={competition._id}>
                                            {competition.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email address"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="appliedRole">Role</Label>
                            <Select
                                value={formData.appliedRole}
                                onValueChange={handleRoleChange}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AVP">AVP</SelectItem>
                                    <SelectItem value="Head">Head</SelectItem>
                                    <SelectItem value="Deputy">Deputy</SelectItem>
                                    <SelectItem value="Officer">Officer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience</Label>
                            <Textarea
                                id="experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                                placeholder="Describe your relevant experience"
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="skills">Skills (comma-separated)</Label>
                            <Input
                                id="skills"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Leadership, Event Management, Communication"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="resumeUrl">Resume URL (Optional)</Label>
                            <Input
                                id="resumeUrl"
                                name="resumeUrl"
                                value={formData.resumeUrl}
                                onChange={handleChange}
                                placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Application"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecruitmentForm; 