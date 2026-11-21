import argon2 from "argon2";
import prisma from "../lib/prisma.js";

export async function register(req, res) {
  try {
    const { email, password } = req.body ?? {};

    // 1. Validate the input
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Check whether the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    // 3. Hash the password
    const passwordHash = await argon2.hash(password);

    // 4. Create the user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    // 5. Send the response
    return res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body ?? {};

    // 1. Validate input
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find the user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Verify password
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Regenerate session to prevent session fixation
    req.session.regenerate((error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          message: "Could not create session",
        });
      }
    });

    // 5. Store the user's ID in the session
    req.session.userId = user.id;

    // 6. Save the session before responding
    req.session.save((error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          message: "Could not save session",
        });
      }
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
