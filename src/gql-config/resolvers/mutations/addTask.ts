import { UserInputError } from "apollo-server";
import { db } from "../../../db";
import { Task } from "../../../models";
import { randomUUID } from "crypto";

export const addTask = async (
  _: any,
  {
    title,
    boardKey,
    assigneeEmail,
    parentTaskKey,
  }: {
    title: string;
    boardKey: string;
    assigneeEmail?: string;
    parentTaskKey?: string;
  }
) => {
  const board = db.data!.boards.find((b) => b.key === boardKey);
  if (!board) {
    throw new UserInputError(`Board with key "${boardKey}" does not exist.`);
  }

  let assigneeId: string | undefined;
  if (assigneeEmail) {
    const assignee = db.data!.users.find((u) => u.email === assigneeEmail);
    if (!assignee) {
      throw new UserInputError(
        `User with email "${assigneeEmail}" does not exist.`
      );
    }
    assigneeId = assignee.id;
  }

  let parentTaskId: string | undefined;
  if (parentTaskKey) {
    const parentTask = db.data!.tasks.find((t) => t.key === parentTaskKey);
    if (!parentTask) {
      throw new UserInputError(
        `Parent task with key "${parentTaskKey}" does not exist.`
      );
    }
    if (parentTask.boardId !== board.id) {
      throw new UserInputError(`Parent task must be on the same board.`);
    }
    parentTaskId = parentTask.id;
  }

  // Generate task key using counter
  const boardKeyUpper = board.key.toUpperCase().replace(/[^A-Z0-9]/g, "");
  board.taskCounter += 1;
  const taskKey = `${boardKeyUpper}-${board.taskCounter}`;

  const newTask: Task = {
    id: randomUUID(),
    key: taskKey,
    title,
    boardId: board.id,
    assigneeId,
    parentTaskId,
    status: "TODO",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.data!.tasks.push(newTask);
  await db.write();
  return newTask;
};
