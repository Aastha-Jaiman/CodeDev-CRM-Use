// import React, { useState, useEffect } from 'react';
// import workReportService from '../../services/workReportService';
// import { getAllUser } from "../../services/userService";

// // Helper functions
// const formatDate = (date) => {
//   const d = new Date(date);
//   const day = d.getDate().toString().padStart(2, '0');
//   const month = (d.getMonth() + 1).toString().padStart(2, '0');
//   const year = d.getFullYear();
//   return `${year}-${month}-${day}`;
// };

// const getMonthData = (month, year) => {
//   const firstDayOfMonth = new Date(year, month, 1);
//   const lastDayOfMonth = new Date(year, month + 1, 0);

//   const daysInMonth = lastDayOfMonth.getDate();
//   const startDay = firstDayOfMonth.getDay();

//   const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//   return { days, startDay };
// };

// const getDayName = (date) => {
//   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   return daysOfWeek[date.getDay()];
// };

// const getMonthName = (monthIndex) => {
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   return months[monthIndex];
// };

// function WorkReport() {
//   const [users, setUsers] = useState([]); // List of users
//   const [selectedUser, setSelectedUser] = useState(null); // Selected user
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [startDateIndex, setStartDateIndex] = useState(0);

//   const today = formatDate(new Date());

//   useEffect(() => {
//     fetchUsers(); // Fetch user list on component mount
//   }, []);

//   useEffect(() => {
//     if (selectedUser) {
//       fetchTasks(selectedUser.id); // Fetch tasks when a user is selected
//     }
//   }, [selectedUser]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await getAllUser(); // API call to fetch users
//       setUsers(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch users. Please try again later.');
//       console.error('Error fetching users:', err);
//     } finally {
//       setLoading(false);
//     }
//     // fetchUsers();
//   };

//   const fetchTasks = async (userId) => {
//     try {
//       setLoading(true);
//       const response = await workReportService.getUserWorkReports(userId); // Fetch tasks for selected user
//       const transformedData = transformTaskData(response.data);
//       setTasks(transformedData);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch tasks. Please try again later.');
//       console.error('Error fetching tasks:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformTaskData = (apiData) => {
//     return apiData.map((task) => ({
//       id: task._id,
//       task: task.title,
//       conclusion: task.description,
//       date: formatDate(new Date(task.scheduledOn)),
//       state: task.status,
//     }));
//   };

//   const handleUserChange = (e) => {
//     const userId = e.target.value;
//     const user = users.find((u) => u.id === userId);
//     setSelectedUser(user);
//   };

//   const handleDateChange = (e) => {
//     const newDate = e.target.value;
//     setSelectedDate(newDate);
//     const dateObj = new Date(newDate);
//     setSelectedMonth(dateObj.getMonth());
//     setSelectedYear(dateObj.getFullYear());
//     setStartDateIndex(calculateVisibleRange(newDate));
//   };

//   const calculateVisibleRange = (date) => {
//     const currentDay = new Date(date).getDate();
//     const group = Math.ceil(currentDay / 10);
//     return (group - 1) * 10;
//   };

//   const { days } = getMonthData(selectedMonth, selectedYear);

//   const currentVisibleDays = days.slice(startDateIndex, startDateIndex + 10);

//   return (
//     <div className="p-6 bg-white">
//       <h1 className="text-3xl font-semibold mb-5">Work Report</h1>

//       {error && (
//         <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
//       )}

//       {/* User Selection */}
//       <div className="mb-4">
//         <label className="block text-lg font-medium text-gray-700 mb-2">Select User:</label>
//         <select
//           value={selectedUser?.id || ''}
//           onChange={handleUserChange}
//           className="w-full border p-2 rounded-lg"
//           disabled={loading}
//         >
//           <option value="" disabled>
//             -- Select a User --
//           </option>
//           {users.map((user) => (
//             <option key={user.id} value={user.id}>
//               {user.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Calendar and Tasks */}
//       <div className="flex justify-between">
//         <div className="text-lg font-semibold pt-2">
//           {`${getMonthName(selectedMonth)} ${selectedYear}`}
//         </div>

//         <div className="mb-4 flex justify-end gap-2 items-center">
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={handleDateChange}
//             className="border p-2 rounded"
//           />
//         </div>
//       </div>

//       <div className="mb-4 max-w-[900px] mx-auto flex justify-center items-center">
//         <div className="flex space-x-2 mb-4 overflow-x-auto">
//           {currentVisibleDays.map((day) => {
//             const dateStr = `${selectedYear}-${(selectedMonth + 1)
//               .toString()
//               .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
//             const dateObj = new Date(dateStr);
//             const dayName = getDayName(dateObj);

//             return (
//               <div
//                 key={day}
//                 className={`relative text-center border p-2 cursor-pointer hover:bg-blue-100 w-16`}
//               >
//                 <div className="text-sm">{getMonthName(selectedMonth)} {day}</div>
//                 <div className="text-xs text-gray-500">{dayName}</div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <table className="min-w-full w-full overflow-hidden table-auto border-collapse border border-gray-300 mb-6">
//         <thead>
//           <tr>
//             <th className="px-4 py-2 border border-gray-300 w-20">Sr No.</th>
//             <th className="px-4 py-2 border border-gray-300 w-52">Task</th>
//             <th className="px-4 py-2 border border-gray-300 w-52">Conclusion</th>
//             <th className="px-4 py-2 border border-gray-300 w-40">Date</th>
//             <th className="px-4 py-2 border border-gray-300 w-40">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.map((task, index) => (
//             <tr key={task.id || index}>
//               <td className="px-4 py-2 border border-gray-300 text-center w-20">
//                 {index + 1}
//               </td>
//               <td className="px-4 py-2 border border-gray-300 text-center w-48 break-words">
//                 {task.task}
//               </td>
//               <td className="px-4 py-2 border border-gray-300 text-center w-48 break-words">
//                 {task.conclusion}
//               </td>
//               <td className="px-4 py-2 border border-gray-300 text-center w-40">
//                 {task.date}
//               </td>
//               <td className="px-4 py-2 border border-gray-300 text-center w-40">
//                 {task.state}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {loading && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg">
//             <p className="text-lg font-semibold">Loading...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default WorkReport;
import React from 'react'

const ShowWorkReports = () => {
  return (
    <div>
      ShowWorkReports
    </div>
  )
}

export default ShowWorkReports

