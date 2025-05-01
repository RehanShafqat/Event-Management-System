import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const DeputyHead_A = () => {
  const [officers, setOfficers] = useState([
    "Rehan",
    "Ali",
    "Sara",
    "Aisha",
    "Tariq",
    "Fatima",
  ])
  const [task, setTask] = useState("")
  const [name, setName] = useState("")
  const [selectedOfficer, setSelectedOfficer] = useState("")
  const taskAssigned = useRef("")

  const handleSubmit = () => {
    if (selectedOfficer && taskAssigned.current.value) {
      setTask(taskAssigned.current.value)
      setName(selectedOfficer)
      alert("Task successfully assigned to " + selectedOfficer)

      // Reset fields after submission
      setSelectedOfficer("")
      taskAssigned.current.value = ""
    } else {
      alert("Please fill in all fields.")
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Assign Task to Officer
        </h2>

        <div className="space-y-2">
          <label htmlFor="officer" className="text-gray-700 font-medium">
            Select Officer
          </label>
          <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
            <SelectTrigger className="w-full">
              <span className="text-sm">
                {selectedOfficer || "Choose an officer"}
              </span>
            </SelectTrigger>
            <SelectContent>
              {officers.map((officer, index) => (
                <SelectItem key={index} value={officer}>
                  {officer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="task" className="text-gray-700 font-medium">
            Task Description
          </label>
          <Input
            ref={taskAssigned}
            placeholder="Enter the Task"
            className="w-full"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default DeputyHead_A
