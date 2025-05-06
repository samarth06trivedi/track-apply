'use client';
import React, { useEffect, useState } from 'react';

interface NewJobApplicationFormProps {
  onClose: () => void;
  onSave?: (updated: {
    _id: string;
    company: string;
    role: string;
    jobType: string;
    status: string;
    remarks?: string;
  }) => void;
  
  jobData?: {
    _id: string;
    company: string;
    role: string;
    jobType: string;
    status: string;
    remarks?: string;
  };
}

export default function NewJobApplicationForm({ onClose, jobData }: NewJobApplicationFormProps) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobType, setJobType] = useState('Full Time');
  const [status, setStatus] = useState('Application');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (jobData) {
      setCompany(jobData.company);
      setRole(jobData.role);
      setJobType(jobData.jobType);
      setStatus(jobData.status);
      setRemarks(jobData.remarks || '');
    }
  }, [jobData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = jobData ? 'PATCH' : 'POST';
    const endpoint = '/api/job-applications';

    const payload = {
      company,
      role,
      jobType,
      status,
      remarks,
      ...(jobData ? { jobId: jobData._id } : {}),
    };

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      window.location.reload(); // auto refresh on success
    } else {
      const error = await response.json();
      alert('Failed to submit application: ' + (error?.error || 'Unknown error'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {jobData ? 'Edit Job Application' : 'Add Job Application'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            disabled={!!jobData}
            className="w-full pl-3 pr-5 py-2 rounded border dark:bg-gray-800"
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full pl-3 pr-5 py-2 rounded border dark:bg-gray-800"
          />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            required
            className="w-full pl-3 pr-5 py-2 rounded border dark:bg-gray-800"
          >
            <option>Full Time</option>
            <option>Internship</option>
            <option>Part Time</option>
            <option>Remote</option>
            <option>Internship + PPO</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className={`w-full pl-3 pr-5 py-2 rounded border dark:bg-gray-800 ${
              status === 'Interview' ? 'text-purple-500' : ''
            }`}
          >
            <option>Application</option>
            <option>Test</option>
            <option>Assignment</option>
            <option>Interview</option>
          </select>
          <textarea
            placeholder="Remarks (max 100 characters)"
            maxLength={100}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full pl-3 pr-5 py-2 rounded border dark:bg-gray-800"
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-red-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
