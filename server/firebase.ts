import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Read Firebase config from the generated file
const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
let firebaseConfig = {};

try {
  const configData = fs.readFileSync(configPath, "utf-8");
  firebaseConfig = JSON.parse(configData);
} catch (error) {
  console.error("Could not load firebase-applet-config.json:", error);
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
