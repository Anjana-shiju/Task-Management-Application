import { useEffect, useState, useCallback } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("today");
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);

  const loadTasks = useCallback(async () => {
    try {
      const res = await API.get(`/tasks/${taskType}`);
      setTasks(res.data);
      setCompletedIds([]);
    } catch {
      toast.error("Task load failed");
    }
  }, [taskType]);

  const loadHistory = useCallback(async () => {
    try {
      const res = await API.get("/tasks/history");
      setHistory(res.data);
    } catch {
      toast.error("History load failed");
    }
  }, []);

  useEffect(() => {
    loadTasks();
    loadHistory();
  }, [loadTasks, loadHistory]);

  const addTask = async () => {
    if (!title) return toast.warning("Enter title");

    try {
      await API.post("/tasks", { title, description, taskType });
      setTitle("");
      setDescription("");
      toast.success("Task added");
      loadTasks();
    } catch {
      toast.error("Add failed");
    }
  };

  const markDone = async (id) => {
    try {
      await API.put(`/tasks/done/${id}`);
      setCompletedIds((prev) => [...prev, id]);
      toast.success("Completed for today");
      loadHistory();
    } catch {
      toast.error("Update failed");
    }
  };

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
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];
    const completed = history.some((h) => h.date === dateStr);
    return completed ? "bg-success text-white rounded" : null;
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark px-4 mb-4">
        <span className="navbar-brand fs-4">📝 Task Manager</span>
        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </nav>

      <div className="container">
        {/* Tabs */}
        <ul className="nav nav-pills mb-4 justify-content-center">
          {["today", "daily", "weekly"].map((type) => (
            <li className="nav-item" key={type}>
              <button
                className={`nav-link ${taskType === type ? "active" : ""}`}
                onClick={() => setTaskType(type)}
              >
                {type.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>

        {/* Add Task */}
        <div className="card shadow-sm p-4 mb-4 border-0">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-plus-circle me-2"></i> Add New Task
          </h5>
          <input
            className="form-control mb-3"
            placeholder="📌 Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="form-control mb-3"
            placeholder="📝 Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            className="btn btn-outline-primary w-100 fw-semibold"
            onClick={addTask}
          >
            <i className="bi bi-check2-circle me-2"></i> Add Task
          </button>
        </div>

        {/* Search */}
        <input
          className="form-control mb-4"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Task List */}
        {filteredTasks.length === 0 && (
          <p className="text-muted text-center">No matching tasks</p>
        )}

        {filteredTasks.map((task) => {
          const isCompleted = completedIds.includes(task._id);
          return (
            <div className="card shadow-sm mb-3 border-0" key={task._id}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-1">{task.title}</h6>
                  <p className="text-muted mb-1">{task.description}</p>
                  {isCompleted && (
                    <span className="badge bg-success">Completed today</span>
                  )}
                </div>
                <div className="d-flex gap-2">
                  {!isCompleted && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => markDone(task._id)}
                    >
                      <i className="bi bi-check-circle me-1"></i> Done
                    </button>
                  )}
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteTask(task._id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Calendar */}
        <div className="card shadow-sm p-4 mt-4 border-0">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-calendar-check me-2"></i> Completion Calendar
          </h5>
          <Calendar tileClassName={tileClassName} />
          <small className="text-muted mt-2 d-block">
            ✅ Green dates = tasks completed
          </small>
        </div>
      </div>
    </div>
  );
}
