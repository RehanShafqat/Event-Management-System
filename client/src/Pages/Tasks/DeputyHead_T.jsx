import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

const DeputyHead_T = () => {
  const [tasks, setTasks] = useState(["Task 1", "Task 2", "Task 3","Task 4"])

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(updatedTasks)
  }

  const clearTasks = () => {
    if (tasks.length === 0) {
      alert("✅ Task list is already empty.")
      return
    }
    if (confirm("Are you sure you want to clear all tasks?")) {
      setTasks([])
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-semibold text-center">Your Tasks</h2>

      <ul className="list-disc list-inside space-y-2 text-lg">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{task}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteTask(index)}
              >
                Delete
              </Button>
            </li>
          ))
        ) : (
          <p className="text-gray-500 italic">No tasks available.</p>
        )}
      </ul>

      <div className="flex justify-end">
        <Button variant="outline" onClick={clearTasks}>
          Clear All Tasks
        </Button>
      </div>
    </div>
  )
}

export default DeputyHead_T
