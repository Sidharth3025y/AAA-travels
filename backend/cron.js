import "node-cron";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.VITE_API_URL || "http://localhost:5000";

const healthUrl = `${API_URL}/api/health`;

// Run every 10 minutes
// Format: minute hour day month day-of-week
// 10 * means "at minute 10 of every hour" = every hour at :10
// For every 10 minutes: */10 * * * *
// Actually, let's do every 10 minutes starting at minute 0
// */10 * * * * = every 10 minutes (at 0, 10, 20, 30, 40, 50 minutes)

export const startHealthCron = () => {
  console.log(`Starting health cron job, pinging ${healthUrl} every 10 minutes`);

  // Every 10 minutes
  node-cron.schedule("*/10 * * * *", async () => {
    try {
      const response = await fetch(healthUrl, {
        method: "GET",
        // 5-second timeout
        timeout: 5000,
      });

      if (response.ok) {
        console.log(`[Health Cron] Ping at ${new Date().toISOString()} - OK`);
      } else {
        console.warn(
          `[Health Cron] Ping at ${new Date().toISOString()} - Status: ${response.status}`,
        );
      }
    } catch (error) {
      // Silently log - we don't want cron errors to crash the process
      console.debug(
        `[Health Cron] Ping failed at ${new Date().toISOString()}:`,
        error,
      );
    }
  });

  // Also run immediately on startup
  // (in case the service starts at an odd time)
  // We'll just log; the regular interval will handle it
  console.log("Health cron job scheduled - will ping every 10 minutes");
};

