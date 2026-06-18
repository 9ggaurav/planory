import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import {prisma} from "../lib/prisma";
import { uploadOnCloudinary } from "../utils/cloudinary";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse";
import fs from "fs";

const registerUser: RequestHandler = asyncHandler( async (req, res) => {

    const {email, name, avatar, password} = req.body;

    if (
        [email, name, password].some((field) => 
            field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    const hashedPassword = await bcrypt.hash(password, 12);

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.file?.path as string

    if (!avatarLocalPath) {
        throw new ApiError(400, "need avatar file");
    }

    let avatarLink = await uploadOnCloudinary(avatarLocalPath)

    if (!avatarLink) {
        throw new ApiError(500, "Avatar upload failed on cloudinary");
    }

    await fs.unlink(avatarLocalPath, (err) => {
        if (err) throw new ApiError(500, err.message)
        console.log("file deleted from server")
    });

    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword,
            avatar: avatarLink?.url || "default-avatar-path"
        }
    })

    const createdUser = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    })

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user");
    }

    console.log(email, name, password, avatar, avatarLocalPath)
    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )
   
})

export {registerUser}