"use client";


export default function TaskTable({ tasks, onAction, actionLabel ,usuariosMap,user}) {
    console.log("🧪 user1 en TaskTable:", user.id);
    
  return (
    
<div className="overflow-x-auto">
  
  <table className="w-full table-auto border-collapse bg-white rounded-xl shadow-md">
    <thead className="bg-blue-100 text-gray-700">
      <tr>
  <th className="w-1/5 px-4 py-3 text-left font-semibold">Tarea</th>
  <th className="w-1/6 px-4 py-3 text-left font-semibold">Asignado para</th>
  <th className="w-1/6 px-4 py-3 text-left font-semibold">Asignado por</th>
  <th className="w-1/5 px-4 py-3 text-left font-semibold">Desde</th>
  <th className="w-1/5 px-4 py-3 text-left font-semibold">Hasta</th>
  <th className="w-1/9 px-4 py-3 text-left font-semibold">
    {actionLabel === 'completado' ? 'Fecha término' : 'Acción'}
  </th>
</tr>
    </thead>
    <tbody>
          {tasks.map((task, idx) => (
            <tr key={idx} className="hover:bg-blue-100 transition duration-200">
              <td className="px-4 py-2 text-black border border-gray-300">{task.titulo} </td>
              <td className="px-4 py-2 text-black border border-gray-300">{usuariosMap?.[task.asignado_id] || "Desconocido"}</td>
              <td className="px-4 py-2 text-black border border-gray-300">{usuariosMap?.[task.creador_id] || "Desconocido"}</td>
              <td className="px-4 py-2 text-black border border-gray-300">{task.fecha_inicio}</td>
              <td className="px-4 py-2 text-black border border-gray-300">{task.fecha_fin}</td>
              <td className="px-1 py-2 text-black border border-gray-300">
              {actionLabel === 'completado' ? (
                <span>{task.modificado_a 
    ? new Date(task.modificado_a).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) 
    : "—"}</span>
              ) : (
                onAction && (
                 user?.id && 
task.asignado_id === user.id ? (
  <button
    onClick={() => onAction(task)}
    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 text-sm"
  >
    {actionLabel}
  </button>
) : (
  <span></span>
)
                  
                )
              )}
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
