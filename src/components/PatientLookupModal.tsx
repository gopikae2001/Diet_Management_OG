// import React, { useEffect, useState } from 'react';

// interface Patient {
//   id: string;
//   name: string;
//   contactNumber: string;
//   age: string;
// }

// interface PatientLookupModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSelect: (patient: Patient) => void;
// }

// const PAGE_SIZE = 10;

// const PatientLookupModal: React.FC<PatientLookupModalProps> = ({ isOpen, onClose, onSelect }) => {
//   const [search, setSearch] = useState('');
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!isOpen) return;
//     setPage(1);
//     setSearch('');
//     setPatients([]);
//     setTotalPages(1);
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen) return;
//     fetchPatients();
//     // eslint-disable-next-line
//   }, [search, page, isOpen]);

//   const fetchPatients = async () => {
//     setLoading(true);
//     try {
//       // Fetch from diet order table endpoint
//       const resp = await fetch(`/api/dietOrders?search=${encodeURIComponent(search)}&page=${page}&limit=${PAGE_SIZE}`);
//       const data = await resp.json();
//       setPatients(data.patients || []);
//       setTotalPages(data.totalPages || 1);
//     } catch (err) {
//       setPatients([]);
//       setTotalPages(1);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelect = (patient: Patient) => {
//     onSelect(patient);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <div className="modal-content" style={{ background: '#fff', borderRadius: 8, maxWidth: 600, width: '95%', padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.15)', position: 'relative' }}>
//         <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>&times;</button>
//         <h2 style={{ marginBottom: 16 }}>Search Patient</h2>
//         <input
//           type="text"
//           placeholder="Search by name, ID, or contact number"
//           value={search}
//           onChange={e => { setSearch(e.target.value); setPage(1); }}
//           style={{ width: '100%', padding: 8, marginBottom: 16, borderRadius: 4, border: '1px solid #ccc' }}
//         />
//         <div style={{ minHeight: 220 }}>
//           {loading ? (
//             <div style={{ textAlign: 'center', padding: 32 }}>Loading...</div>
//           ) : (
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ background: '#f5f5f5' }}>
//                   <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Patient ID</th>
//                   <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Name</th>
//                   <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Contact Number</th>
//                   <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Age</th>
//                   <th style={{ padding: 8, borderBottom: '1px solid #eee' }}></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {patients.length === 0 ? (
//                   <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24 }}>No patients found.</td></tr>
//                 ) : patients.map(patient => (
//                   <tr key={patient.id}>
//                     <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{patient.id}</td>
//                     <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{patient.name}</td>
//                     <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{patient.contactNumber}</td>
//                     <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{patient.age}</td>
//                     <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>
//                       <button onClick={() => handleSelect(patient)} style={{ padding: '4px 12px', borderRadius: 4, background: '#0d92ae', color: '#fff', border: 'none', cursor: 'pointer' }}>Select</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
//           <button
//             onClick={() => setPage(p => Math.max(1, p - 1))}
//             disabled={page === 1}
//             style={{ padding: '6px 16px', borderRadius: 4, border: '1px solid #ccc', background: page === 1 ? '#eee' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
//           >
//             Previous
//           </button>
//           <span>Page {page} of {totalPages}</span>
//           <button
//             onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//             disabled={page === totalPages}
//             style={{ padding: '6px 16px', borderRadius: 4, border: '1px solid #ccc', background: page === totalPages ? '#eee' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientLookupModal; 