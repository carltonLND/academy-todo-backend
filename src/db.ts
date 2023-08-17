import { Client } from "pg";

export interface TaskCandidate {
  content: string;
}

interface Task extends TaskCandidate {
  id: number;
}

interface TasksDbAPI {
  getTasks: () => Promise<Task[]>;
  getOneTask: (id: number) => Promise<Task | "not found">;
  addTask: (task: TaskCandidate) => Promise<Task>;
  deleteTask: (id: number) => Promise<"success" | "not found">;
  editTask: (id: number, task: TaskCandidate) => Promise<Task | "not found">;
}

export function useTasksDbAPI(connectionString: string): TasksDbAPI {
  const client = new Client({
    connectionString,
  });

  client.connect(); // TODO: API functions may be invoked before client is connected

  async function getTasks(): Promise<Task[]> {
    const queryResult = await client.query("SELECT * FROM tasks LIMIT 100");
    return queryResult.rows;
  }

  async function getOneTask(id: number): Promise<Task | "not found"> {
    const queryResult = await client.query(
      "SELECT * FROM tasks WHERE id = $1",
      [id]
    );
    return queryResult.rowCount === 1 ? queryResult.rows[0] : "not found";
  }

  async function addTask(task: TaskCandidate): Promise<Task> {
    const queryResult = await client.query(
      "INSERT INTO tasks (content) VALUES ($1) RETURNING *",
      [task.content]
    );
    return queryResult.rows[0];
  }

  async function deleteTask(id: number): Promise<"success" | "not found"> {
    const queryResult = await client.query("DELETE FROM tasks WHERE id = $1", [
      id,
    ]);
    return queryResult.rowCount === 1 ? "success" : "not found";
  }

  async function editTask(
    id: number,
    task: TaskCandidate
  ): Promise<Task | "not found"> {
    const queryResult = await client.query(
      "UPDATE tasks SET content = $2 WHERE id = $1 RETURNING *",
      [id, task.content]
    );

    return queryResult.rowCount === 1 ? queryResult.rows[0] : "not found";
  }

  return { getTasks, getOneTask, addTask, deleteTask, editTask };
}
