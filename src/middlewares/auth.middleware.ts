import type { RequestHandler } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

const AUTH_URL =
  process.env.BETTER_AUTH_URL || "http://localhost:5000";

const JWKS = createRemoteJWKSet(
  new URL(`${AUTH_URL}/api/auth/jwks`)
);

export const authMiddleware: RequestHandler = async (
  req,
  res,
  next
) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication required. Please provide a Bearer token.",
    });
    return;
  }

  const token = authorization.slice(7);

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: AUTH_URL,
      audience: AUTH_URL,
    });

    res.locals.auth = payload;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};
