const express = require("express");
const tasksRouter = express.Router();
//mysql
const mysql = require("mysql2/promise");
require("dotenv").config();
//вводо заданий в таблицу
tasksRouter.get("/api/v1/tasks", async (req, res) => {  
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const [tasks] = await connection.query("SELECT * FROM tasks");
    res.json({ tasks: tasks });
    connection.end();
});
//для получения инфы по отдельномиу таску
tasksRouter.get("/api/v1/tasks/:id", async (req, res) => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const taskId = req.params.id;
    if (!taskId || isNaN(taskId)) {
        return res.status(400).json({ message: "Wrong input!" });
    }
    const [tasks] = await connection.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
    if (tasks.length === 0) {
        return res.status(404).json({ message: "Not found!" });
    };
    res.json({ task: tasks[0] });
    connection.end();
});
//вывод заданий
tasksRouter.post("/api/v1/tasks", async (req, res) => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const taskName = req.body.name;
    await connection.query("INSERT INTO tasks (name) VALUES (?)", [
        taskName,
    ]);
    res.status(201).json({ message: "Created!" });
    connection.end();
});
//редактирование
tasksRouter.patch("/api/v1/tasks/:id", async (req, res) => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const taskId = req.params.id;
    const { name, completed } = req.body;
    const [tasks] = await connection.query(`SELECT * FROM tasks WHERE id = ?`, [taskId]);
    const updateData = {
        name: name,
        completed: completed,
    };
    if (tasks.length === 0) {
        return res.status(404).json({ message: "Not found!" });
    };
    await connection.query("UPDATE tasks SET ? WHERE id = ?", [updateData, taskId]);
    res.status(200).json({ message: "Updated!", task: {...tasks[0], ...updateData } });
    connection.end();
});
//удалить
tasksRouter.delete("/api/v1/tasks/:id", async (req, res) => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const taskId = req.params.id;
    await connection.query("DELETE FROM tasks WHERE id = ?", [taskId]);
    res.status(200).json({ message: "Deleted!" });
    connection.end();
});

module.exports = tasksRouter;