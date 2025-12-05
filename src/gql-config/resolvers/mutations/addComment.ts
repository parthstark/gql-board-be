import { UserInputError } from "apollo-server";
import { db } from "../../../db";
import { Comment } from "../../../models";
import { randomUUID } from "crypto";

export const addComment = async (
  _: any,
  {
    taskKey,
    authorEmail,
    text,
  }: { taskKey: string; authorEmail: string; text: string }
) => {
  const author = db.data!.users.find((u) => u.email === authorEmail);
  if (!author) {
    throw new UserInputError(
      `User with email "${authorEmail}" does not exist.`
    );
  }

  const task = db.data!.tasks.find((t) => t.key === taskKey);
  if (!task) {
    throw new UserInputError(`Task with key "${taskKey}" does not exist.`);
  }

  const newComment: Comment = {
    id: randomUUID(),
    taskId: task.id,
    userId: author.id,
    text,
    createdAt: new Date().toISOString(),
  };
  db.data!.comments.push(newComment);
  await db.write();
  return newComment;
};
