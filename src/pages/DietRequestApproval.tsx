import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import ButtonWithGradient from '../components/button';
import PageContainer from '../components/PageContainer';
import SectionHeading from '../components/SectionHeading';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Searchbar from '../components/Searchbar';
import DeleteButton from '../components/DeleteButton';
import ApproveButton from '../components/AcceptButton';
import RejectButton from '../components/RejectButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { dietRequestsApi, dietRequestApprovalApi } from '../services/api';
import type { DietRequest } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/DietRequestApproval.css'
import FormDateInput from '../components/Date';
import FormInputType from '../components/Inputtype';

interface DietRequestApprovalProps {
    sidebarCollapsed?: boolean;
    toggleSidebar?: () => void;
}

// PatientTypeToggle component
const PatientTypeToggle = ({ value, onChange }: { value: 'all' | 'ip' | 'op', onChange: (v: 'all' | 'ip' | 'op') => void }) => {
  // Knob position and color
  let knobLeft = 0, bg = '#eee';
  if (value === 'ip') { knobLeft = 24; bg = '#27ae60'; }
  else if (value === 'op') { knobLeft = 0; bg = '#e74c3c'; }
  else { knobLeft = 14; bg = '#eee'; }

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 16 }}>
      {/* <span style={{ marginRight: 6, fontWeight: 500, color: '#444' }}>OP</span> */}
      {/* <div style={{ */}
        {/* width: 48, height: 24, borderRadius: 16, background: bg, */}
        {/* position: 'relative', transition: 'background 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' */}
      {/* }}> */}
       
        {/* <span
          style={{
            position: 'absolute', left: 2, top: 4, color: '#e74c3c', fontSize: 14, zIndex: 3, width: 20, height: 20, textAlign: 'center', cursor: 'pointer'
          }}
          onClick={e => { e.stopPropagation(); onChange('op'); }}
        >✗</span> */}
       
        {/* <span
          style={{
            position: 'absolute', right: 2, top: 4, color: '#27ae60', fontSize: 14, zIndex: 3, width: 20, height: 20, textAlign: 'center', cursor: 'pointer'
          }}
          onClick={e => { e.stopPropagation(); onChange('ip'); }}
        >✓</span> */}
       
        {/* <span
          style={{
            position: 'absolute',
            left: knobLeft,
            top: 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            transition: 'left 0.2s',
            zIndex: 2,
            cursor: 'pointer'
          }}
          onClick={e => { e.stopPropagation(); onChange('all'); }}
        /> */}
      {/* </div> */}
      {/* <span style={{ marginLeft: 6, fontWeight: 500, color: '#444' }}>IP</span> */}
    </div>
  );
};

