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

  // 🚪 Logout
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔍 Search filter
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  // 📆 Calendar
  const tileClassName = ({ date }) => {
    const dateStr = date.toLocaleDateString("en-CA");
    return history.some((h) => h.date === dateStr)
      ? "bg-success text-white rounded-circle"
      : null;
  };

  if (user === undefined)
    return <div className="text-center mt-5">Loading...</div>;

  if (user === null) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #3698e3 0%, #ffffff 50%, #f3f7ff 100%)",
      }}
    >
      {/* Navbar */}
      <nav className="navbar bg-dark navbar-dark px-4 mb-4">
        <span className="navbar-brand fw-bold fs-4">
          📝 Task Manager
        </span>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={logout}
        >
          Logout
        </button>
      </nav>

      <div className="container pb-5" style={{ maxWidth: "850px" }}>
        {/* Tabs */}
        <ul className="nav nav-pills justify-content-center gap-2 mb-4">
          {["today", "daily", "weekly"].map((type) => (
            <li className="nav-item" key={type}>
              <button
                className={`nav-link px-4 fw-semibold ${
                  taskType === type
                    ? "active shadow"
                    : "bg-white text-dark border"
                }`}
                onClick={() => setTaskType(type)}
              >
                {type.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>

        {/* Add Task */}
        <div
          className="card border-0 mb-4"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3 text-dark">
              New {taskType.toUpperCase()} Task
            </h5>

            <div className="row g-2">
              <div className="col-md-5">
                <input
                  className="form-control"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ borderRadius: "10px" }}
                />
              </div>

              <div className="col-md-5">
                <input
                  className="form-control"
                  placeholder="Description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  style={{ borderRadius: "10px" }}
                />
              </div>

              <div className="col-md-2">
                <button
                  className="btn w-100 fw-semibold"
                  style={{
                    backgroundColor: "#111827",
                    color: "#fff",
                    borderRadius: "10px",
                  }}
                  onClick={addTask}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="input-group mb-4 shadow-sm">
          <span className="input-group-text bg-white">
            <i className="bi bi-search"></i>
          </span>
          <input
            className="form-control"
            placeholder={`Search ${taskType} tasks`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <i className="bi bi-clipboard-x fs-1 text-muted"></i>
            <p className="text-muted mt-2">No tasks</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="card mb-3 border-0"
              style={{
                background: "rgba(255,255,255,0.9)",
                borderLeft: "4px solid #111827",
                borderRadius: "14px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-1">
                    {task.title}
                  </h6>
                  <p className="text-muted small mb-0">
                    {task.description || "No description"}
                  </p>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-success btn-sm rounded-pill px-3"
                    onClick={() => markDone(task._id)}
                  >
                    <i className="bi bi-check-lg me-1"></i>
                    Done
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteTask(task._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Calendar */}
        <div
          className="card border-0 mt-5"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <div className="card-body p-4">
            <h5 className="fw-bold text-center mb-4">
              <i className="bi bi-calendar-check me-2"></i>
              Consistency Tracker
            </h5>

            <div className="d-flex justify-content-center">
              <Calendar tileClassName={tileClassName} />
            </div>

            <p className="small text-muted text-center mt-3">
              Green dots = completed days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
