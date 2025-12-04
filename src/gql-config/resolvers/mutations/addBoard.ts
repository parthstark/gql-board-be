import { UserInputError } from "apollo-server";
import { db } from "../../../db";
import { Board } from "../../../models";
import { v4 as uuid } from "uuid";

export const addBoard = async (
  _: any,
  {
    title,
    key,
    description,
    ownerEmail,
  }: {
    title: string;
    key: string;
    description?: string;
    ownerEmail: string;
  }
) => {
  const user = db.data!.users.find((u) => u.email == ownerEmail);
  if (!user) {
    throw new UserInputError(
      `User with email "${ownerEmail}" does not exists.`
    );
  }

  const existingBoard = db.data!.boards.find((b) => b.key === key);
  if (existingBoard) {
    throw new UserInputError(`Board with key "${key}" already exists.`);
  }

  const newBoard: Board = {
    id: uuid(),
    title,
    key,
    description,
    ownerId: user.id,
    taskCounter: 0,
    createdAt: new Date().toISOString(),
  };
  db.data!.boards.push(newBoard);
  await db.write();
  return newBoard;
};
