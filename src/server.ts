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

app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

app.get("/tasks", (req, res) => {
  const allSignatures = getAllDbItems();
  res.status(200).json(allSignatures);
});

app.post<{}, {}, DbItem>("/tasks", (req, res) => {
  const postData = req.body;
  const createdSignature = addDbItem(postData);
  res.status(201).json(createdSignature);
});

app.get<{ id: string }>("/tasks/:id", (req, res) => {
  const matchingSignature = getDbItemById(parseInt(req.params.id));
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

app.delete<{ id: string }>("/tasks/:id", (req, res) => {
  const matchingSignature = deleteDbItemById(parseInt(req.params.id));
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(202).json(matchingSignature);
  }
});

// app.patch<{ id: string }, {}, Partial<DbItem>>("/tasks/:id", (req, res) => {
//   const matchingSignature = updateDbItemById(parseInt(req.params.id), req.body);
//   if (matchingSignature === "not found") {
//     res.status(404).json(matchingSignature);
//   } else {
//     res.status(200).json(matchingSignature);
//   }
// });

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
