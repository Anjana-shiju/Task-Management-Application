// import { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import API from "../api";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [tasks, setTasks] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [taskType, setTaskType] = useState("today");
//   const [search, setSearch] = useState("");
//   const [history, setHistory] = useState([]);
//   const [user, setUser] = useState(undefined);

//   // 🔐 Auth check
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("user");
//       if (!raw) setUser(null);
//       else setUser(JSON.parse(raw));
//     } catch {
//       setUser(null);
//     }
//   }, []);

//   useEffect(() => {
//     if (user === null) navigate("/login");
//   }, [user, navigate]);

//   // 📥 Load tasks
//   const loadTasks = useCallback(async () => {
//     try {
//       const res = await API.get(`/tasks/${taskType}`);
//       setTasks(res.data || []);
//     } catch {
//       toast.error(`${taskType} tasks load failed`);
//     }
//   }, [taskType]);

//   // 📅 Load history
//   const loadHistory = useCallback(async () => {
//     try {
//       const res = await API.get("/tasks/history/all");
//       setHistory(res.data || []);
//     } catch {}
//   }, []);

//   useEffect(() => {
//     if (user?._id) {
//       loadTasks();
//       loadHistory();
//     }
//   }, [user, taskType, loadTasks, loadHistory]);

//   // ➕ Add task
//   const addTask = async () => {
//     if (!title.trim()) return toast.warning("Enter title");

//     try {
//       await API.post("/tasks/add", {
//         title,
//         description,
//         taskType,
//       });

//       setTitle("");
//       setDescription("");
//       toast.success(`${taskType} task added`);
//       loadTasks();
//     } catch {
//       toast.error("Add task failed");
//     }
//   };

//   // ✅ Mark done
//   const markDone = async (id) => {
//     try {
//       await API.put(`/tasks/done/${id}`);
//       toast.success("Task completed 🎉");
//       loadTasks();
//       loadHistory();
//     } catch {
//       toast.error("Update failed");
//     }
//   };

//   // 🗑 Delete task
//   const deleteTask = async (id) => {
//     try {
//       await API.delete(`/tasks/${id}`);
//       toast.success("Task deleted");
//       loadTasks();
//       loadHistory();
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   // 🚪 Logout
//   const logout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   // 🔍 Search filter
//   const filteredTasks = tasks.filter((t) =>
//     t.title.toLowerCase().includes(search.toLowerCase())
//   );

//   // 📆 Calendar
//   const tileClassName = ({ date }) => {
//     const dateStr = date.toLocaleDateString("en-CA");
//     return history.some((h) => h.date === dateStr)
//       ? "bg-success text-white rounded-circle"
//       : null;
//   };

//   if (user === undefined)
//     return <div className="text-center mt-5">Loading...</div>;

