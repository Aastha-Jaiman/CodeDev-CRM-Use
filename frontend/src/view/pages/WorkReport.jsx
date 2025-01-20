import React, { useState, useEffect } from 'react';
import workReportService from '../../services/workReportService';

// Helper function to format the date (YYYY-MM-DD format)
const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

// Helper function to get the current month and the first day of the month
const getMonthData = (month, year) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = firstDayOfMonth.getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return { days, startDay };
};

// Helper function to get the weekday name for a given date
const getDayName = (date) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return daysOfWeek[date.getDay()];
};

// Helper function to get the month name
const getMonthName = (monthIndex) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthIndex];
};

function WorkReport() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    description: '',
    status: 'pending',
    scheduledOn: formatDate(new Date())
  });
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDateIndex, setStartDateIndex] = useState(0);
  const [searchDate, setSearchDate] = useState('');

  // Transform the API response to match the component's expected format
  const transformTaskData = (apiData) => {
    return apiData.map(task => ({
      id: task._id,
      task: task.title,
      conclusion: task.description,
      date: formatDate(new Date(task.scheduledOn)),
      state: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));
  };

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      scheduledOn: selectedDate,
    }));
  }, [selectedDate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await workReportService.getUserWorkReports();
      const transformedData = transformTaskData(response.data);
      setTasks(transformedData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newTask = {
        title: taskDetails.title,
        description: taskDetails.description,
        status: taskDetails.status,
        scheduledOn: new Date(taskDetails.scheduledOn).toISOString()
      };
      const response = await workReportService.createWorkReport(newTask);
      const transformedTask = transformTaskData([response])[0];
      setTasks((prevTasks) => [...prevTasks, transformedTask]);
      setIsModalOpen(false);
      setTaskDetails({
        title: '',
        description: '',
        status: 'pending',
        scheduledOn: selectedDate
      });
      setError(null);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setTaskToUpdate(task);
    setTaskDetails({
      title: task.task,
      description: task.conclusion,
      status: task.state,
      scheduledOn: task.date
    });
    setIsModalOpen(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updateData = {
        description: taskDetails.description,
        status: taskDetails.status
      };
      const response = await workReportService.updateWorkReport(taskToUpdate.id, updateData);
      const transformedTask = transformTaskData([response])[0];
      
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskToUpdate.id ? transformedTask : task
        )
      );

      setIsModalOpen(false);

      setTaskToUpdate(null);
      setError(null);
      fetchTasks()
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks by the selected date
  const filteredTasks = tasks.filter((task) => task.date === selectedDate);

  // Get the month data (days in the month, starting day, etc.)
  const { days } = getMonthData(selectedMonth, selectedYear);

  // Get task count for each date
  const taskCountForDay = (day) => {
    const dateStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return tasks.filter((task) => task.date === dateStr).length;
  };

  // Handle date navigation
  const handleNext = () => {
    if (startDateIndex + 10 < days.length) {
      setStartDateIndex(startDateIndex + 10);
    }
  };

  const handlePrevious = () => {
    if (startDateIndex - 10 >= 0) {
      setStartDateIndex(startDateIndex - 10);
    }
  };

  // Slice the days to show only 10 at a time
  const currentVisibleDays = days.slice(startDateIndex, startDateIndex + 10);

  // Handle manual date search
  const handleSearchDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  const handleSearchDateSubmit = (e) => {
    e.preventDefault();
    if (searchDate) {
      setSelectedDate(searchDate);
      setSelectedMonth(new Date(searchDate).getMonth());
      setSelectedYear(new Date(searchDate).getFullYear());
    }
  };

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setSearchDate('');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-5">Work Report</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <div className="text-lg font-semibold pt-2">{`${getMonthName(selectedMonth)} ${selectedYear}`}</div>

        <div className="mb-4 flex justify-end gap-2 items-center">
          <input
            type="date"
            value={searchDate}
            onChange={handleSearchDateChange}
            className="border p-2 rounded"
          />
          <button
            onClick={handleSearchDateSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            Search Date
          </button>
                {/* Add Task Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        disabled={loading}
      >
        Add Task
      </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={handlePrevious}
          className="text-xl font-semibold bg-gray-300 rounded-full p-2 hover:bg-gray-400"
          disabled={loading}
        >
          &#8249;
        </button>
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {currentVisibleDays.map((day) => {
            const dateStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dateObj = new Date(dateStr);
            const dayName = getDayName(dateObj);
            const taskCount = taskCountForDay(day);
            const isSelected = dateStr === selectedDate;

            return (
              <div
                key={day}
                className={`relative text-center border p-2 cursor-pointer hover:bg-blue-100 w-16 ${
                  isSelected ? 'bg-blue-500 text-white' : ''
                }`}
                onClick={() => handleDateClick(dateStr)}
              >
                {taskCount > 0 && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {taskCount}
                  </div>
                )}
                <div className="text-sm">{getMonthName(selectedMonth)} {day}</div>
                <div className="text-xs text-gray-500">{dayName}</div>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleNext}
          className="text-xl font-semibold bg-gray-300 rounded-full p-2 hover:bg-gray-400"
          disabled={loading}
        >
          &#8250;
        </button>
      </div>

      {/* Task Table */}
      <table className="min-w-full w-full overflow-hidden table-auto border-collapse border border-gray-300 mb-6">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300 w-20">Sr No.</th>
            <th className="px-4 py-2 border border-gray-300 w-52">Task</th>
            <th className="px-4 py-2 border border-gray-300 w-52">Description</th>
            <th className="px-4 py-2 border border-gray-300 w-40">Scheduled Date</th>
            <th className="px-4 py-2 border border-gray-300 w-40">Status</th>
            <th className="px-4 py-2 border border-gray-300 w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={task.id || index}>
              <td className="px-4 py-2 border border-gray-300 text-center w-20">{index + 1}</td>
              <td className="px-4 py-2 border border-gray-300 text-center w-48 break-words">{task.task}</td>
              <td className="px-4 py-2 border border-gray-300 text-center w-48 break-words">{task.conclusion}</td>
              <td className="px-4 py-2 border border-gray-300 text-center w-40">{task.date}</td>
              <td className="px-4 py-2 border border-gray-300 text-center w-40">{task.state}</td>
              <td className="px-4 py-2 border border-gray-300 text-center w-40">
                <button
                  onClick={() => handleEditTask(task)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                  disabled={loading}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



      {/* Modal for Adding or Updating Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">{taskToUpdate ? 'Update Task' : 'Add Task'}</h3>
            <form onSubmit={taskToUpdate ? handleUpdateTask : handleAddTask}>
              {!taskToUpdate && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="title">
                    Task Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={taskDetails.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    disabled={loading}
                  />
                </div>
              )}

              {taskToUpdate && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={taskDetails.description}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={taskDetails.status}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                      disabled={loading}
                    ><option value="complete">Complete</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </>
            )}

            {!taskToUpdate && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={taskDetails.description}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  disabled={loading}
                  rows="3"
                />
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setTaskToUpdate(null);
                  setTaskDetails({
                    title: '',
                    description: '',
                    status: 'pending',
                    scheduledOn: selectedDate
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={loading}
              >
                {taskToUpdate ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}

export default WorkReport;