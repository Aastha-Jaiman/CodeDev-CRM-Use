import React, { useState, useEffect } from 'react';
import workReportService from '../../services/workReportService';
import { getAllUser } from "../../services/userService";

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

const getMonthData = (month, year) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = firstDayOfMonth.getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  return { days, startDay };
};

const getDayName = (date) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return daysOfWeek[date.getDay()];
};

const getMonthName = (monthIndex) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthIndex];
};


function WorkReport() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDateIndex, setStartDateIndex] = useState(0);

  const today = formatDate(new Date());


  const calculateVisibleRange = (date) => {
    const currentDay = new Date(date).getDate();
    const group = Math.ceil(currentDay / 10);
    return (group - 1) * 10;
  };

  const transformTaskData = (apiData) => {
    if (!apiData) return [];

    return apiData.map(task => ({
      id: task._id,
      task: task.title || task.task,
      conclusion: task.description || task.conclusion,
      date: formatDate(new Date(task.scheduledOn || task.date)),
      state: task.status || task.state,
      userId: task.user._id
    }));
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUser();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users: ", error);
      setError('Failed to fetch users. Please try again later.');
    }
  };

  // const fetchTasks = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await workReportService.getAllWorkReports();
  //     const transformedData = transformTaskData(response.data);
  //     console.log("All task" , transformedData)
  //     setTasks(transformedData);
  //     setError(null);
  //   } catch (err) {
  //     setError('Failed to fetch tasks. Please try again later.');
  //     console.error('Error fetching tasks:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUserSpecificTasks = async (userId) => {
    try {
      setLoading(true);
      const response = await workReportService.getAllWorkReports();
      const transformedData = transformTaskData(response.data);

      console.log('All Tasks:', transformedData);
      console.log('Selected User ID:', userId);

      const userTasks = transformedData.filter(task => {
        return task.userId === userId;
      });

      console.log('Filtered User Tasks:', userTasks);

      setTasks(userTasks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch user-specific tasks. Please try again later.');
      console.error('Error fetching user tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };


  const handleUserChange = (e) => {
    const userId = e.target.value;
    const user = users.find((u) => u._id === userId);

    setSelectedUser(user);

    if (userId) {
      fetchUserSpecificTasks(userId);
    } else {
      // fetchTasks(); 
    }
  };

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  useEffect(() => {
    const savedDate = localStorage.getItem('selectedDate') || formatDate(new Date());
    setSelectedDate(savedDate);
    const newDate = new Date(savedDate);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
    setStartDateIndex(calculateVisibleRange(savedDate));
    // fetchTasks();
  }, []);


  useEffect(() => {
    const newStartIndex = calculateVisibleRange(selectedDate);
    setStartDateIndex(newStartIndex);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const savedDate = localStorage.getItem('selectedDate');

    if (!savedDate) {
      setSelectedDate(today);
      localStorage.setItem('selectedDate', today);
    } else {
      setSelectedDate(savedDate);
    }

    const currentDate = new Date(savedDate || today);
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());

    setStartDateIndex(calculateVisibleRange(savedDate || today));

    // fetchTasks();
  }, []);


  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    const dateObj = new Date(newDate);
    setSelectedMonth(dateObj.getMonth());
    setSelectedYear(dateObj.getFullYear());
    setStartDateIndex(calculateVisibleRange(newDate));
  };



  const handleNext = () => {
    const { days } = getMonthData(selectedMonth, selectedYear);
    const nextStartIndex = startDateIndex + 10;
    if (nextStartIndex < days.length) {
      setStartDateIndex(nextStartIndex);
    }
  };

  const handlePrevious = () => {
    const prevStartIndex = startDateIndex - 10;
    if (prevStartIndex >= 0) {
      setStartDateIndex(prevStartIndex);
    }
  };

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setStartDateIndex(calculateVisibleRange(dateStr));
  };


  const { days } = getMonthData(selectedMonth, selectedYear);


  const taskCountForDay = (day) => {
    const dateStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return tasks.filter((task) => task.date === dateStr).length;
  };

  const currentVisibleDays = days.slice(startDateIndex, startDateIndex + 10);


  // Filter tasks for the selected date
  const filteredTasksForDate = tasks.filter((task) => task.date === selectedDate);


  return (
    <div className="p-6 bg-white">

      <h1 className="text-3xl font-semibold mb-5">Work Report</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className='flex w-full justify-between gap-10'>
        <div className="mb-4 w-full">
          <label className="block text-lg font-medium text-gray-700 mb-2">Select User:</label>
          <select
            value={selectedUser?._id}
            onChange={handleUserChange}
            className="w-full border p-2 rounded-lg"
            disabled={loading}
          >
            <option value="" >
              -- Select a User --
            </option>
            {Array.isArray(users) && users.length > 0 ? (
              users
                .filter((user) => user.role !== "admin" && user.role !== "subAdmin")
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))
            ) : (
              <option value="" disabled>No users available</option>
            )}
          </select>



        </div>


        <div className="mb-4">
          <div className="text-lg font-semibold pb-2">{`${getMonthName(selectedMonth)} ${selectedYear}`}</div>

          <div className="mb-4 flex justify-end gap-2 items-center w-48">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border p-2 rounded w-56"
            />
          </div>
        </div>
      </div>


      {/* Calendar Navigation */}
      <div className="mb-4 max-w-[900px] mx-10 flex justify-center  items-center">
        <button
          onClick={handlePrevious}
          className="text-xl font-semibold bg-gray-300 mb-3 mx-3 rounded-full p-2 hover:bg-gray-400"
          disabled={loading || startDateIndex === 0}
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
                className={`relative text-center border p-2 cursor-pointer hover:bg-blue-100 w-16 ${isSelected ? 'bg-blue-500 text-white' : ''
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
          className="text-xl font-semibold bg-gray-300 mb-3 mx-3 rounded-full p-2 hover:bg-gray-400"
          disabled={loading || startDateIndex + 10 >= days.length}
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
            <th className="px-4 py-2 border border-gray-300 w-52">Conclusion</th>
            <th className="px-4 py-2 border border-gray-300 w-40">Date</th>
            <th className="px-4 py-2 border border-gray-300 w-40">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasksForDate.length > 0 ? (
            filteredTasksForDate.map((task, index) => (
              <tr key={task.id || index}>
                <td className="px-4 py-2 border border-gray-300 text-center w-20">{index + 1}</td>
                <td className="px-4 py-2 border border-gray-300 text-center w-48 break-words">{task.task}</td>
                <td className="px-4 py-2 border border-gray-300 text-center w-48 break-words">{task.conclusion}</td>
                <td className="px-4 py-2 border border-gray-300 text-center w-40">{task.date}</td>
                <td className="px-4 py-2 border border-gray-300 text-center w-40">{task.state}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                {selectedUser
                  ? "No tasks found for the selected date"
                  : "Please select a user to view tasks"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkReport;