"use client";
import { useEffect, useState } from 'react'
import TaskForm from "./TaskForm";
import TaskTable from "./TaskTable";
import { useUser } from "./UserContext";
import { supabase } from '../lib/supabaseClient';
import TaskSection from './TaskSection'

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [startedTasks, setStartedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const { user, loading } = useUser();
  

  const [usuariosMap, setUsuariosMap] = useState(null);

 const [usuarios, setUsuarios] = useState([]);

    const extraerUsrTareas = async () => {
    const { data, error } = await supabase
      .from('relaciones')
      .select('usuario_destino (id, nombre)')
      .eq('usuario_origen', user.id);

    if (error) {
      console.error(error);
      return [];
    }

    // Mapear para obtener solo los usuarios destino
    return data.map(item => item.usuario_destino);
  };

  const fetchTareas = async () => {
  const { data: tareas, error } = await supabase
    .from('tareas')
    .select('*')
    .or(`creador_id.eq.${user.id},asignado_id.eq.${user.id}`);

  if (error) {
    console.error('❌ Error al obtener tareas:', error.message);
    return [];
  }

  return tareas;
};


const fetchUsuarios = async (ids: string[]) => {
  const { data: usuarios, error } = await supabase
    .from('usuarios')
    .select('id, nombre')
    .in('id', ids);

  if (error) {
    console.error('❌ Error al obtener usuarios:', error.message);
    return [];
  }

  return usuarios;
};

const cargarTareasYUsuarios = async () => {
  const tareas = await fetchTareas();

  const idsUnicos = [
    ...new Set(tareas.flatMap(t => [t.creador_id, t.asignado_id]))
  ];

  const usuarios = await fetchUsuarios(idsUnicos);

  const usuariosMap = Object.fromEntries(usuarios.map(u => [u.id, u.nombre]));
  setUsuariosMap(usuariosMap);

  setTasks(tareas.filter(t => t.estado === 'pendiente'));
  setStartedTasks(tareas.filter(t => t.estado === 'en_progreso'));
  setCompletedTasks(tareas.filter(t => t.estado === 'completada'));
};





useEffect(() => {

  if (!user) return;

   if (user) {
    setUsuarios([{ id: user.id, nombre: 'Yo' }]);
  }
  
  async function cargarUsuarios() {
      const nuevosUsuarios = await extraerUsrTareas();

      // se llama set usuarios con parametro prevUsuarios que es el que es genrado por el componente
      //
      setUsuarios(prevUsuarios => {
        

        //aca se crea un array con todos los users id  que ya estan en el estado usuarios
        const idsPrevios = prevUsuarios.map(u => u.id);
        //aca filtra para eliminar los que ya estan en el estado para no repetir
        const usuariosFiltrados = nuevosUsuarios.filter(u => !idsPrevios.includes(u.id));
        //retorna un nuevo array con lo antiguo + nuevo
        return [...prevUsuarios, ...usuariosFiltrados];
      });
    }
    // se jecuta la funcion
    cargarUsuarios();
  

  if (user) cargarTareasYUsuarios();
  console.log(user)
}, [user]);


  // ✅ Estos returns deben ir después de todos los hooks
  if (loading) {
    return <div className="text-gray-600">Cargando usuario...</div>;
  }

  if (!user) {
    return <div className="text-red-600">No has iniciado sesión.</div>;
  }
  if (!usuariosMap) {
  return <div className="text-gray-600">Cargando tareas y usuarios...</div>;
}


  const startTask = async (task) => {
    
    const {data,error}= await supabase
            .from('tareas')
            .update({ estado:'en_progreso' })
            .eq('id',task.id);
    if (error){
      console.log('ERROR AL MODIFICAR LA TAREA',error.message);
      return;
    }
    setTasks(tasks.filter(t => t !== task));
    setStartedTasks([...startedTasks, task]);
  };

  const completeTask = async (task) => {

    const {data,error}= await supabase 
          .from('tareas')
          .update({estado:'completada'})
          .eq('id',task.id);

    if(error){
      console.log('ERROR AL completar LA TAREA',error.message);
    }

    setStartedTasks(startedTasks.filter(t => t !== task));
    setCompletedTasks([...completedTasks, task]);
  };

  const exportToPDF = () => {
    alert("Exportar a PDF aún no implementado.");
  };

  return (
    
<div className="max-w-[95%] mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg" id="task-list">
  <button
    onClick={exportToPDF}
    className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
  >
    📄 Exportar a PDF
  </button>

  <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">Tareas 🧩</h1>

  <TaskForm creador={user.id} usuarios={usuarios} onTaskAdded={cargarTareasYUsuarios} />

  <div className="flex flex-col gap-6">
    {user && (
    <TaskSection title="📌 Tareas Pendientes">
      <TaskTable
        tasks={tasks}
        title="📌 Tareas"
        onAction={startTask}
        actionLabel="▶️ Iniciar"
        usuariosMap={usuariosMap}
        user={user}
      />
    </TaskSection> )}

    {user && (
    <TaskSection title="▶️ Tareas Iniciadas">
      <TaskTable
        tasks={startedTasks}
        title="▶️ Tareas Iniciadas"
        onAction={completeTask}
        actionLabel="✅ Completar"
        usuariosMap={usuariosMap}
        user={user}
      />
    </TaskSection>)}
    {user && (
    <TaskSection title="✅ Tareas Completadas">
      <TaskTable
        tasks={completedTasks}
        title="✅ Tareas Completadas"
        onAction={null}
        actionLabel="completado"
        usuariosMap={usuariosMap}
        user={user}
      />
    </TaskSection>)}
  </div>
</div>
  );
}
