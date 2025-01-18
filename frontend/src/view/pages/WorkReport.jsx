// import React, { useState } from "react";

// function DailyTaskReport() {
//   const [plannedTasks, setPlannedTasks] = useState([""]);
//   const [taskUpdates, setTaskUpdates] = useState([]);
//   const [taskRecords, setTaskRecords] = useState({});
//   const [submittedBy, setSubmittedBy] = useState("");
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().slice(0, 10)
//   );
//   const [submissionDate, setSubmissionDate] = useState(
//     new Date().toISOString().slice(0, 10)
//   );
//   const [editingIndex, setEditingIndex] = useState(null);

//   // Handle changes for planned tasks
//   const handleTaskChange = (index, value) => {
//     const tasks = [...plannedTasks];
//     tasks[index] = value;
//     setPlannedTasks(tasks);
//   };

//   const addPlannedTask = () => {
//     setPlannedTasks([...plannedTasks, ""]);
//   };

//   // Initialize task updates for a date
//   const initializeTaskUpdates = (date) => {
//     const updates = plannedTasks.map((task) => ({
//       task,
//       feedback: "",
//       isCompleted: false,
//       completionDate: null,
//     }));
//     setTaskUpdates(updates);
//     setTaskRecords((prev) => ({
//       ...prev,
//       [date]: updates,
//     }));
//   };

//   const handleSubmitMorning = (e) => {
//     e.preventDefault();
//     initializeTaskUpdates(selectedDate);
//     alert("Morning tasks planned successfully!");
//   };

//   const handleSubmitEvening = (e) => {
//     e.preventDefault();
//     setTaskRecords((prev) => ({
//       ...prev,
//       [submissionDate]: taskUpdates,
//     }));
//     alert("Evening updates submitted! Check the console for details.");
//   };

//   const handleUpdateChange = (index, field, value) => {
//     const updates = [...taskUpdates];
//     updates[index][field] = value;

//     // Set the completion date if marked as completed
//     if (field === "isCompleted" && value) {
//       updates[index].completionDate = new Date().toISOString().slice(0, 10);
//     }
//     setTaskUpdates(updates);
//   };

//   // Select tasks for the chosen date
//   const loadTasksForDate = (date) => {
//     setSelectedDate(date);
//     setTaskUpdates(taskRecords[date] || []);
//   };

//   const handleEditTask = (index) => {
//     setEditingIndex(index);
//   };

//   const handleSaveTask = () => {
//     const updatedRecords = { ...taskRecords };
//     updatedRecords[selectedDate] = taskUpdates;
//     setTaskRecords(updatedRecords);
//     setEditingIndex(null);
//     alert("Task updated successfully!");
//   };

//   const handleDeleteTask = (index) => {
//     const updates = [...taskUpdates];
//     updates.splice(index, 1);
//     setTaskUpdates(updates);

//     const updatedRecords = { ...taskRecords };
//     updatedRecords[selectedDate] = updates;
//     setTaskRecords(updatedRecords);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6">Daily Task Report</h1>

//       {/* Top Calendar */}
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold mb-2">Select Date</h2>
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => loadTasksForDate(e.target.value)}
//           className="border rounded-md p-2 w-full"
//         />
//       </div>

//       {/* Morning Task Planning */}
//       <div className="mb-10">
//         <h2 className="text-xl font-semibold mb-4">Morning Task Planning</h2>
//         <form onSubmit={handleSubmitMorning} className="space-y-4">
//           {plannedTasks.map((task, index) => (
//             <div key={index} className="flex items-center gap-2">
//               <input
//                 type="text"
//                 value={task}
//                 onChange={(e) => handleTaskChange(index, e.target.value)}
//                 className="border rounded-md p-2 w-full"
//                 placeholder={`Planned Task ${index + 1}`}
//                 required
//               />
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addPlannedTask}
//             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             Add Task
//           </button>
//           <button
//             type="submit"
//             className="w-full mt-4 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
//           >
//             Save Planned Tasks
//           </button>
//         </form>
//       </div>

