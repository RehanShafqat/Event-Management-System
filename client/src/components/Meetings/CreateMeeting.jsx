import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format, parse } from "date-fns"
import { createMeeting } from "../../Redux/features/meetingSlice"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { cn } from "../../lib/utils"
import { CalendarIcon, Clock } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    date: z.date({
        required_error: "Date is required",
    }),
    time: z.string().min(1, "Time is required"),
    location: z.string().min(1, "Location is required"),
    attendeeRoles: z.array(z.string()).min(1, "Select at least one role"),
})

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
        for (const minute of [0, 30]) {
            const formattedHour = hour.toString().padStart(2, "0")
            const formattedMinute = minute.toString().padStart(2, "0")
            const time = `${formattedHour}:${formattedMinute}`
            const label = format(parse(time, "HH:mm", new Date()), "h:mm a")
            options.push({ value: time, label })
        }
    }
    return options
}

const timeOptions = generateTimeOptions()

const CreateMeeting = ({ onSuccess }) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.authentication)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date(),
            time: "09:00", // Default time
            location: "",
            attendeeRoles: [],
        },
    })

    const getValidRoles = () => {
        switch (user.role) {
            case "President":
                return ["VP", "AVP", "Head", "Deputy", "Officer"]
            case "VP":
                return ["AVP", "Head", "Deputy", "Officer"]
            case "AVP":
                return ["Head", "Deputy", "Officer"]
            case "Head":
                return ["Deputy", "Officer"]
            case "Deputy":
                return ["Officer"]
            default:
                return []
        }
    }

    const getRolesUpToLevel = (selectedRole) => {
        // Get roles from selected role up to user's role
        const roleOrder = ["President", "VP", "AVP", "Head", "Deputy", "Officer"]
        const selectedIndex = roleOrder.indexOf(selectedRole)
        const organizerIndex = roleOrder.indexOf(user.role)

        // Get all roles from the selected role up to the organizer's role
        // We need to swap the indices if organizerIndex is less than selectedIndex
        const startIndex = Math.min(selectedIndex, organizerIndex)
        const endIndex = Math.max(selectedIndex, organizerIndex) + 1

        // Get the roles and filter out President
        return roleOrder.slice(startIndex, endIndex).filter((role) => role !== "President")
    }

    const validRoles = getValidRoles()

    const onSubmit = async (values) => {
        try {
            // Combine date and time
            const { date, time, ...rest } = values
            const [hours, minutes] = time.split(":")
            const dateTime = new Date(date)
            dateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))

            // Get all roles up to the selected level
            const selectedRole = values.attendeeRoles[0]
            const rolesToInvite = getRolesUpToLevel(selectedRole)

            const meetingData = {
                ...rest,
                dateTime,
                attendeeRoles: rolesToInvite,
            }

            await dispatch(createMeeting(meetingData)).unwrap()
            onSuccess()
        } catch (error) {
            console.error("Failed to create meeting:", error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter meeting title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter meeting description" className="resize-none min-h-[100px]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                            >
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            initialFocus
                                            footer={
                                                <div className="px-4 pb-2 pt-0 text-sm text-muted-foreground">
                                                    {field.value ? `Selected: ${format(field.value, "PPP")}` : "Select a date"}
                                                </div>
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a time">
                                                {field.value ? (
                                                    <div className="flex items-center">
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        {format(parse(field.value, "HH:mm", new Date()), "h:mm a")}
                                                    </div>
                                                ) : (
                                                    "Select a time"
                                                )}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-[300px]">
                                        {timeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter meeting location" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="attendeeRoles"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Role Level</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(value) => field.onChange([value])}
                                    value={field.value?.[0] || ""}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
                                >
                                    {validRoles.map((role) => (
                                        <FormItem key={role} className="flex items-center space-x-3 space-y-0 rounded-md border p-3">
                                            <FormControl>
                                                <RadioGroupItem value={role} />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">{role}</FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <p className="text-sm text-muted-foreground mt-2">
                                Selecting a role will include that role and all roles up to {user.role} in your competition's hierarchy.
                            </p>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onSuccess}>
                        Cancel
                    </Button>
                    <Button type="submit">Create Meeting</Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateMeeting
