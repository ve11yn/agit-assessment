// api handlers

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// create
export async function createTask(title: string, description?: string){
    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description: description || "",
            })
        });

        if (!response.ok){
            const error = await response.json();
            throw new Error(error.message || "Failed to create task");
        }
        const newTask: Task = await response.json();
        return newTask;
    } catch (error) {
        console.error("Create new task error:", error);
        throw error;
    }
}

// read
export async function getTasks(status?: "completed" | "pending") {
  try {
    let url = "/api/tasks";

    // query parameter for filtering
    if (status) {
      url += `?status=${status}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const tasks: Task[] = await response.json();
    return tasks;
  } catch (error) {
    console.error("Get tasks error:", error);
    throw error;
  }
}

// update
export async function updateTask(
  id: number,
  updates: {
    title?: string;
    description?: string;
    completed?: boolean;
  }
) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update task");
    }

    const updatedTask: Task = await response.json();
    return updatedTask;
  } catch (error) {
    console.error("Update task error:", error);
    throw error;
  }
}


// delete
export async function deleteTask(id: number) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete task");
    }

    const deletedTask: Task = await response.json();
    return deletedTask;
  } catch (error) {
    console.error("Delete task error:", error);
    throw error;
  }
}

// helper functions
export async function toggleTaskStatus(id: number, currentStatus: boolean) {
  return updateTask(id, { completed: !currentStatus });
}

export async function updateTaskTitle(id: number, newTitle: string) {
  return updateTask(id, { title: newTitle });
}

export async function updateTaskDescription(
  id: number,
  newDescription: string
) {
  return updateTask(id, { description: newDescription });
}