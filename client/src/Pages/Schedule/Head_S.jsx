import React, { useState } from "react"
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const Head_S = () => {
  const [Deputies] = useState([
    "Rehan",
    "Ali",
    "Sara",
    "Aisha",
    "Tariq",
    "Fatima",
  ])

  const form = useForm({
    defaultValues: {
      meetingName: "",
      purpose: "",
      audience: "all",
      date: "",
    },
  })

  const onSubmit = (data) => {
    if (!data.meetingName || !data.purpose || !data.date) {
      alert("❌ Please fill in all fields.")
      return
    }

    console.log("Submitted data:", data)
    alert(`✅ Meeting "${data.meetingName}" submitted successfully!`)
    form.reset()
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl space-y-8">
        <h2 className="text-3xl font-semibold bg-black text-white p-4 rounded-md text-center">
          Your Deputy Heads
        </h2>

        <ul className="list-decimal pl-6 space-y-1 text-lg text-gray-700">
          {Deputies.map((deputy, index) => (
            <li key={index}>{deputy}</li>
          ))}
        </ul>

        <hr className="h-1 bg-gray-400 border-none rounded-full" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-gray-50 p-6 rounded-xl shadow w-full"
          >
            <FormField
              control={form.control}
              name="meetingName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter meeting name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Purpose</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter purpose" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Audience</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <label htmlFor="all">Send to All</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="relevant" id="relevant" />
                        <label htmlFor="relevant">Send to Relevant Members</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Head_S
