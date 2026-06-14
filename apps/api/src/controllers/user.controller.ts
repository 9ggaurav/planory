import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";

const registerUser: RequestHandler = asyncHandler( async (req, res) => {
    res.status(200).json({
        message: "okay"
    })
})

export {registerUser}