const DietRequestApproval: React.FC<DietRequestApprovalProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState<DietRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patientTypeFilter, setPatientTypeFilter] = useState<'all' | 'ip' | 'op'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');

  // Load diet requests from API
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        const data = await dietRequestsApi.getAll();
        setRequests(data);
      } catch (error) {
        console.error('Failed to load diet requests:', error);
        toast.error('Failed to load diet requests');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleApprove = async (id: string) => {
    try {
      await dietRequestsApi.update(id, { status: 'Diet Order Placed' });
      // Store approval in db.json
      const approvedRequest = requests.find(r => r.id === id);
      if (approvedRequest) {
        await dietRequestApprovalApi.create({
          ...approvedRequest,
          approvalAction: 'approved',
          approvalTimestamp: new Date().toISOString(),
          approvalStatus: 'Diet Order Placed',
        });
      }
      const updatedRequests = await dietRequestsApi.getAll();
      setRequests(updatedRequests);
      toast.success('Diet request approved successfully!');
    } catch (error) {
      console.error('Failed to approve diet request:', error);
      toast.error('Failed to approve diet request');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await dietRequestsApi.update(id, { status: 'Rejected' });
      // Store rejection in db.json
      const rejectedRequest = requests.find(r => r.id === id);
      if (rejectedRequest) {
        await dietRequestApprovalApi.create({
          ...rejectedRequest,
          approvalAction: 'rejected',
          approvalTimestamp: new Date().toISOString(),
          approvalStatus: 'Rejected',
        });
      }
      const updatedRequests = await dietRequestsApi.getAll();
      setRequests(updatedRequests);
      toast.error('Diet request rejected successfully!');
    } catch (error) {
      console.error('Failed to reject diet request:', error);
      toast.error('Failed to reject diet request');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await dietRequestsApi.delete(id);
        const updatedRequests = await dietRequestsApi.getAll();
        setRequests(updatedRequests);
        toast.error('Diet request deleted successfully!');
      } catch (error) {
        console.error('Failed to delete diet request:', error);
        toast.error('Failed to delete diet request');
      }
    }
  };

  const columns = [
    { key: 'serial', header: 'S.No'},
    { key: 'patientId', header: 'Patient ID' },
    { key: 'patientName', header: 'Patient Name' },
    { key: 'gender', header: 'Gender' },
    { key: 'age', header: 'Age' },
    { key: 'contactNumber', header: 'Contact Number' },
    { key: 'patientType', header: 'Patient Type' },
    { key: 'bed', header: 'Bed' },
    { key: 'ward', header: 'Ward' },
    { key: 'floor', header: 'Floor' },
    { key: 'doctor', header: 'Doctor' },
    { key: 'doctorNotes', header: 'Doctor Notes' },
    {
      key: 'requestedDate',
      header: 'Requested Date',
      render: (_: any, row: any) => {
        // If row.date is ISO string, extract date part
        if (row.date) {
          const datePart = row.date.split('T')[0] || row.date.split(' ')[0] || row.date;
          return datePart;
        }
        return '-';
      }
    },
    {
      key: 'requestedTime',
      header: 'Requested Time',
      render: (_: any, row: any) => {
        // If row.date is ISO string, extract time part
        if (row.date) {
          if (row.date.includes('T')) {
            return row.date.split('T')[1]?.split('.')[0] || '-';
          } else if (row.date.includes(' ')) {
            return row.date.split(' ')[1]?.split('.')[0] || '-';
          }
        }
        return '-';
      }
    },
    { key: 'status', header: 'Status',    
      render: (_: any, row: any) => (
      <span className={`status-badge status-${row.status.toLowerCase().replace(/\s+/g, '-')}`}> 
        {row.status}
      </span>
    ) },
    {
      key: 'approval',
      header: 'Approval',
      render: (_: any, row: any) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {row.status === 'Pending' && (
            <ApproveButton
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleApprove(row.id); }}
              size={13}
            />
          )}
          {row.status === 'Pending' && (
            <RejectButton
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleReject(row.id); }}
              size={13}
            />
          )}
          {row.status === 'Diet Order Placed' && <span style={{ color: '#219653', fontWeight: 600, fontSize: 12 }}>Approved</span>}
          {row.status === 'Rejected' && <span style={{ color: '#b71c1c', fontWeight: 600, fontSize: 12 }}>Rejected</span>}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', justifyContent: 'flex-end', minWidth: 60 }}>
          {row.status === 'Diet Order Placed' && (
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                navigate('/dietorderform', {
                  state: {
                    patientId: row.patientId,
                    patientName: row.patientName,
                    age: row.age,
                    gender: row.gender,
                    contactNumber: row.contactNumber,
                    address: row.address,
                    bloodGroup: row.bloodGroup,
                    tokenNo: row.tokenNo,
                    visitId: row.visitId,
                    email: row.email,
                    bed: row.bed,
                    ward: row.ward,
                    floor: row.floor,
                    doctor: row.doctor,
                    doctorNotes: row.doctorNotes,
                    patientType: row.patientType,
                    date: row.date
                  }
                  
                });
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              title="View Diet Order"
            >
              <FontAwesomeIcon icon={faEye} style={{ color: '#2196f3', fontSize: 18 }} />
            </button>
          )}
          <DeleteButton 
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(row.id); }}
            size={16}
          />
        </div>
      )
    }
  ];
  // console.log(columns);

  // Filtering logic
  const filteredData = requests.filter(item => {
    // Patient type filter
    const patientTypeMatch =
      patientTypeFilter === 'all' ||
      (patientTypeFilter === 'ip' && item.patientType === 'IP') ||
      (patientTypeFilter === 'op' && item.patientType === 'OP');
    // Search filter
    const searchMatch = Object.values(item).some(
      val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Date filter
    let dateMatch = true;
    if (fromDate) {
      dateMatch = false;
      if (item.date) {
        const itemDate = item.date.split('T')[0] || item.date.split(' ')[0] || item.date;
        if (itemDate >= fromDate) dateMatch = true;
      }
    }
    if (toDate) {
      if (item.date) {
        const itemDate = item.date.split('T')[0] || item.date.split(' ')[0] || item.date;
        if (itemDate > toDate) dateMatch = false;
      }
    }
    // Approval status filter
    let approvalMatch = true;
    if (approvalStatus) {
      approvalMatch = item.status === approvalStatus;
    }
    // Combine all filters
    return patientTypeMatch && searchMatch && dateMatch && approvalMatch;
  });

  return (
    <>
    <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator/>
    <PageContainer>
      <SectionHeading 
        title="Diet Request Approval" 
        subtitle="View and manage all diet requests" 
      />
      {/* Filter controls - improved UI, all in one row with searchbar */}
      <div style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-end',
        marginBottom: '20px',
        background: '#f8fafc',
        padding: '18px 20px',
        borderRadius: '10px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '16px', flex: 1, minWidth: 0 }}>
          <FormDateInput
            label="From Date"
            name="fromDate"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
          <FormDateInput
            label="To Date"
            name="toDate"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
          <div style={{ minWidth: '220px', width: '20%' }}>
          <FormInputType
            label="Approval Status"
            name="approvalStatus"
            value={approvalStatus}
            onChange={e => setApprovalStatus(e.target.value)}
            options={[
              { value: '', label: 'All' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Diet Order Placed', label: 'Diet Order Placed' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
          />
          </div>
        </div>
        <div style={{ minWidth: 220, flex: '0 0 250px' }}>
          <Searchbar 
            value={searchTerm} 
            onChange={handleSearchChange} 
            placeholder="Search diet requests..."
          />
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'flex-start',alignItems:"center" ,marginBottom: '20px' }}>
        <PatientTypeToggle value={patientTypeFilter} onChange={setPatientTypeFilter} />
      </div>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading diet requests...
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <Table 
            columns={columns} 
            data={filteredData.map((item, index) => ({ ...item, serial: index + 1 }))} 
          />
        </div>
      )}
    </PageContainer>
    <Footer/>
    </>
  );
};

export default DietRequestApproval;
