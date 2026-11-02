import { config } from "dotenv";
import contentful from "contentful-management";

// Local runs read .env.local. In GitHub Actions the values come from repository secrets.
config({ path: ".env.local", quiet: true });

const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
export const spaceId = process.env.CONTENTFUL_SPACE_ID;
export const environmentId = process.env.CONTENTFUL_ENVIRONMENT || "master";

if (!token || !spaceId) {
  console.error("Missing CONTENTFUL_MANAGEMENT_TOKEN or CONTENTFUL_SPACE_ID (see .env.local).");
  process.exit(1);
}

export const cma = contentful.createClient({ accessToken: token }, { type: "plain" });
export const scope = { spaceId, environmentId };
