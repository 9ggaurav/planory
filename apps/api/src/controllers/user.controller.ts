import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { uploadOnCloudinary } from "../utils/cloudinary";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse";
import fs from "fs";
import { generateAccessToken, generateRefreshToken } from "../utils/authTokens";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = generateAccessToken(
      user?.id as number,
      user?.email as string,
    );
    const refreshToken = generateRefreshToken(
      user?.id as number,
      user?.email as string,
    );

    // const decodedRefreshToken = await bcrypt.hash(refreshToken, 12);

    user &&
      (await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: refreshToken,
        },
      }));
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token",
    );
  }
};

const registerUser: RequestHandler = asyncHandler(async (req, res) => {
  const { email, name, avatar, password } = req.body;

  if ([email, name, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const hashedPassword = await bcrypt.hash(password, 12);

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.file?.path as string;

  if (!avatarLocalPath) {
    throw new ApiError(400, "need avatar file");
  }

  let avatarLink = await uploadOnCloudinary(avatarLocalPath);

  if (!avatarLink) {
    throw new ApiError(500, "Avatar upload failed on cloudinary");
  }

  await fs.unlink(avatarLocalPath, (err) => {
    if (err) throw new ApiError(500, err.message);
    console.log("file deleted from server");
  });

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      avatar: avatarLink?.url || "default-avatar-path",
    },
  });

  const createdUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
    },
  });

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  console.log(email, name, password, avatar, avatarLocalPath);

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully!"));
});

const getUsers: RequestHandler = asyncHandler(async (req, res) => {
  console.log("Fetching all users started");
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    return res.status(201).json(new ApiResponse(200, users, "get all users"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch users");
  }
});

const loginUser: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword!);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.id,
  );

  const loggedinUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully!",
      ),
    );
});

const logoutUser: RequestHandler = asyncHandler(async (req, res) => {
  await prisma.user.update({
    where: {
      id: req.user!.id,
    },
    data: {
      refreshToken: null,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

const refreshAccessToken: RequestHandler = asyncHandler(async (req, res) => {
  const incomingRefrehToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefrehToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      incomingRefrehToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as { id: number; email: string };
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.refreshToken !== incomingRefrehToken) {
    throw new ApiError(
      401,
      "Refresh token does not match possibly user logged out or token is invalid",
    );
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.id,
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully!",
      ),
    );
});

export { registerUser, getUsers, loginUser, logoutUser, refreshAccessToken };
