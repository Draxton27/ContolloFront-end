import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Tasks = () => {
  // State hooks for managing tasks, task title, description, and edit mode
  const [tasks, setTasks] = useState([]);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();

  // Function to display toast notifications
  const notify = (message) => { 
    toast(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    const jwt = Cookies.get('jwt');
    try {
      const response = await fetch('http://localhost:26417/api/tasks', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data); // Set the tasks state with the fetched data
      } else {
        const errorData = await response.json();
        notify(`Error: ${errorData.message}`); // Notify the user of any errors
      }
    } catch (error) {
      notify("Failed to fetch tasks."); // Notify the user if fetching tasks fails
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to handle adding a new task
  const handleAddTask = async () => {
    const newTask = {
      id: "",
      title: taskTitle,
      body: taskDescription,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:26417/api/tasks', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        notify('Task added successfully'); // Notify the user of successful task addition
        const createdTask = await response.json();
        setTasks([...tasks, createdTask]); // Add the new task to the list of tasks
      } else {
        const errorData = await response.json();
        notify(`Error: ${errorData.message}`); // Notify the user of any errors
      }
    } catch (error) {
      notify("Failed to add task."); // Notify the user if adding the task fails
    } finally {
      // Reset the input fields and edit mode
      setTaskDescription('');
      setTaskTitle('');
      setEditIndex(null);
    }
  };

  // Function to handle editing a task
  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setTaskDescription(taskToEdit.body); // Set the description field with the task's body
    setTaskTitle(taskToEdit.title); // Set the title field with the task's title
    setEditIndex(index); // Set the index of the task being edited
  };

  // Function to handle updating a task
  const handleUpdateTask = async () => {
    const taskToUpdate = tasks[editIndex];
    const updatedTask = {
      ...taskToUpdate,
      title: taskTitle,
      body: taskDescription,
    };

    try {
      const response = await fetch(`http://localhost:26417/api/tasks/${taskToUpdate.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        notify('Task updated successfully'); // Notify the user of successful task update
        const updatedTasks = tasks.map((task, index) =>
          index === editIndex ? updatedTask : task
        );
        setTasks(updatedTasks); // Update the task in the list of tasks
        // Reset the input fields and edit mode
        setEditIndex(null);
        setTaskDescription('');
        setTaskTitle('');
      } else {
        const errorData = await response.json();
        notify(`Error: ${errorData.message}`); // Notify the user of any errors
      }
    } catch (error) {
      notify("Failed to update task."); // Notify the user if updating the task fails
    }
  };

  // Function to handle deleting a task
  const handleDeleteTask = async (index) => {
    const taskToDelete = tasks[index];
    try {
      const response = await fetch(`http://localhost:26417/api/tasks/${taskToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        notify('Task deleted successfully'); // Notify the user of successful task deletion
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks); // Remove the deleted task from the list of tasks
      } else {
        const errorData = await response.json();
        notify(`Error: ${errorData.message}`); // Notify the user of any errors
      }
    } catch (error) {
      notify("Failed to delete task."); // Notify the user if deleting the task fails
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    Cookies.remove('jwt'); // Remove the JWT cookie
    notify("You have been logged out."); // Notify the user of successful logout
    setTimeout(() => {
      navigate('/'); // Redirect to the home page after 3 seconds
    }, 3000);
  };

  return (
    <div className="relative max-w-7xl mx-auto mt-10 p-6 bg-gray-100">
      <div className="w-full p-4 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Manage Tasks</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Log Out
          </button>
        </div>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <button
          onClick={editIndex !== null ? handleUpdateTask : handleAddTask}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!taskTitle.trim() || !taskDescription.trim()} // Disable button if fields are empty
        >
          {editIndex !== null ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      {/* Tasks Display */}
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No tasks found.</p>
      ) : (
        <div className="flex-grow grid grid-cols-2 gap-4 mt-6">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow-md rounded-lg flex flex-col justify-between items-start"
            >
              <div className="w-full">
                <h3 className="text-lg font-semibold break-words">{task.title}</h3>
                <p 
                  className="text-sm text-gray-500 break-words"
                >
                  {task.body}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="mt-4 space-x-2 self-end">
                <button
                  onClick={() => handleEditTask(index)}
                  className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(index)}
                  className="text-red-500 hover:text-red-600 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Tasks;
