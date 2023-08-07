import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  addDbItem,
  getAllDbItems,
  getDbItemById,
  DbItem,
  // updateDbItemById,
  deleteDbItemById,
} from "./db";
import filePath from "./filePath";

const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

const PORT_NUMBER = process.env.PORT ?? 4000;

app.get("/", (_, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

app.get("/tasks", (_, res) => {
  const allTasks = getAllDbItems();
  res.status(200).json(allTasks);
});

app.post<{}, {}, DbItem>("/tasks", (req, res) => {
  const postData = req.body;
  const createdTask = addDbItem(postData);
  res.status(201).json(createdTask);
});

app.get<{ id: string }>("/tasks/:id", (req, res) => {
  const matchingTask = getDbItemById(parseInt(req.params.id));
  if (matchingTask === "not found") {
    res.status(404).json(matchingTask);
  } else {
    res.status(200).json(matchingTask);
  }
});

app.delete<{ id: string }>("/tasks/:id", (req, res) => {
  const matchingTask = deleteDbItemById(parseInt(req.params.id));
  if (matchingTask === "not found") {
    res.status(404).json(matchingTask);
  } else {
    res.status(202).json(matchingTask);
  }
});

// app.patch<{ id: string }, {}, Partial<DbItem>>("/tasks/:id", (req, res) => {
//   const matchingTask = updateDbItemById(parseInt(req.params.id), req.body);
//   if (matchingTask === "not found") {
//     res.status(404).json(matchingTask);
//   } else {
//     res.status(200).json(matchingTask);
//   }
// });

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
