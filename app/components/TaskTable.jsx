"use client";

export default function TaskTable({ title, tasks, onAction, actionLabel }) {
  return (
<div className="overflow-x-auto">
  <table className="w-full table-auto border-collapse bg-white rounded-xl shadow-md">
    <thead className="bg-blue-100 text-gray-700">
      <tr>
        <th className="px-4 py-3 text-left font-semibold">Tarea</th>
        <th className="px-4 py-3 text-left font-semibold">Usuario</th>
        <th className="px-4 py-3 text-left font-semibold">Desde</th>
        <th className="px-4 py-3 text-left font-semibold">Hasta</th>
        <th className="px-4 py-3 text-left font-semibold">Acción</th>
      </tr>
    </thead>
    <tbody>
          {tasks.map((task, idx) => (
            <tr key={idx} className="hover:bg-blue-100 transition duration-200">
              <td className="px-4 py-2 text-black border border-gray-300">{task.titulo}</td>
              <td className="px-4 py-2 text-black border border-gray-300">{task.usuario}</td>
              <td className="px-4 py-2 text-black border border-gray-300">{task.desde}</td>
              <td className="px-4 py-2 text-black border border-gray-300">{task.hasta}</td>
              <td className="px-1 py-2 text-black border border-gray-300">
                {onAction && (
                  <button
                    onClick={() => onAction(task)}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 text-sm"
                  >
                    {actionLabel}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
