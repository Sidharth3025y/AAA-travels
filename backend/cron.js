import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.VITE_API_URL || "http://localhost:5000";

const healthUrl = `${API_URL}/api/health`;

// Simple interval-based ping (every 10 minutes = 600000 ms)
// More compatible than node-cron on Render free tier
let pingInterval = null;

export const startHealthCron = () => {
  console.log(`Starting health ping job, targeting ${healthUrl} every 10 minutes`);

  // Clear any existing interval
  if (pingInterval) {
    clearInterval(pingInterval);
  }

  // Ping immediately on startup
  // (in case the service starts at an odd time)
  pingNow().then(() => {
    // Set up recurring pings every 10 minutes (600000 ms)
    pingInterval = setInterval(() => {
      pingNow().catch(() => {
        // Silently suppress errors - don't let cron fail crash the server
      });
    }, 10 * 60 * 1000);

    console.log("Health ping job running - will ping every 10 minutes");
  });
};

export const pingNow = async () => {
  try {
    const response = await fetch(healthUrl, {
      method: "GET",
      // 5-second timeout
      timeout: 5000,
    });

    if (response.ok) {
      console.log(`[Health Ping] ${new Date().toISOString()} - OK`);
    } else {
      console.warn(
        `[Health Ping] ${new Date().toISOString()} - Status: ${response.status}`,
      );
    }
  } catch (error) {
    // Silently log - don't crash the server
    console.debug(`[Health Ping] ${new Date().toISOString()} - Failed:`, error);
  }
};

