import express from "express";
import {
  createUser,
  deleteUser,
  editUserInfo,
  getAllUsers,
  getUserById,
  getUserCount,
  replaceUserInfo,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/count", getUserCount);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.post("/", createUser);

router.put("/:id", replaceUserInfo);

router.patch("/:id", editUserInfo);

router.delete("/:id", deleteUser);

export default router;
