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

  // 🔐 User Authentication check
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined") {
        setUser(null);
      } else {
        setUser(JSON.parse(raw));
      }
    } catch (err) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user, navigate]);

  // 📥 Load tasks (Today/Daily/Weekly tabs select cheythaal refresh aakum)
  const loadTasks = useCallback(async () => {
    if (!user?._id) return;
    try {
      // Backend: router.get("/:type", auth, ...)
      const res = await API.get(`/tasks/${taskType}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error(`${taskType} tasks load failed`);
    }
  }, [user, taskType]);

  // 📅 Load history (Calendar-il dots kaanikkan)
  const loadHistory = useCallback(async () => {
    if (!user?._id) return;
    try {
      // Backend-il nammal add cheytha puthiya route: /tasks/history/all
      const res = await API.get("/tasks/history/all");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      loadTasks();
      loadHistory();
    }
  }, [loadTasks, loadHistory, user]);

  // ➕ Add task
  const addTask = async () => {
    if (!title.trim()) return toast.warning("Enter title");

    try {
      // Backend: router.post("/add", auth, ...)
      await API.post("/tasks/add", {
        title,
        description,
        taskType, 
      });

      setTitle("");
      setDescription("");
      toast.success(`${taskType} task added!`);
      loadTasks();
    } catch (err) {
      console.error(err);
      toast.error("Add failed");
    }
  };

  // ✅ Mark as done
const markDone = async (id) => {
  try {
    // 1. Backend-ilekk update request ayakkunnu
    await API.put(`/tasks/done/${id}`);
    
    // 2. TaskType anusarichu ulla message set cheyyunnu
    const message = taskType === "today" 
      ? "Awesome! Task finished. 🚀" 
      : "Great job! Keep going. 🔥";
      
    // 3. Toast notification kaanikkunnu
    toast.success(message, {
      theme: "colored",
      position: "top-right"
    });

    // 4. Data refresh cheyyunnu
    loadTasks();
    loadHistory();
  } catch (err) {
    console.error(err);
    toast.error("Status update failed");
  }
};

  // 🗑 Delete task
  const deleteTask = async (id) => {
    try {
      // Backend: router.delete("/:id", auth, ...)
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      loadTasks();
      loadHistory();
    } catch (err) {
      console.error(err);
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

  // Calendar logic
  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];
    // TaskHistory model-il 'date' field check cheyyunnu
    const completed = history.some((h) => h.date === dateStr);
    return completed ? "bg-success text-white rounded-circle" : null;
  };

  if (user === undefined) return <div className="text-center mt-5">Loading...</div>;
  if (user === null) return null;

  return (
    <div className="bg-light min-vh-100 pb-5">
      <nav className="navbar navbar-dark bg-dark px-4 mb-4">
        <span className="navbar-brand fs-4 fw-bold">📝 Task Manager</span>
        <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
      </nav>

      <div className="container" style={{ maxWidth: "800px" }}>
        {/* 📋 Tabs */}
        <ul className="nav nav-pills mb-4 justify-content-center gap-2">
          {["today", "daily", "weekly"].map((type) => (
            <li className="nav-item" key={type}>
              <button
                className={`nav-link px-4 ${taskType === type ? "active shadow" : "bg-white border text-dark"}`}
                onClick={() => setTaskType(type)}
              >
                {type.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>

        {/* ➕ Add Task Card */}
        <div className="card shadow-sm p-4 mb-4 border-0">
          <h5 className="fw-bold mb-3 text-primary">New {taskType.toUpperCase()} Task</h5>
          <div className="row g-2">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100" onClick={addTask}>Add</button>
            </div>
          </div>
        </div>

        {/* 🔍 Search */}
        <div className="input-group mb-4 shadow-sm">
          <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
          <input
            className="form-control border-start-0 py-2"
            placeholder={`Search ${taskType} tasks...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 📝 Task List */}
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-5 bg-white rounded shadow-sm border">
              <i className="bi bi-clipboard-x fs-1 text-muted"></i>
              <p className="text-muted mt-2">No tasks in {taskType} list</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div className="card shadow-sm mb-3 border-0 border-start border-4 border-primary" key={task._id}>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-1">{task.title}</h6>
                    <p className="text-muted small mb-0">{task.description || "No description"}</p>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-success btn-sm border-2 rounded-pill px-3" onClick={() => markDone(task._id)}>
                      <i className="bi bi-check-lg me-1"></i> Done
                    </button>
                    <button className="btn btn-outline-danger btn-sm border-0" onClick={() => deleteTask(task._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 📆 Calendar Section */}
        <div className="card shadow-sm p-4 mt-5 border-0">
          <h5 className="fw-bold mb-4 text-center"><i className="bi bi-calendar-check me-2"></i>Consistency Tracker</h5>
          <div className="d-flex justify-content-center">
            <Calendar 
              tileClassName={tileClassName} 
              className="border-0 shadow-sm rounded p-2"
            />
          </div>
          <p className="small text-muted text-center mt-3">Green dots show days you completed at least one task.</p>
        </div>
      </div>
    </div>
  );
}