//       {/* Evening Task Update */}
//       {taskUpdates.length > 0 && (
//         <div className="mb-10">
//           <h2 className="text-xl font-semibold mb-4">Evening Task Updates</h2>
//           <form onSubmit={handleSubmitEvening} className="space-y-6">
//             <div>
//               <label className="block text-lg font-semibold mb-2">
//                 Submitted By
//               </label>
//               <input
//                 type="text"
//                 value={submittedBy}
//                 onChange={(e) => setSubmittedBy(e.target.value)}
//                 className="border rounded-md p-2 w-full"
//                 placeholder="Enter User ID"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-lg font-semibold mb-2">
//                 Submission Date
//               </label>
//               <input
//                 type="date"
//                 value={submissionDate}
//                 onChange={(e) => setSubmissionDate(e.target.value)}
//                 className="border rounded-md p-2 w-full"
//                 required
//               />
//             </div>

//             {taskUpdates.map((update, index) => (
//               <div key={index} className="space-y-2 mb-4">
//                 <h3 className="text-md font-semibold">
//                   Task {index + 1}: {update.task}
//                 </h3>
//                 <textarea
//                   value={update.feedback}
//                   onChange={(e) =>
//                     handleUpdateChange(index, "feedback", e.target.value)
//                   }
//                   className="border rounded-md p-2 w-full"
//                   placeholder="Enter feedback"
//                   rows="3"
//                   required
//                 />
//                 <label className="block mt-2">
//                   <input
//                     type="checkbox"
//                     checked={update.isCompleted}
//                     onChange={(e) =>
//                       handleUpdateChange(
//                         index,
//                         "isCompleted",
//                         e.target.checked
//                       )
//                     }
//                     className="mr-2"
//                   />
//                   Mark as completed
//                 </label>
//               </div>
//             ))}

//             <button
//               type="submit"
//               className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
//             >
//               Submit Evening Updates
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Task Table */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Tasks for {selectedDate}</h2>
//         <table className="min-w-full border-collapse border border-gray-300">
//           <thead>
//             <tr>
//               <th className="border border-gray-300 p-2">Task</th>
//               <th className="border border-gray-300 p-2">Feedback</th>
//               <th className="border border-gray-300 p-2">Status</th>
//               <th className="border border-gray-300 p-2">Completion Date</th>
//               <th className="border border-gray-300 p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {(taskRecords[selectedDate] || []).map((task, index) => (
//               <tr key={index}>
//                 <td className="border border-gray-300 p-2">
//                   {editingIndex === index ? (
//                     <input
//                       type="text"
//                       value={taskUpdates[index]?.task || ""}
//                       onChange={(e) =>
//                         handleUpdateChange(index, "task", e.target.value)
//                       }
//                       className="border rounded-md p-2 w-full"
//                     />
//                   ) : (
//                     task.task
//                   )}
//                 </td>
//                 <td className="border border-gray-300 p-2">
//                   {task.feedback}
//                 </td>
//                 <td className="border border-gray-300 p-2">
//                   {task.isCompleted ? "Completed" : "Pending"}
//                 </td>
//                 <td className="border border-gray-300 p-2">
//                   {task.completionDate || "N/A"}
//                 </td>
//                 <td className="border border-gray-300 p-2 text-center">
//                   {editingIndex === index ? (
//                     <button
//                       onClick={handleSaveTask}
//                       className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleEditTask(index)}
//                       className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                     >
//                       Update
//                     </button>
//                   )}
//                   <button
//                     onClick={() => handleDeleteTask(index)}
//                     className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default DailyTaskReport;

import React, { useState } from "react";

