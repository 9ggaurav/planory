import jwt from "jsonwebtoken";
export function generateAccessToken(userId, email) {
    return jwt.sign({
        id: userId,
        email: email,
    }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "1d",
    });
}
export function generateRefreshToken(userId, email) {
    return jwt.sign({
        id: userId,
        email: email,
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
}
//# sourceMappingURL=authTokens.js.map