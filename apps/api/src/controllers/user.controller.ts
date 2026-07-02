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
  console.log("req.cookies", req.cookies);  
  try {
    const incomingRefrehToken =
      req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefrehToken) {
      throw new ApiError(401, "Unauthorized request");
    }
    console.log("1. incomingRefrehToken", incomingRefrehToken);

    let decodedToken;
    try {
      decodedToken = jwt.verify(
        incomingRefrehToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as { id: number; email: string };
    } catch (error) {
      throw new ApiError(401, "Invalid refresh token");
    }
    console.log("2. decodedToken", decodedToken);

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    console.log("3. user", user);

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
  } catch (error) {
    throw new ApiError(500, "Failed to refresh access token");
  }
});

const changeCurrentPassword: RequestHandler = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return new ApiError(400, "Password can't be empty");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.user!.id as number,
    },
  });

  if (!user?.hashedPassword) {
    throw new ApiError(400, "User does not have a password set");
  }

  const isPasswordValid = await bcrypt.compare(
    oldPassword,
    user.hashedPassword,
  );

  if (!isPasswordValid) {
    throw new ApiError(400, "Password does not match");
  }

  const isPasswordSame = await bcrypt.compare(newPassword, user.hashedPassword);

  if (isPasswordSame) {
    throw new ApiError(400, "New password can't be same as old password");
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: user.id as number,
    },
    data: {
      hashedPassword: newHashedPassword,
      refreshToken: null,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully!"));
});

const getCurrentUser: RequestHandler = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const updateAccountDetails: RequestHandler = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email) {
    throw new ApiError(
      400,
      "At least one field (name or email) must be provided for update",
    );
  }

  const user = await prisma.user.update({
    where: {
      id: req.user!.id as number,
    },
    data: {
      name: name || undefined,
      email: email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});

const updateUserAvatar: RequestHandler = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatarLink = await uploadOnCloudinary(avatarLocalPath);

  if (!avatarLink?.url) {
    throw new ApiError(500, "Avatar upload failed on cloudinary");
  }

  await fs.unlink(avatarLocalPath, (err) => {
    if (err) throw new ApiError(500, err.message);
    console.log("file deleted from server");
  });

  const user = await prisma.user.update({
    where: {
      id: req.user!.id as number,
    },
    data: {
      avatar: avatarLink.url,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

// board controllers

const getUserBoards: RequestHandler = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  if (Number.isNaN(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const boards = await prisma.board.findMany({
    where: {
      creatorId: userId,
      isPublic: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, boards, "User boards fetched successfully"));
})



export {
  registerUser,
  getUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getUserBoards,
};