function DailyTaskReport() {
  const [plannedTask, setPlannedTask] = useState("");
  const [taskUpdates, setTaskUpdates] = useState([]);
  const [taskRecords, setTaskRecords] = useState({});
  const [submittedBy, setSubmittedBy] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [searchDate, setSearchDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [editingTask, setEditingTask] = useState(null);
  const [showEveningForm, setShowEveningForm] = useState(false);

  // Reset form fields
  const resetForm = () => {
    setPlannedTask("");
    setSubmittedBy("");
    setEditingTask(null);
    setShowEveningForm(false);
  };

  const handleSubmitMorning = (e) => {
    e.preventDefault();
    const newTask = {
      task: plannedTask,
      feedback: "",
      isCompleted: false,
      completionDate: null,
      submittedBy: "",
      date: selectedDate
    };

    const existingTasks = taskRecords[selectedDate] || [];
    const updatedTasks = [...existingTasks, newTask];

    setTaskRecords(prev => ({
      ...prev,
      [selectedDate]: updatedTasks
    }));

    resetForm();
    setTaskUpdates(updatedTasks);
  };

  const handleSubmitEvening = (e) => {
    e.preventDefault();
    const updatedTasks = [...(taskRecords[selectedDate] || [])];
    
    if (editingTask !== null) {
      updatedTasks[editingTask] = {
        ...updatedTasks[editingTask],
        feedback: taskUpdates[editingTask].feedback,
        isCompleted: taskUpdates[editingTask].isCompleted,
        completionDate: taskUpdates[editingTask].isCompleted ? 
          new Date().toISOString().slice(0, 10) : null,
        submittedBy
      };
    }

    setTaskRecords(prev => ({
      ...prev,
      [selectedDate]: updatedTasks
    }));

    resetForm();
    setTaskUpdates(updatedTasks);
    alert("Evening updates submitted successfully!");
  };

  const handleUpdateChange = (index, field, value) => {
    const updates = [...taskUpdates];
    updates[index] = {
      ...updates[index],
      [field]: value
    };
    setTaskUpdates(updates);
  };

  const handleEditTask = (index) => {
    const taskToEdit = taskRecords[selectedDate][index];
    setEditingTask(index);
    setPlannedTask(taskToEdit.task);
    setSubmittedBy(taskToEdit.submittedBy || "");
    setShowEveningForm(true);
    setTaskUpdates(taskRecords[selectedDate] || []);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSearchDate(date);
    const tasksForDate = taskRecords[date] || [];
    setTaskUpdates(tasksForDate);
    resetForm();
  };

  const handleSearchDate = (date) => {
    setSearchDate(date);
    const tasksForDate = taskRecords[date] || [];
    setTaskUpdates(tasksForDate);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Daily Task Report</h1>

      {/* Search Calendar */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Search Tasks by Date</h2>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => handleSearchDate(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
      </div>

      {/* Task Entry Calendar */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Select Task Date</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
      </div>

      {/* Morning Task Form */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Morning Task Planning</h2>
        <form onSubmit={handleSubmitMorning} className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={plannedTask}
              onChange={(e) => setPlannedTask(e.target.value)}
              className="border rounded-md p-2 w-full"
              placeholder="Enter task description"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Save Task
          </button>
        </form>
      </div>

      {/* Evening Update Form */}
      {showEveningForm && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Evening Task Update</h2>
          <form onSubmit={handleSubmitEvening} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2">
                Submitted By
              </label>
              <input
                type="text"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                className="border rounded-md p-2 w-full"
                placeholder="Enter User ID"
                required
              />
            </div>

            {editingTask !== null && (
              <div className="space-y-2 mb-4">
                <h3 className="text-md font-semibold">
                  Task: {taskUpdates[editingTask]?.task}
                </h3>
                <textarea
                  value={taskUpdates[editingTask]?.feedback || ""}
                  onChange={(e) =>
                    handleUpdateChange(editingTask, "feedback", e.target.value)
                  }
                  className="border rounded-md p-2 w-full"
                  placeholder="Enter feedback"
                  rows="3"
                  required
                />
                <label className="block mt-2">
                  <input
                    type="checkbox"
                    checked={taskUpdates[editingTask]?.isCompleted || false}
                    onChange={(e) =>
                      handleUpdateChange(
                        editingTask,
                        "isCompleted",
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                  Mark as completed
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Submit Update
            </button>
          </form>
        </div>
      )}

      {/* Tasks Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tasks for {searchDate}</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Task</th>
              <th className="border border-gray-300 p-2">Feedback</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Submitted By</th>
              <th className="border border-gray-300 p-2">Completion Date</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(taskRecords[searchDate] || []).map((task, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{task.task}</td>
                <td className="border border-gray-300 p-2">{task.feedback}</td>
                <td className="border border-gray-300 p-2">
                  {task.isCompleted ? "Completed" : "Pending"}
                </td>
                <td className="border border-gray-300 p-2">
                  {task.submittedBy || "Not submitted"}
                </td>
                <td className="border border-gray-300 p-2">
                  {task.completionDate || "N/A"}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleEditTask(index)}
                    className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DailyTaskReport;