import { execSync } from "child_process";
const IMAGE_NAME = "ghcr.io/stefdec/mybigbrain-next:latest";
const API_URL = "http://93.127.162.74:8000/deploy";
const API_KEY = "bdc9668c-eb22-4f7a-b4da-cafe67e8c7ae-457rusnf45769";
const LOCAL_PORT = 3000;
const CONTAINER_PORT = 3000;

async function main() {
  try {
    console.log("🚀 Building Docker image...");
    execSync(`docker build . --platform linux/amd64 -t ${IMAGE_NAME}`, { stdio: "inherit" });

    console.log("📤 Pushing Docker image...");
    execSync(`docker push ${IMAGE_NAME}`, { stdio: "inherit" });

    console.log("🌍 Deploying via API...");
    const response = await fetch(`${API_URL}?imageName=${IMAGE_NAME}&localPort=${LOCAL_PORT}&containerPort=${CONTAINER_PORT}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
      },
    });

    const data = await response.json();
    console.log("✅ Deployment Response:", data);
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

main();