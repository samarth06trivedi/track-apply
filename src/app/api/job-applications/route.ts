import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { users, jobApplications } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST request for creating a new job application
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const { company, role, jobType, status, remarks, stipend, ctc, reason, stage } = await req.json();

  if (!company || !role || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const user = await users.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Add these fields into the insert call:
  const newJobApplication = await jobApplications.insert({
    userId: user._id,
    company,
    role,
    jobType: jobType || 'full-time',
    status,
    stage: stage || "",
    reason: reason || "",
    remarks: remarks || "",
    stipend: stipend || "",
    ctc: ctc || "",
    createdAt: new Date(),
  });  

  return NextResponse.json(newJobApplication);
}

// PATCH request to update a job application
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const { company, role, jobType, status, remarks, jobId, stipend, ctc, reason, stage } = await req.json();

  // Validate the request data
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  // Find user by email
  const user = await users.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Validate the Job ID
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(jobId);
  } catch {
    return NextResponse.json({ error: "Invalid Job ID format" }, { status: 400 });
  }

  // Build update object dynamically
  type UpdateFields = Partial<{
    company: string;
    role: string;
    jobType: string;
    status: string;
    remarks: string;
    stipend: string;
    ctc: string;
    reason: string;
    stage: string;
  }>;

  const updateFields: UpdateFields = {};
  if (company) updateFields.company = company;
  if (role) updateFields.role = role;
  if (jobType) updateFields.jobType = jobType;
  if (status) updateFields.status = status;
  if (remarks !== undefined) updateFields.remarks = remarks;
  if (stipend !== undefined) updateFields.stipend = stipend;
  if (ctc !== undefined) updateFields.ctc = ctc;
  if (reason !== undefined) updateFields.reason = reason;
  if (stage !== undefined) updateFields.stage = stage;


  // Update the job application in the database using Monk's `update`
  const updatedJobApplication = await jobApplications.update(
    { _id: objectId, userId: user._id }, // Filter criteria
    { $set: updateFields }
  );

  if (updatedJobApplication.nModified === 0) {
    return NextResponse.json({ error: "Job application not found or no changes made" }, { status: 404 });
  }

  return NextResponse.json({ message: "Job application updated successfully" });
}

// DELETE request to remove a job application
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(jobId);
  } catch {
    return NextResponse.json({ error: "Invalid Job ID format" }, { status: 400 });
  }

  const deletedJob = await jobApplications.remove({ _id: objectId });

  if (!deletedJob || deletedJob.deletedCount === 0) {
    return NextResponse.json({ error: "Job application not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Job application deleted successfully" });
}

// GET request to fetch all job applications for the authenticated user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const user = await users.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get all job applications for the user
  const jobApplicationsList = await jobApplications.find({ userId: user._id });

  return NextResponse.json(jobApplicationsList);
}
