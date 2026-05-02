import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCpVIMWrQvfNs29jORNrELp7HtN5lFe5RM",
  authDomain: "frameapp-ce456.firebaseapp.com",
  databaseURL: "https://frameapp-ce456-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "frameapp-ce456",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const migrate = async () => {
  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      await set(ref(db, '/'), data);
      console.log("Migration to Firebase completed successfully.");
    } else {
      console.log("No local data.json found.");
    }
  } catch (error) {
    console.error("Error migrating:", error);
  }
  process.exit();
};

migrate();
