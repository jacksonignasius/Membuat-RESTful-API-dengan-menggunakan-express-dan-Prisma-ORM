import { prisma } from "../prisma7.config.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || age === undefined) {
      return res.status(400).json({ message: "Name, email, and age are required" });
    }

    const parsedAge = Number(age);
    if (Number.isNaN(parsedAge)) {
      return res.status(400).json({ message: "Age must be a valid number" });
    }

    const user = await prisma.user.create({
      data: { name, email, age: parsedAge },
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { name, email, age } = req.body;
    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;
    if (age !== undefined) {
      const parsedAge = Number(age);
      if (Number.isNaN(parsedAge)) {
        return res.status(400).json({ message: "Age must be a valid number" });
      }
      dataToUpdate.age = parsedAge;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(500).json({ message: error.message });
  }
};
