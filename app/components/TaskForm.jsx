"use client";
import { useState } from "react";
import { supabase } from '../lib/supabaseClient'


export default function TaskForm({ onAddTask, usuarios }) {
  const hoy = new Date().toISOString().split("T")[0];
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [usrSelected, setUsrSelected] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const handleAdd = async () => {
    if (!newTaskTitle || !usrSelected || !desde || !hasta) return;

    const user = usuarios.find(u => u.id === parseInt(usrSelected));
    
    const nuevaTarea = {
      titulo: newTaskTitle,
      usuario_id: 1, // puedes reemplazarlo por un ID real si usas autenticación
      fecha_inicio: desde,
      fecha_fin: hasta,
      estado: 'Pendiente',
      modificado_a: new Date().toISOString(),
    }
    
    
    onAddTask({
      titulo: newTaskTitle,
      usuario: user.nombre,
      desde,
      hasta
    });

    console.log(nuevaTarea);

    const { data, error } = await supabase.from('tareas').insert([nuevaTarea])

    if (error) {
      console.error('❌ Error al insertar tarea:', error.message)
    } else {
      console.log('✅ Tarea agregada:', data)
      setNewTaskTitle('') // limpia el input
    }



    setNewTaskTitle("");
    setUsrSelected("");
    setDesde("");
    setHasta("");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-9 gap-4 mb-6">
      <div className="flex flex-col sm:col-span-4">
        <label className="text-sm font-medium text-gray-600 mb-1">Título</label>
        <input 
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="p-3 text-black border border-gray-300 rounded-lg  "
          placeholder="Nueva tarea..."
        />
      </div>

      <div className="flex flex-col sm:col-span-2">
        <label className="text-sm font-medium text-gray-600 mb-1">Usuario</label>
        <select
          value={usrSelected}
          onChange={(e) => setUsrSelected(e.target.value)}
          className="p-3 text-black border border-gray-300 rounded-lg"
        >
          <option value="" disabled>Seleccione una opción</option>
          {usuarios.map((usr) => (
            <option key={usr.id} value={usr.id}>{usr.nombre}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Desde</label>
        <input
          type="date"
          min={hoy}
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          className="p-3 text-black border border-gray-300 rounded-lg"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Hasta</label>
        <input
          type="date"
          min={hoy}
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          className="p-3 text-black border border-gray-300 rounded-lg"
        />
      </div>

      <div className="flex flex-col justify-end">
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
