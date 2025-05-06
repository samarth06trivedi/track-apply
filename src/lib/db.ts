// lib/db.ts

import monk from "monk";

const db = monk(process.env.MONGO_URI!);
const users = db.get("users");
const jobApplications = db.get("job_applications");


export { users, jobApplications };
