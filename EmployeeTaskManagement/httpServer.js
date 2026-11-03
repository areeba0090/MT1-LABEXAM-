
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Employee tasks array
let tasks = [];

// Create HTTP Server
const server = http.createServer((req, res) => {

    // A2: GET /
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Welcome to Employee Task Management System</h1>");
    }

    // A2 and A3: GET /tasks
    else if (req.url === "/tasks" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(tasks));
    }

    // A2: GET /about
    else if (req.url === "/about" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <h1>Employee Task Management Application</h1>
            <p>This application helps manage employee tasks.</p>
        `);
    }

    // A2 and A4: GET /home
    else if (req.url === "/home" && req.method === "GET") {

        const filePath = path.join(__dirname, "public", "index.html");

        fs.readFile(filePath, "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error reading HTML file");
            }
            else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }

        });
    }

    // A3: POST /add-task
    else if (req.url === "/add-task" && req.method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {

            try {
                const newTask = JSON.parse(body);

                const { id, taskName, assignedTo, status } = newTask;

                // Validate required fields
                if (
                    id === undefined ||
                    typeof taskName !== "string" || !taskName.trim() ||
                    typeof assignedTo !== "string" || !assignedTo.trim() ||
                    typeof status !== "string" || !status.trim()
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "All fields are required: id, taskName, assignedTo and status"
                    }));

                    return;
                }

                // Add task
                tasks.push(newTask);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Task added successfully",
                    task: newTask
                }));

            }
            catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON data"
                }));
            }

        });
    }

    // A5: Invalid routes and methods
    else {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Page Not Found");
    }

});

// A1: Start server
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