//   if (user === null) return null;

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(180deg, #3698e3 0%, #ffffff 50%, #f3f7ff 100%)",
//       }}
//     >
//       {/* Navbar */}
//       <nav className="navbar bg-dark navbar-dark px-4 mb-4">
//         <span className="navbar-brand fw-bold fs-4">
//           📝 Task Manager
//         </span>
//         <button
//           className="btn btn-outline-light btn-sm"
//           onClick={logout}
//         >
//           Logout
//         </button>
//       </nav>

//       <div className="container pb-5" style={{ maxWidth: "850px" }}>
//         {/* Tabs */}
//         <ul className="nav nav-pills justify-content-center gap-2 mb-4">
//           {["today", "daily", "weekly"].map((type) => (
//             <li className="nav-item" key={type}>
//               <button
//                 className={`nav-link px-4 fw-semibold ${
//                   taskType === type
//                     ? "active shadow"
//                     : "bg-white text-dark border"
//                 }`}
//                 onClick={() => setTaskType(type)}
//               >
//                 {type.toUpperCase()}
//               </button>
//             </li>
//           ))}
//         </ul>

//         {/* Add Task */}
//         <div
//           className="card border-0 mb-4"
//           style={{
//             background: "rgba(255,255,255,0.85)",
//             backdropFilter: "blur(10px)",
//             borderRadius: "16px",
//             boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div className="card-body p-4">
//             <h5 className="fw-bold mb-3 text-dark">
//               New {taskType.toUpperCase()} Task
//             </h5>

//             <div className="row g-2">
//               <div className="col-md-5">
//                 <input
//                   className="form-control"
//                   placeholder="Task title"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   style={{ borderRadius: "10px" }}
//                 />
//               </div>

//               <div className="col-md-5">
//                 <input
//                   className="form-control"
//                   placeholder="Description"
//                   value={description}
//                   onChange={(e) =>
//                     setDescription(e.target.value)
//                   }
//                   style={{ borderRadius: "10px" }}
//                 />
//               </div>

//               <div className="col-md-2">
//                 <button
//                   className="btn w-100 fw-semibold"
//                   style={{
//                     backgroundColor: "#111827",
//                     color: "#fff",
//                     borderRadius: "10px",
//                   }}
//                   onClick={addTask}
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="input-group mb-4 shadow-sm">
//           <span className="input-group-text bg-white">
//             <i className="bi bi-search"></i>
//           </span>
//           <input
//             className="form-control"
//             placeholder={`Search ${taskType} tasks`}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* Task List */}
//         {filteredTasks.length === 0 ? (
//           <div className="text-center py-5 bg-white rounded shadow-sm">
//             <i className="bi bi-clipboard-x fs-1 text-muted"></i>
//             <p className="text-muted mt-2">No tasks</p>
//           </div>
//         ) : (
//           filteredTasks.map((task) => (
//             <div
//               key={task._id}
//               className="card mb-3 border-0"
//               style={{
//                 background: "rgba(255,255,255,0.9)",
//                 borderLeft: "4px solid #111827",
//                 borderRadius: "14px",
//                 boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
//               }}
//             >
//               <div className="card-body d-flex justify-content-between align-items-center">
//                 <div>
//                   <h6 className="fw-bold mb-1">
//                     {task.title}
//                   </h6>
//                   <p className="text-muted small mb-0">
//                     {task.description || "No description"}
//                   </p>
//                 </div>

//                 <div className="d-flex gap-2">
//                   <button
//                     className="btn btn-outline-success btn-sm rounded-pill px-3"
//                     onClick={() => markDone(task._id)}
//                   >
//                     <i className="bi bi-check-lg me-1"></i>
//                     Done
//                   </button>

//                   <button
//                     className="btn btn-outline-danger btn-sm"
//                     onClick={() => deleteTask(task._id)}
//                   >
//                     <i className="bi bi-trash"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}

//         {/* Calendar */}
//         <div
//           className="card border-0 mt-5"
//           style={{
//             background: "rgba(255,255,255,0.85)",
//             backdropFilter: "blur(10px)",
//             borderRadius: "16px",
//             boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div className="card-body p-4">
//             <h5 className="fw-bold text-center mb-4">
//               <i className="bi bi-calendar-check me-2"></i>
//               Consistency Tracker
//             </h5>

//             <div className="d-flex justify-content-center">
//               <Calendar tileClassName={tileClassName} />
//             </div>

//             <p className="small text-muted text-center mt-3">
//               Green dots = completed days
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import API from "../api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("today");
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(undefined);

  // 🔐 Auth check
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) setUser(null);
      else setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user, navigate]);

  // 📥 Load tasks
  const loadTasks = useCallback(async () => {
    try {
      const res = await API.get(`/tasks/${taskType}`);
      setTasks(res.data || []);
    } catch {
      toast.error(`${taskType} tasks load failed`);
    }
  }, [taskType]);

  // 📅 Load history
  const loadHistory = useCallback(async () => {
    try {
      const res = await API.get("/tasks/history/all");
      setHistory(res.data || []);
    } catch {}
  }, []);

  useEffect(() => {
    if (user?._id) {
      loadTasks();
      loadHistory();
    }
  }, [user, taskType, loadTasks, loadHistory]);

  // ➕ Add task
  const addTask = async () => {
    if (!title.trim()) return toast.warning("Enter title");

    try {
      await API.post("/tasks/add", {
        title,
        description,
        taskType,
      });

      setTitle("");
      setDescription("");
      toast.success(`${taskType} task added`);
      loadTasks();
    } catch {
      toast.error("Add task failed");
    }
  };

  // ✅ Mark done
  const markDone = async (id) => {
    try {
      await API.put(`/tasks/done/${id}`);
      toast.success("Task completed 🎉");
      loadTasks();
      loadHistory();
    } catch {
      toast.error("Update failed");
    }
  };

  // 🗑 Delete task
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      loadTasks();
      loadHistory();
    } catch {
      toast.error("Delete failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const tileClassName = ({ date }) => {
    const dateStr = date.toLocaleDateString("en-CA");
    return history.some((h) => h.date === dateStr)
      ? "bg-success text-white rounded-circle"
      : null;
  };

  // ✨ Glassmorphism Style
  const glassStyle = {
  background: "rgba(14, 13, 13, 0.45)", // അല്പം കൂടി തെളിച്ചമുള്ള ബാക്ക്ഗ്രൗണ്ട്
  backdropFilter: "blur(15px)",
  WebkitBackdropFilter: "blur(15px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
};

  if (user === undefined)
    return <div className="text-center mt-5">Loading...</div>;

  if (user === null) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3698e3 0%, #7fbcf0 50%, #f3f7ff 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-dark px-4 mb-4" style={{ background: "rgba(0,0,0,0.15)", backdropFilter: "blur(5px)" }}>
        <span className="navbar-brand fw-bold fs-4">📝 Task Manager</span>
        <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={logout}>Logout</button>
      </nav>

      <div className="container pb-5" style={{ maxWidth: "850px" }}>
        {/* Tabs */}
        <ul className="nav nav-pills justify-content-center gap-2 mb-4">
          {["today", "daily", "weekly"].map((type) => (
            <li className="nav-item" key={type}>
              <button
                className={`nav-link px-4 fw-semibold transition-all ${
                  taskType === type ? "active shadow bg-primary" : "text-white border-0"
                }`}
                style={taskType !== type ? { background: "rgba(255,255,255,0.15)" } : {}}
                onClick={() => setTaskType(type)}
              >
                {type.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>

        {/* Add Task Input Area */}
        <div className="card border-0 mb-4 shadow-sm" style={glassStyle}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3 text-white">New {taskType.toUpperCase()} Task</h5>
            <div className="row g-2">
              <div className="col-md-5">
                <input
                  className="form-control custom-input"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ background: "rgba(255,255,255,0.3)", border: "none", borderRadius: "10px", color: "#fff" }}
                />
              </div>
              <div className="col-md-5">
                <input
                  className="form-control custom-input"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ background: "rgba(255,255,255,0.3)", border: "none", borderRadius: "10px", color: "#fff" }}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-dark w-100 fw-bold shadow-sm" style={{ borderRadius: "10px" }} onClick={addTask}>Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="input-group mb-4 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
          <span className="input-group-text border-0" style={{ background: "rgba(255,255,255,0.4)" }}>
            <i className="bi bi-search text-dark"></i>
          </span>
          <input
            className="form-control border-0"
            placeholder={`Search ${taskType} tasks...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "rgba(255,255,255,0.4)", color: "#000" }}
          />
        </div>

        {/* Task List Section */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-5 text-white shadow-sm" style={glassStyle}>
            <i className="bi bi-clipboard-x fs-1 opacity-50"></i>
            <p className="mt-2 fw-medium opacity-75">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className="card mb-3 border-0 transition-all shadow-sm" style={glassStyle}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className={`fw-bold mb-1 ${task.status === "done" ? "text-decoration-line-through opacity-50 text-white" : "text-white"}`}>
                    {task.title}
                  </h6>
                  <p className="small mb-0 text-white-50">{task.description || "No description"}</p>
                </div>

                <div className="d-flex gap-2 align-items-center">
                  {/* ✅ LOGIC: Show Done button only if status is NOT "done" */}
                  {task.status !== "done" ? (
                    <button className="btn btn-success btn-sm rounded-pill px-3 shadow-sm" onClick={() => markDone(task._id)}>
                      <i className="bi bi-check-lg me-1"></i> Done
                    </button>
                  ) : (
                    <span className="badge bg-light text-success rounded-pill p-2 px-3 shadow-sm">
                      <i className="bi bi-check-all me-1"></i> Completed
                    </span>
                  )}

                  <button className="btn btn-link text-danger p-0 ms-2" onClick={() => deleteTask(task._id)}>
                    <i className="bi bi-trash3-fill fs-5"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Calendar Card */}
        <div className="card border-0 mt-5 shadow-sm" style={glassStyle}>
          <div className="card-body p-4 text-white">
            <h5 className="fw-bold text-center mb-4">
              <i className="bi bi-calendar-check-fill me-2"></i>Consistency Tracker
            </h5>
            <div className="d-flex justify-content-center custom-calendar-wrapper">
              <Calendar tileClassName={tileClassName} />
            </div>
          </div>
        </div>
      </div>

      {/* Global Style Adjustments */}
      <style>{`
        .custom-input::placeholder { color: rgba(255,255,255,0.7) !important; }
        .react-calendar { background: transparent !important; border: none !important; color: white !important; width: 100% !important; font-family: inherit; }
        .react-calendar__tile { color: white !important; border-radius: 8px; }
        .react-calendar__tile:hover { background: rgba(255,255,255,0.2) !important; }
        .react-calendar__navigation button { color: white !important; font-size: 1.2rem; }
        .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus { background-color: rgba(255,255,255,0.1) !important; }
        .react-calendar__month-view__weekdays__weekday { color: rgba(255,255,255,0.8) !important; text-decoration: none !important; }
        .react-calendar__month-view__days__day--neighboringMonth { opacity: 0.3; }
        .bg-success { background-color: #28a745 !important; }
      `}</style>
    </div>
  );
}

