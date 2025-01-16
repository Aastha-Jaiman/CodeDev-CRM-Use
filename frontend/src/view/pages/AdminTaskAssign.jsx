import React, { useEffect, useState } from "react";
import TaskService from "../../services/adminTaskServices";
import { getAllUser } from "../../services/userService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles

const AdminTaskAssignmentForm = () => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    user: "",
    createdBy: "", // Add createdBy field
    status: "pending",
    date: "",
    dueDate: "", // Add due date for filtering purposes
  });

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("today"); // Default filter is 'today'
  const [selectedDate, setSelectedDate] = useState(new Date()); // For Calendar Date Picker

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await TaskService.getAllTasks();
      setTasks(response.data); // Ensure createdBy is included in the response
    } catch (error) {
      console.log("Error fetching tasks: ", error);
      setTasks([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUser();
      setUsers(response);
    } catch (error) {
      console.log("Error fetching users: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTaskData = {
        ...taskData,
        date: taskData.dueDate, // Ensure that date is assigned correctly
      };

      if (taskData._id) {
        await TaskService.updateTask(taskData._id, updatedTaskData);
        alert("Task updated successfully");
      } else {
        await TaskService.createTask(updatedTaskData);
        alert("Task created successfully");
      }

      setTaskData({
        title: "",
        description: "",
        user: "",
        createdBy: "", // Reset createdBy
        status: "pending",
        date: "", // Reset date
        dueDate: "", // Reset due date
      });
      fetchTasks();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await TaskService.deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      alert("Task deleted successfully");
    } catch (error) {
      console.log("Error: ", error);
      alert("Failed to delete task.");
    }
  };

  const handleEdit = (task) => {
    setTaskData(task);
  };

  // Function to filter tasks based on the selected filter (Today, tomorrow, or Calendar date)
  const getFilteredTasks = () => {
    const now = new Date();
    let filteredTasks = tasks;

    if (filter === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      filteredTasks = tasks.filter((task) => isSameDay(new Date(task.date), yesterday));
    }
    else if (filter === "today") {
      filteredTasks = tasks.filter((task) => isSameDay(new Date(task.date), now));
    }
    else if (filter === "tomorrow") {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      filteredTasks = tasks.filter((task) => isSameDay(new Date(task.date), tomorrow));
    }
    else if (filter === "calendar") {
      filteredTasks = tasks.filter((task) => isSameDay(new Date(task.date), selectedDate));
    }

    return filteredTasks;
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <div>
      {/* Task Assignment Form */}
      <div className="w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-4xl font-medium text-center mb-10">Assign Task</h2>
        <form onSubmit={handleSubmit}>
          {/* Task Title and User Selection */}
          <div className="w-full gap-10 flex">
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-700">Task Title</label>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-700">Assign User</label>
              <select
                name="user"
                value={taskData.user}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select User</option>
                {Array.isArray(users) &&
                  users
                    .filter((user) => user.role !== "admin" && user.role !== "subAdmin")
                    .map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          {/* Task Description and Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Task Description</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex w-full justify-evenly gap-10">
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-700">Task Status</label>
              <select
                name="status"
                value={taskData.status}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            {taskData._id ? "Update Task" : "Assign Task"}
          </button>
        </form>
      </div>

      {/* Task Table */}
      <div className="w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <div className="w-full flex justify-between items-center">
          <h3 className="text-3xl font-medium mb-6">Task List</h3>

          <div className="">
            {/* Filter buttons */}
            <button
              onClick={() => setFilter("yesterday")}
              className={`mx-2 mb-6 p-2 rounded-md ${filter === "yesterday" ? 'bg-[#002E6E]' : 'bg-blue-500'} text-white`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setFilter("today")}
              className={`mx-2 mb-6 p-2 rounded-md ${filter === "today" ? 'bg-[#002E6E]' : 'bg-blue-500'} text-white`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter("tomorrow")}
              className={`mx-2 mb-6 p-2 rounded-md ${filter === "tomorrow" ? 'bg-[#002E6E]' : 'bg-blue-500'} text-white`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setFilter("calendar")}
              className={`mx-2 mb-6 p-2 rounded-md ${filter === "calendar" ? 'bg-[#002E6E]' : 'bg-blue-500'} text-white`}
            >
              Calendar
            </button>
            {filter === "calendar" && (
              <div className="text-center">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="yyyy/MM/dd"
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>

        </div>

        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Task Title</th>
              <th className="px-4 py-2 border">Assigned User</th>
              <th className="px-4 py-2 border">Assigned By</th> {/* New column for CreatedBy */}
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredTasks().length > 0 ? (
              getFilteredTasks().map((task) => (
                <tr key={task._id}>
                  <td className="px-4 py-2 border text-center">{task.title}</td>
                  <td className="px-4 py-2 border text-center">{task.user ? task.user.name : "Unknown User"}</td>
                  <td className="px-4 py-2 border text-center">{task.createdBy ? task.createdBy.name : "Unknown Admin"}</td> {/* Display Admin name */}
                  <td className="px-4 py-2 border text-center">{task.status}</td>
                  <td className="px-4 py-2 border text-center">{new Date(task.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleEdit(task)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 border text-center">No tasks available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTaskAssignmentForm;
