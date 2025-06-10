"use client";

import { useState } from "react";
import TaskForm from "./TaskForm";
import TaskTable from "./TaskTable";
import LogoutButton from "./LogOut";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [startedTasks, setStartedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const usuarios = [
    { id: 1, nombre: "Usuario 1" },
    { id: 2, nombre: "Usuario 2" },
  ];

  const addTask = (task) => setTasks(prev => [...prev, task]);

  const startTask = (task) => {
    setTasks(tasks.filter(t => t !== task));
    setStartedTasks([...startedTasks, task]);
  };

  const completeTask = (task) => {
    setStartedTasks(startedTasks.filter(t => t !== task));
    setCompletedTasks([...completedTasks, task]);
  };

  const exportToPDF = () => {
    alert("Exportar a PDF aún no implementado.");
  };

  return (
    <div className="max-w-[95%] mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg" id="task-list">
      <button onClick={exportToPDF} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        📄 Exportar a PDF
      </button>
      

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">Tasks 📝</h1>

      <TaskForm onAddTask={addTask} usuarios={usuarios} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <TaskTable title="📌 Tareas" tasks={tasks} onAction={startTask} actionLabel="▶️ Iniciar" />
        <TaskTable title="▶️ Tareas Iniciadas" tasks={startedTasks} onAction={completeTask} actionLabel="✅ Completar" />
        <TaskTable title="✅ Tareas Completadas" tasks={completedTasks} onAction={null} actionLabel="" />
      </div>
    </div>
  );
}
