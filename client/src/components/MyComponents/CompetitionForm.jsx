import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCompetition, updateCompetition, fetchAVPs } from "@/Redux/features/competitionSlice";

export default function CompetitionForm({ competition, isEditing = false }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { avps, loading: avpsLoading } = useSelector((state) => state.competitions);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: "",
        registrationFee: "",
        winnerPrize: "",
        runnerUpPrize: "",
        registrationDeadline: "",
        eventDate: "",
        venue: "",
        maxParticipantsPerTeam: "",
        status: "upcoming",
        avp: "",
    });
    const [initialData, setInitialData] = useState(null);

    const hasChanges = () => {
        if (!initialData) return true;

        // Compare each field individually
        const fields = [
            'name',
            'description',
            'imageUrl',
            'registrationFee',
            'winnerPrize',
            'runnerUpPrize',
            'registrationDeadline',
            'eventDate',
            'venue',
            'maxParticipantsPerTeam',
            'status',
            'avp'
        ];

        return fields.some(field => {
            const currentValue = formData[field];
            const initialValue = initialData[field];

            // Handle numeric fields
            if (['registrationFee', 'winnerPrize', 'runnerUpPrize', 'maxParticipantsPerTeam'].includes(field)) {
                return Number(currentValue) !== Number(initialValue);
            }

            // Handle date fields
            if (['registrationDeadline', 'eventDate'].includes(field)) {
                return currentValue !== initialValue;
            }

            // Handle all other fields
            return currentValue !== initialValue;
        });
    };

    // Debug effect to track changes
    useEffect(() => {
        if (initialData) {
            console.log('Initial Data:', initialData);
            console.log('Current Form Data:', competition);
            console.log('Has Changes:', hasChanges());
        }
    }, [formData, initialData, competition]);

    useEffect(() => {
        if (!avps && !avpsLoading) {
            dispatch(fetchAVPs());
        }
    }, [dispatch, avps, avpsLoading]);


    useEffect(() => {
        if (competition && isEditing) {
            const formattedData = {
                name: competition.name || "",
                description: competition.description || "",
                imageUrl: competition.imageUrl || "",
                registrationFee: competition.registrationFee?.toString() || "",
                winnerPrize: competition.winnerPrize?.toString() || "",
                runnerUpPrize: competition.runnerUpPrize?.toString() || "",
                registrationDeadline: competition.registrationDeadline ? new Date(competition.registrationDeadline).toISOString().split('T')[0] : "",
                eventDate: competition.eventDate ? new Date(competition.eventDate).toISOString().split('T')[0] : "",
                venue: competition.venue || "",
                maxParticipantsPerTeam: competition.maxParticipantsPerTeam?.toString() || "",
                status: competition.status || "upcoming",
                avp: "",  // Initialize as empty string
            };
            console.log('Setting initial data:', formattedData);
            setFormData(formattedData);
            setInitialData(formattedData);
        }
    }, [competition, isEditing]);

    // Add a separate effect to handle AVP selection after AVPs are loaded
    useEffect(() => {
        if (competition?.avp?.name && avps && !avpsLoading) {
            setFormData(prev => ({
                ...prev,
                avp: competition.avp.name
            }));
        }
    }, [competition?.avp?.name, avps, avpsLoading]);

    const uploadToCloudinary = async (file) => {
        setIsLoading(true);
        const toastId = toast.loading("Uploading image...");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "softec");

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/driuxeclu/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                imageUrl: data.secure_url,
            }));

            toast.dismiss(toastId);
            toast.success("Image uploaded successfully");
        } catch (err) {
            console.error("Error uploading image:", err);
            toast.error("Failed to upload image. Please try again.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadToCloudinary(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: value,
            };

            return newData;
        });
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: value,
            };
            console.log('Select changed:', name, value);
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading(isEditing ? "Updating competition..." : "Creating competition...");

        try {
            const competitionData = {
                ...formData,
                registrationFee: Number(formData.registrationFee),
                winnerPrize: Number(formData.winnerPrize),
                runnerUpPrize: Number(formData.runnerUpPrize),
                maxParticipantsPerTeam: Number(formData.maxParticipantsPerTeam),
                avpId: formData.avp,
            };

            if (isEditing) {
                await dispatch(updateCompetition({ id: competition._id, competitionData })).unwrap();
                toast.success("Competition updated successfully", { id: toastId });
            } else {
                await dispatch(createCompetition(competitionData)).unwrap();
                toast.success("Competition created successfully", { id: toastId });
            }

            navigate("/crud/competitions");
        } catch (error) {
            toast.error(error.message || "Something went wrong", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-48 h-48">
                        <img
                            src={formData.imageUrl || "/placeholder.svg"}
                            alt="Competition"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("image-upload").click()}
                            disabled={isLoading}
                        >
                            Change Image
                        </Button>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Competition Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleSelectChange("status", value)}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="registrationFee">Registration Fee</Label>
                        <Input
                            id="registrationFee"
                            name="registrationFee"
                            type="number"
                            min="0"
                            value={formData.registrationFee}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="winnerPrize">Winner Prize</Label>
                        <Input
                            id="winnerPrize"
                            name="winnerPrize"
                            type="number"
                            min="0"
                            value={formData.winnerPrize}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="runnerUpPrize">Runner-up Prize</Label>
                        <Input
                            id="runnerUpPrize"
                            name="runnerUpPrize"
                            type="number"
                            min="0"
                            value={formData.runnerUpPrize}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                        <Input
                            id="registrationDeadline"
                            name="registrationDeadline"
                            type="date"
                            value={formData.registrationDeadline}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="eventDate">Event Date</Label>
                        <Input
                            id="eventDate"
                            name="eventDate"
                            type="date"
                            value={formData.eventDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="venue">Venue</Label>
                        <Input
                            id="venue"
                            name="venue"
                            value={formData.venue}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maxParticipantsPerTeam">Max Participants Per Team</Label>
                        <Input
                            id="maxParticipantsPerTeam"
                            name="maxParticipantsPerTeam"
                            type="number"
                            min="1"
                            value={formData.maxParticipantsPerTeam}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avp">AVP</Label>
                        <Select
                            defaultValue={competition?.avp?.name}
                            onValueChange={(value) => handleSelectChange("avp", value)}
                            disabled={avpsLoading}
                        >
                            <SelectTrigger id="avp">
                                <SelectValue placeholder="Select AVP">
                                    {competition?.avp?.name}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {avps?.map((avp) => (
                                    <SelectItem key={avp._id} value={avp._id}>
                                        {avp.name}
                                    </SelectItem>
                                ))}
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
                        onChange={handleInputChange}
                        required
                        className="min-h-[100px]"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/crud/competitions")}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading || (isEditing && !hasChanges())}
                >
                    {isLoading ? "Saving..." : isEditing ? "Update Competition" : "Create Competition"}
                </Button>
            </div>
        </form>
    );
} 