import { UserInputError } from "apollo-server";
import { db } from "../../../db";
import { User } from "../../../models";
import { randomUUID } from "crypto";

export const addUser = async (
  _: any,
  { name, email }: { name: string; email: string }
) => {
  const existingUser = db.data!.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existingUser) {
    throw new UserInputError(`User with email "${email}" already exists.`);
  }

  const newUser: User = {
    id: randomUUID(),
    name,
    email,
  };

  db.data!.users.push(newUser);
  await db.write();
  return newUser;
};
