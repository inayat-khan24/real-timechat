import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized, JWT token is required" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token only

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized, JWT token wrong or expired" });
  }
};
