import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { Request, Response, NextFunction } from "express";
import { resolve } from "path";

// Configure the logger
const logger = winston.createLogger({
  level: "info", // Default log level
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamp
    winston.format.json(), // Log in JSON format
  ),
  transports: [
    // File transport with daily rotation
    new DailyRotateFile({
      dirname: resolve(__dirname, "..", "..", "logs"), // Directory where logs are stored
      filename: "application-%DATE%.log", // Log file name pattern
      datePattern: "YYYY-MM-DD", // Rotate daily
      maxFiles: "30d", // Keep logs for 30 days
      zippedArchive: true, // Compress old log files
    }),
    // Console transport for real-time debugging
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

// // Middleware to log HTTP requests
// export function requestLogger(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void {
//   logger.info({
//     message: "HTTP Request",
//     method: req.method,
//     url: req.url,
//     headers: req.headers,
//     body: req.body,
//   });
//   next();
// }

// Export the logger instance
export default logger;
