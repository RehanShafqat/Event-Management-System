import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const AVP_A = () => {
  const [heads, setHeads] = useState([
    "Rehan",
    "Ali",
    "Sara",
    "Aisha",
    "Tariq",
    "Fatima",
  ])
  const [task, setTask] = useState("")
  const [name, setName] = useState("")
  const [selectedHead, setSelectedHead] = useState("")
  const taskAssigned = useRef("")

  const handleSubmit = () => {
    if (selectedHead && taskAssigned.current.value) {
      setTask(taskAssigned.current.value)
      setName(selectedHead)
      alert("Task successfully assigned to " + selectedHead)

      setSelectedHead("")
      taskAssigned.current.value = ""
    } else {
      alert("Please fill in all fields.")
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Assign Task to Head
        </h2>

        <div className="space-y-2">
          <label htmlFor="head" className="text-gray-700 font-medium">
            Select Head
          </label>
          <Select value={selectedHead} onValueChange={setSelectedHead}>
            <SelectTrigger className="w-full">
              <span className="text-sm">
                {selectedHead|| "Choose an Head"}
              </span>
            </SelectTrigger>
            <SelectContent>
              {heads.map((head, index) => (
                <SelectItem key={index} value={head}>
                  {head}
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

export default AVP_A
