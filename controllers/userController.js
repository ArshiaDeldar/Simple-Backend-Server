import prisma from "../lib/prisma.js";
import validateEmail from "../email.js";

export async function getAllUsers(req, res) {
  const users = await prisma.users.findMany();
  res.status(200).json(users);
}

export async function getUserById(req, res) {
  const id = Number(req.params.id);

  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json(user);
}

export async function getUserCount(req, res) {
  const count = await prisma.users.count();

  res.status(200).json({ count });
}

export async function createUser(req, res) {
  const { name, email } = req.body ?? {};
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !validateEmail(email.trim())
  ) {
    const error = new Error("Invalid name or email");
    error.statusCode = 400;
    throw error;
  }
  const newUser = await prisma.users.create({
    data: {
      name: name.trim(),
      email: email.trim(),
    },
  });
  return res.status(201).json(newUser);
}

export async function replaceUserInfo(req, res) {
  const id = Number(req.params.id);
  const { name, email } = req.body ?? {};
  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !validateEmail(email.trim())
  ) {
    const error = new Error("Invalid name or email");
    error.statusCode = 400;
    throw error;
  }
  const updatedUser = await prisma.users.update({
    where: { id },
    data: {
      name: name.trim(),
      email: email.trim(),
    },
  });
  res.status(200).json(updatedUser);
}

export async function editUserInfo(req, res) {
  const id = Number(req.params.id);
  const { name, email } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Invalid user ID");
    error.statusCode = 400;
    throw error;
  }

  if (name === undefined && email === undefined) {
    const error = new Error("No update information provided");
    error.statusCode = 400;
    throw error;
  }

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    const error = new Error("Invalid name");
    error.statusCode = 400;
    throw error;
  }

  if (
    email !== undefined &&
    (typeof email !== "string" || !validateEmail(email.trim()))
  ) {
    const error = new Error("Invalid email");
    error.statusCode = 400;
    throw error;
  }

  const data = {};

  if (name !== undefined) {
    data.name = name.trim();
  }

  if (email !== undefined) {
    data.email = email.trim();
  }

  const updatedUser = await prisma.users.update({
    where: { id },
    data,
  });
}

export async function deleteUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger || id <= 0) {
    const error = new Error("Invalid user ID");
    error.statusCode = 400;
    throw error;
  }

  await prisma.users.delete({
    where: { id },
  });
  res.status(204).send();
}
