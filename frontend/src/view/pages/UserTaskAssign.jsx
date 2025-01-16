import React, { useState, useEffect } from "react";
import TaskService from "../../services/adminTaskServices"; // Import TaskService

const UserTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading message

  const fetchalltask = async () => {
    try {
      const response = await TaskService.getAllTasks();
      console.log("Fetched tasks", response);

      setTasks(response.data || response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchalltask();
  }, []);

  console.log("tasks", tasks);

  return (
    <div className="w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-4xl font-medium text-center mb-10">Assigned Tasks</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            className="mb-6 p-4 border border-gray-300 rounded-md shadow-sm"
          >
            <h3 className="text-xl font-semibold text-gray-700">Title : {task.title}</h3>
            <p className="mt-2 text-gray-600">
              Assigned By:
              {/* Check if createdBy is an object and render a specific field */}
              <span className="font-medium">
                {task.createdBy && task.createdBy.name ? task.createdBy.name : 'Unknown'}
              </span>
            </p>

            <p className="mt-2 text-gray-700">Description : {task.description}</p>
            <p className="mt-2 text-gray-700">Date : {task.date}</p>
            <div className="mt-4">
              <span
                className={`px-3 py-1 text-sm rounded-full ${task.status === "active"
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-white"
                  }`}
              >
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p>No tasks assigned yet.</p>
      )}
    </div>
  );
};

export default UserTaskList;
