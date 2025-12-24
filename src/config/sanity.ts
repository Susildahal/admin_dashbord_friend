import { createClient } from "@sanity/client";




const config = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "e6ou6t4t",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  ...(import.meta.env.VITE_SANITY_API_TOKEN && { token: import.meta.env.VITE_SANITY_API_TOKEN }),
};

// Log token status for debugging
if (!import.meta.env.VITE_SANITY_API_TOKEN) {
  console.error("⚠️ WARNING: VITE_SANITY_API_TOKEN is not set in .env file!");
} else {
  console.log("✅ Sanity API token loaded (length:", import.meta.env.VITE_SANITY_API_TOKEN.length, "chars)");
}

export const client = createClient(config);

export default client;