import { useState } from 'react';
import PageContainer from '../components/PageContainer';
import SectionHeading from '../components/SectionHeading';
import Avatar from '../components/Avatar';
import Table from '../components/Table';
import { dietOrdersApi, addFoodIntakeApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ButtonWithGradient from '../components/button';
import FormInputs from '../components/Input';
import { FaRedo } from 'react-icons/fa';

interface DietOrder {
  id: string;
  patientName: string;
  patientId: string;
  contactNumber: string;
  approvalStatus: string;
}

interface FoodIntake {
  id: string;
  patientId: string;
  day?: string;
  date?: string;
  category?: string;
  fooditem?: string;
  intake_amount?: string;
  comments?: string;
}

const PatientDietHistory = ({ sidebarCollapsed = false, toggleSidebar }: { sidebarCollapsed?: boolean; toggleSidebar?: () => void }) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  // No need for searchResults state
  const [selectedPatient, setSelectedPatient] = useState<DietOrder | null>(null);
  const [dietHistory, setDietHistory] = useState<Array<{ day: string; date: string; category: string; fooditem: string; intake_amount: string; details: string }>>([]);
  const [rejected, setRejected] = useState(false);

  // Search handler
  const handleSearch = async () => {
    setSearchLoading(true);
    setRejected(false);
    setSelectedPatient(null);
    setDietHistory([]);
    try {
      const [orders, foodIntake] = await Promise.all([
        dietOrdersApi.getAll(),
        addFoodIntakeApi.getAll()
      ]);
      // Find patient by ID or contact number
      const patient = orders.find(
        (o: DietOrder) => o.patientId === searchValue.trim() || o.contactNumber === searchValue.trim()
      );
      if (!patient) {
        setSelectedPatient(null);
        setDietHistory([]);
        setRejected(false);
        setSearchLoading(false);
        return;
      }
      handleSelectPatient(patient, foodIntake);
    } finally {
      setSearchLoading(false);
    }
  };

  // Select patient and show their diet history
  const handleSelectPatient = (patient: DietOrder, allFoodIntake: FoodIntake[]) => {
    setSelectedPatient(patient);
    setSearchValue(patient.patientId);
    if (patient.approvalStatus === 'rejected') {
      setRejected(true);
      setDietHistory([]);
      return;
    }
    setRejected(false);
    const history = (allFoodIntake || []).filter(f => f.patientId === patient.patientId).map(entry => ({
      day: entry.day || '',
      date: entry.date || '',
      category: entry.category || '',
      fooditem: entry.fooditem || '',
      intake_amount: entry.intake_amount || '',
      details: entry.comments || '-',
    }));
    setDietHistory(history);
  };

  // If user presses Enter in search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        <SectionHeading title="Patient Diet History" subtitle="View a patient's previous diet plan by Patient ID or Contact Number" />
        <div style={{ background: '#fff', borderRadius: 6, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 32, marginLeft: 'auto', marginRight: 'auto', border: '1px solid #ddd' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <FormInputs
              label="Search Patient"
              name="patientSearch"
              placeholder="Enter Patient ID or Contact Number"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ minWidth: 290 }}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ButtonWithGradient
                onClick={handleSearch}
                disabled={searchLoading || !searchValue.trim()}
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </ButtonWithGradient>
              <FaRedo
                style={{ cursor: 'pointer', color: '#0093b8', fontSize: 18, marginLeft: 6 }}
                title="Reset"
                onClick={() => {
                  setSearchValue('');
                  setSelectedPatient(null);
                  setDietHistory([]);
                  setRejected(false);
                }}
              />
            </div>
          </div>
          {/* No patient selection list needed */}
          {!searchLoading && searchValue && !selectedPatient && !rejected && dietHistory.length === 0 && (
            <div style={{ marginTop: 20, color: '#888' }}>No patient found.</div>
          )}
          {selectedPatient && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 24 }}>
              <Avatar name={selectedPatient.patientName} size={70} />
              <div style={{ fontSize: 18, fontWeight: 600, color: '#0093b8' }}>{selectedPatient.patientName}</div>
              <div style={{ color: '#888', fontSize: 15 }}>ID: {selectedPatient.patientId}</div>
              <div style={{ color: '#888', fontSize: 15 }}>Contact: {selectedPatient.contactNumber}</div>
              <div style={{ color: '#888', fontSize: 15 }}>Status: {selectedPatient.approvalStatus === 'approved' ? 'Approved' : selectedPatient.approvalStatus === 'rejected' ? 'Rejected' : selectedPatient.approvalStatus}</div>
            </div>
          )}
          {rejected && (
            <div style={{ marginTop: 20, color: 'red', fontWeight: 600 }}>
              Diet plan is rejected for this patient.
            </div>
          )}
          {selectedPatient && !rejected && dietHistory.length > 0 && (
            <Table
              columns={[
                { key: 'day', header: 'Day' },
                { key: 'date', header: 'Date' },
                { key: 'category', header: 'Category' },
                { key: 'fooditem', header: 'Food Item' },
                { key: 'intake_amount', header: 'Intake Amount' },
                { key: 'details', header: 'Details' },
              ]}
              data={dietHistory}
            />
          )}
          {selectedPatient && !rejected && dietHistory.length === 0 && (
            <div style={{ marginTop: 20, color: '#888' }}>No previous diet items found.</div>
          )}
        </div>
      </PageContainer>
      <Footer />
    </>
  );
};

export default PatientDietHistory; 