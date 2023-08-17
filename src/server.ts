import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { useTasksDbAPI, TaskCandidate } from "./db";
import filePath from "./filePath";

const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

const DATABASE_URI = process.env.DATABASE_URI ?? "";
const PORT_NUMBER = process.env.PORT ?? 4000;

useTasksDbAPI(DATABASE_URI).then((taskAPI) => {
  app.get("/", (_, res) => {
    const pathToFile = filePath("../public/index.html");
    res.sendFile(pathToFile);
  });

  app.get("/tasks", async (_, res) => {
    const allTasks = await taskAPI.getTasks();
    res.status(200).json(allTasks);
  });

  app.post<{}, {}, TaskCandidate>("/tasks", async (req, res) => {
    const postData = req.body;
    const createdTask = await taskAPI.addTask(postData);
    res.status(201).json(createdTask);
  });

  app.get<{ id: string }>("/tasks/:id", async (req, res) => {
    const matchingTask = await taskAPI.getOneTask(parseInt(req.params.id));
    if (matchingTask === "not found") {
      res.status(404).json(matchingTask);
    } else {
      res.status(200).json(matchingTask);
    }
  });

  app.delete<{ id: string }>("/tasks/:id", async (req, res) => {
    const matchingTask = await taskAPI.deleteTask(parseInt(req.params.id));
    if (matchingTask === "not found") {
      res.status(404).json(matchingTask);
    } else {
      res.status(202).json(matchingTask);
    }
  });

  app.put<{ id: string }, {}, TaskCandidate>("/tasks/:id", async (req, res) => {
    const matchingTask = await taskAPI.editTask(
      parseInt(req.params.id),
      req.body
    );
    if (matchingTask === "not found") {
      res.status(404).json(matchingTask);
    } else {
      res.status(200).json(matchingTask);
    }
  });

  app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
  });
});
