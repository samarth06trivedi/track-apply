'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import NewJobApplicationForm from '@/components/new-job-application-form';
import OfferForm from '@/components/offer-form';
import RejectionForm from '@/components/rejection-form';


// Define the JobApplication type
type JobApplication = {
  _id: string;
  company: string;
  role: string;
  jobType: string;
  status: string;
  remarks?: string;
  stipend?: string; 
  ctc?: string;
  stage?:string;
  reason?:string;
};

export default function DashboardPage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState('inProgress');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editJobData, setEditJobData] = useState<JobApplication | undefined>(undefined);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerJobData, setOfferJobData] = useState<JobApplication | undefined>(undefined);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionJobData, setRejectionJobData] = useState<JobApplication | undefined>(undefined);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    job?: JobApplication;
  }>({ visible: false, x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchJobApplications = async () => {
        const res = await fetch('/api/job-applications');
        const data = await res.json();
        setJobApplications(data);
      };
      fetchJobApplications();
    }
  }, [session]);

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0 });
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [contextMenu]);

  const handleDelete = async (jobId: string) => {
    const res = await fetch(`/api/job-applications?jobId=${jobId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setJobApplications(jobApplications.filter((job) => job._id !== jobId));
    } else {
      alert('Failed to delete job application');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Application':
        return 'text-blue-600';
      case 'Test':
        return 'text-yellow-600';
      case 'Assignment':
        return 'text-orange-600';
      case 'Interview':
        return 'text-purple-600';
      case 'Offer':
        return 'text-green-600';
      case 'Rejection':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const renderSection = () => {
    const filtered = jobApplications.filter((job) => {
      if (activeSection === 'inProgress') return ['Application', 'Test', 'Assignment', 'Interview'].includes(job.status);
      if (activeSection === 'offers') return job.status === 'Offer';
      if (activeSection === 'rejections') return job.status === 'Rejected';
      return false;
    });
  
    if (filtered.length === 0) {
      return <div className="mt-8 text-gray-600 dark:text-gray-300">No job applications in {activeSection} status</div>;
    }
  
    return (
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full text-left text-sm border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            <th className="px-4 py-2 border">Sl. No.</th>
            <th className="px-4 py-2 border">Company Name</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Job Type</th>
            {activeSection === 'offers' ? (
              <>
                <th className="px-4 py-2 border">Stipend</th>
                <th className="px-4 py-2 border">CTC</th>
              </>
            ) : activeSection === 'rejections' ? (
              <>
                <th className="px-4 py-2 border">Stage</th>
                <th className="px-4 py-2 border">Reason</th>
              </>
            ) : (
              <th className="px-4 py-2 border">Status</th>
            )}
            <th className="px-4 py-2 border">Remarks</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 dark:text-gray-200">
          {filtered.map((job, index) => (
            <tr
              key={job._id}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setContextMenu({ visible: true, x: e.clientX, y: e.clientY, job });
              }}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{job.company}</td>
              <td className="px-4 py-2 border">{job.role}</td>
              <td className="px-4 py-2 border">{job.jobType}</td>

              {activeSection === 'offers' ? (
                <>
                  <td className="px-4 py-2 border text-green-600">{job.stipend || '-'}</td>
                  <td className="px-4 py-2 border text-green-600">{job.ctc || '-'}</td>
                </>
              ) : activeSection === 'rejections' ? (
                <>
                  <td className="px-4 py-2 border">{job.stage || '-'}</td>
                  <td className="px-4 py-2 border">{job.reason || '-'}</td>
                </>
              ) : (
                <td className={`px-4 py-2 border font-semibold ${getStatusColor(job.status)}`}>{job.status}</td>
              )}

              <td className="px-4 py-2 border">{job.remarks || '-'}</td>
            </tr>
          ))}
        </tbody>

        </table>
  
        {contextMenu.visible && contextMenu.job && (
          <div
            className="fixed z-[9999] bg-white dark:bg-gray-800 border rounded shadow-lg"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
          {activeSection !== "rejections" && (  
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (contextMenu.job) {
                  // Check if in "offers" section
                  if (activeSection === 'offers') {
                    // Prefill the form with current values
                    setOfferJobData({
                      ...contextMenu.job, // Spread the existing job data
                      stipend: contextMenu.job.stipend || '',
                      ctc: contextMenu.job.ctc || '',
                      remarks: contextMenu.job.remarks || '',
                    });
                    setShowOfferForm(true); // Show the OfferForm
                  } else {
                    setEditJobData(contextMenu.job); // Edit job application form for other sections
                    setShowAddForm(true); // Show the ApplicationForm
                  }
                }
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            >
              Edit
            </button>
          )}


            <button
              onClick={(e) => {
                e.stopPropagation();
                if (contextMenu.job) handleDelete(contextMenu.job._id);
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            >
              Delete
            </button>
            {activeSection == "inProgress" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (contextMenu.job) {
                    setOfferJobData(contextMenu.job);
                    setShowOfferForm(true);
                  }
                  setContextMenu({ ...contextMenu, visible: false });
                }}
                className="block px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                Move to Offers
              </button>
            )}

            {activeSection == "inProgress" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (contextMenu.job) {
                    setRejectionJobData(contextMenu.job);
                    setShowRejectionForm(true);
                  }
                  setContextMenu({ ...contextMenu, visible: false });
                }}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                Move to Rejections
              </button>
            )}

          </div>
        )}
      </div>
    );
  };
  

  if (status === 'loading') return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen p-6 pb-10 pr-10">
      <div className="flex justify-between items-center">
        <div className="flex gap-8 text-lg font-semibold">
          <button
            onClick={() => setActiveSection('inProgress')}
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
              activeSection === 'inProgress' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveSection('offers')}
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
              activeSection === 'offers' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Offers
          </button>
          <button
            onClick={() => setActiveSection('rejections')}
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
              activeSection === 'rejections' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Rejections
          </button>
        </div>

        <div className="flex items-center gap-4 pr-4 relative" ref={dropdownRef}>
          <ThemeToggle />
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <User className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-36 bg-white dark:bg-gray-800 rounded shadow-lg z-50">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <hr className="mt-4 border-gray-300 dark:border-gray-600" />

      {activeSection === 'inProgress' && (
        <div className="mt-6 mb-4 flex justify-end">
          <button
            onClick={() => {
              setEditJobData(undefined);
              setShowAddForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Job Application
          </button>
        </div>
      )}

      {showAddForm && (
        <NewJobApplicationForm
        onClose={() => {
          setShowAddForm(false);
          setEditJobData(undefined);
        }}
        jobData={editJobData}
        onSave={(updated) => {
          if (updated) {
            // refresh job applications
            fetch('/api/job-applications')
              .then((res) => res.json())
              .then((data) => setJobApplications(data));
          }
        }}
      />      
      )}
      {showOfferForm && offerJobData && (
        <OfferForm
          isEditMode={!!offerJobData.stipend || !!offerJobData.ctc} // Only true if editing
          jobData={{
            company: offerJobData.company,
            role: offerJobData.role,
            jobId: offerJobData._id, // still pass this for edit
            stipend: offerJobData.stipend,
            ctc: offerJobData.ctc,
            remarks: offerJobData.remarks,
          }}
          onClose={() => {
            setShowOfferForm(false);
            setOfferJobData(undefined);
          }}
          onSubmit={async () => {
            const res = await fetch('/api/job-applications');
            const data = await res.json();
            setJobApplications(data);
          }}
        />
      )}

      {showRejectionForm && rejectionJobData && (
        <RejectionForm
          jobData={{
            company: rejectionJobData.company,
            role: rejectionJobData.role,
            jobId: rejectionJobData._id,
            status: '', // optionally prefill if you want
            reason: '',
          }}
          onClose={() => {
            setShowRejectionForm(false);
            setRejectionJobData(undefined);
          }}
          onSubmit={async () => {
            const res = await fetch('/api/job-applications');
            const data = await res.json();
            setJobApplications(data);
          }}
        />
      )}

      {renderSection()}
    </div>
  );
}
