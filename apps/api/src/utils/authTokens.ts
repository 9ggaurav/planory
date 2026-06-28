import jwt from "jsonwebtoken";

export function generateAccessToken(userId: number, email: string) {
  return jwt.sign(
    {
      id: userId,
      email: email,
    },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "10s",
    },
  );
}

export function generateRefreshToken(userId: number, email: string) {
  return jwt.sign(
    {
      id: userId,
      email: email,
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    },
  );
}
