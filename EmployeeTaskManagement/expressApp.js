
import express from "express";

const app = express();

// B1: JSON Middleware
app.use(express.json());

// B3: Sample Employee Tasks
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Priya Singh",
        status: "In Progress",
        priority: "Medium"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Amit Kumar",
        status: "Completed",
        priority: "Low"
    }
];

// B2: GET - Retrieve All Tasks
app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

// B2: GET - Retrieve Task By ID
app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.status(200).json(task);
});

// B2: POST - Add New Task
app.post("/tasks", (req, res) => {
    const { id, taskName, assignedTo, status, priority } = req.body;

    if (
        id === undefined ||
        typeof taskName !== "string" || !taskName.trim() ||
        typeof assignedTo !== "string" || !assignedTo.trim() ||
        typeof status !== "string" || !status.trim() ||
        typeof priority !== "string" || !priority.trim()
    ) {
        return res.status(400).json({
            message: "All task fields are required"
        });
    }

    if (tasks.some(t => t.id === Number(id))) {
        return res.status(400).json({
            message: "Task ID already exists"
        });
    }

    const newTask = {
        id: Number(id),
        taskName,
        assignedTo,
        status,
        priority
    };

    tasks.push(newTask);

    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });
});

// B2: PUT - Update Task
app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const { taskName, assignedTo, status, priority } = req.body;

    if (
        typeof taskName !== "string" || !taskName.trim() ||
        typeof assignedTo !== "string" || !assignedTo.trim() ||
        typeof status !== "string" || !status.trim() ||
        typeof priority !== "string" || !priority.trim()
    ) {
        return res.status(400).json({
            message: "All task fields are required"
        });
    }

    task.taskName = taskName;
    task.assignedTo = assignedTo;
    task.status = status;
    task.priority = priority;

    res.status(200).json({
        message: "Task updated successfully",
        task: task
    });
});

// B2: DELETE - Delete Task
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.status(200).json({
        message: "Task deleted successfully"
    });
});

// B4: Handle Invalid Routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// B1: Start Express Server
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});
