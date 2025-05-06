'use client';
import React, { useState, useEffect } from 'react';

interface OfferFormProps {
  onClose: () => void;
  onSubmit: () => void;
  isEditMode?: boolean;
  jobData: {
    company: string;
    role: string;
    jobId: string;
    stipend?: string;
    ctc?: string;
    remarks?: string;
  };
}

export default function OfferForm({
  onClose,
  onSubmit,
  jobData,
  isEditMode = false,
}: OfferFormProps) {
  const [stipend, setStipend] = useState('');
  const [ctc, setCTC] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (jobData) {
      setStipend(jobData.stipend || '');
      setCTC(jobData.ctc || '');
      setRemarks(jobData.remarks || '');
    }
  }, [jobData]);

  const handleSubmit = async () => {
    const method = jobData.jobId ? 'PATCH' : 'POST';

    const payload = {
      jobId: jobData.jobId,
      status: 'Offer',
      stipend,
      ctc,
      remarks,
      company: jobData.company,
      role: jobData.role,
    };

    const res = await fetch('/api/job-applications', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      onSubmit(); // trigger parent refresh
      onClose(); // close modal
    } else {
      alert(`Failed to ${isEditMode ? 'update' : 'add'} offer`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? 'Edit Offer' : 'Add Offer'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            value={jobData.company}
            disabled
            className="w-full pl-3 pr-5 py-2 rounded border dark:bg-gray-800 bg-gray-100"
          />
          <input
            type="text"
            value={jobData.role}
            disabled
            className="w-full pl-3 pr-5 py-2 rounded border dark:bg-gray-800 bg-gray-100"
          />
          <input
            type="text"
            placeholder="Stipend (Optional)"
            value={stipend}
            onChange={(e) => setStipend(e.target.value)}
            className="w-full pl-3 pr-5 py-2 rounded border dark:bg-gray-800 text-green-600"
          />
          <input
            type="text"
            placeholder="CTC (Optional)"
            value={ctc}
            onChange={(e) => setCTC(e.target.value)}
            className="w-full pl-3 pr-5 py-2 rounded border dark:bg-gray-800 text-green-600"
          />
          <textarea
            placeholder="Remarks (Optional, max 100 characters)"
            maxLength={100}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full pl-3 pr-5 py-2 rounded border dark:bg-gray-800"
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
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
