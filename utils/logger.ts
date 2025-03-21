import winston from "winston";

const isVercel = process.env.VERCEL === "1";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "ashaikh-backend" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

if (!isVercel) {
  const fs = require("fs");
  try {
    if (!fs.existsSync("./logs")) {
      fs.mkdirSync("./logs", { recursive: true });
    }

    logger.add(
      new winston.transports.File({
        filename: "./logs/error.log",
        level: "error",
      })
    );

    logger.add(
      new winston.transports.File({
        filename: "./logs/combined.log",
      })
    );
  } catch (error) {
    console.error("Failed to setup file logging:", error);
  }
}

export default logger;
