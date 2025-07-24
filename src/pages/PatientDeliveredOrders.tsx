import { useState, useMemo, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import SectionHeading from '../components/SectionHeading';
import Avatar from '../components/Avatar';
import Table from '../components/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign, faSearch, faRedo } from '@fortawesome/free-solid-svg-icons';
import { canteenOrdersApi } from '../services/api';
import { useFood } from '../context/FoodContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ButtonWithGradient from '../components/button';
import FormInputType from '../components/Inputtype';
import FormInputs from '../components/Input';
import { addFoodIntakeApi } from '../services/api';
import { FaRedo } from 'react-icons/fa';
type FoodIntake = {
  id: string;
  patientId: string;
  day: string;
  date: string;
  category: string;
  fooditem: string;
  intake_amount: string;
  unit: string;
  status?: string;
};

// Add a local type for canteen orders
type CanteenOrder = {
  id: string;
  patientName: string;
  patientId: string;
  contactNumber: string;
  date: string;
  fooditem: string;
  intake_amount: string;
  unit: string;
  status: string;
  [key: string]: any;
};

const PatientDeliveredOrders = ({ sidebarCollapsed = false, toggleSidebar }: { sidebarCollapsed?: boolean; toggleSidebar?: () => void }) => {
  const [mealOrders, setMealOrders] = useState<CanteenOrder[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<CanteenOrder | null>(null);
  const [patientDeliveredOrders, setPatientDeliveredOrders] = useState<CanteenOrder[]>([]);
  const [patientPendingOrders, setPatientPendingOrders] = useState<CanteenOrder[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState<CanteenOrder[]>([]);
  const [patientSearchLoading, setPatientSearchLoading] = useState(false);
  const { foodItems } = useFood();
  const [foodIntakeList, setFoodIntakeList] = useState<FoodIntake[]>([]);

  // Load all canteen orders on mount
  useEffect(() => {
    canteenOrdersApi.getAll().then((orders: CanteenOrder[]) => setMealOrders(orders));
  }, []);

  // Load all food intake entries for the selected patient
  useEffect(() => {
    if (!selectedPatient) return;
    addFoodIntakeApi.getAll().then((all: FoodIntake[]) => {
      const filtered = all.filter(f => f.patientId === selectedPatient.patientId);
      setFoodIntakeList(filtered);
    });
  }, [selectedPatient]);

  // Only patients with at least one delivered order
  const deliveredOrders = mealOrders.filter((o: CanteenOrder) => o.status === 'delivered');
  const pendingPreparingOrders = mealOrders.filter((o: CanteenOrder) => o.status === 'pending' || o.status === 'preparing');

  const handlePatientSearch = () => {
    setPatientSearchLoading(true);
    // Search all canteen orders (not just delivered)
    const results = mealOrders.filter((o: CanteenOrder) => {
      const val = patientSearch.toLowerCase();
      return (
        (o.patientName && o.patientName.toLowerCase().includes(val)) ||
        (o.patientId && o.patientId.toLowerCase().includes(val)) ||
        (o.contactNumber && o.contactNumber.toLowerCase().includes(val))
      );
    });
    // Unique by patientId + contactNumber
    const unique = Array.from(
      new Map(results.map(o => [o.patientId + o.contactNumber, o])).values()
    );
    setPatientSearchResults(unique);
    setPatientSearchLoading(false);
  };

  const handleSelectPatient = (patient: CanteenOrder) => {
    setSelectedPatient(patient);
    // Get all delivered orders for this patient
    const delivered = mealOrders.filter(
      (o: CanteenOrder) => o.patientId === patient.patientId && o.contactNumber === patient.contactNumber && o.status === 'delivered'
    );
    setPatientDeliveredOrders(delivered);
    // Get all pending/preparing orders for this patient
    const pending = mealOrders.filter(
      (o: CanteenOrder) => o.patientId === patient.patientId && o.contactNumber === patient.contactNumber && (o.status === 'pending' || o.status === 'preparing')
    );
    setPatientPendingOrders(pending);
    // After selecting, clear search results and input
    setPatientSearchResults([]);
    setPatientSearch('');
  };

  const totalDeliveredAmount = useMemo(() => {
    if (!selectedPatient) return 0;
    return patientDeliveredOrders.reduce((sum, order) => {
      const food = foodItems.find(f => f.name === order.fooditem);
      return sum + (food ? parseFloat(food.price) || 0 : 0);
    }, 0);
  }, [patientDeliveredOrders, foodItems, selectedPatient]);

  // Find diet end date for selected patient (if available)
  const dietEndDate = useMemo(() => {
    if (!selectedPatient) return '';
    // Try to find the latest end_date among all orders for this patient
    const allOrders = mealOrders.filter(
      (o: CanteenOrder) => o.patientId === selectedPatient.patientId && o.contactNumber === selectedPatient.contactNumber
    );
    const dates = allOrders.map(o => o.end_date).filter(Boolean);
    if (dates.length === 0) return '';
    // Return the latest date
    return dates.sort().reverse()[0];
  }, [selectedPatient, mealOrders]);

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showCalculator showDate showTime />
      <PageContainer>
      <SectionHeading title="Patient Delivered Orders" subtitle="View all delivered canteen orders and total amount" />
        <div style={{  background: '#fff', borderRadius: 6, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 32,  marginLeft: 'auto', marginRight: 'auto', border:'1px solid #ddd' }}>
          
          
          {/* Inline patient search UI */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <FormInputs
              label="Search Patient"
              name="patientSearch"
              placeholder="Search by name, ID, or contact number"
              value={patientSearch}
              onChange={e => setPatientSearch(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handlePatientSearch(); }}
              style={{ minWidth: 290 }}
            />
            <div style={{ display: 'flex', marginTop: '20px', alignItems: 'center' }}>
              <ButtonWithGradient
                onClick={handlePatientSearch}
                disabled={patientSearchLoading || !patientSearch.trim()}
              >
                {patientSearchLoading ? 'Searching...' : 'Search'}
              </ButtonWithGradient>
              <span
                style={{ marginLeft: 8, cursor: 'pointer', color: '#0093b8', fontSize: 22, display: 'flex', alignItems: 'center' }}
                title="Refresh"
                onClick={() => {
                  setPatientSearch('');
                  setPatientSearchResults([]);
                  setSelectedPatient(null);
                  setPatientDeliveredOrders([]);
                  setPatientPendingOrders([]);
                  setFoodIntakeList([]);
                }}
              >
                 <FaRedo
                style={{ cursor: 'pointer', color: '#0093b8', fontSize: 18, marginLeft: 6 }}
                title="Reset filters"
                onClick={() => {
                  setPatientSearch('');
                  setPatientSearchResults([]);
                  setSelectedPatient(null);
                  setPatientDeliveredOrders([]);
                  setPatientPendingOrders([]);
                  setFoodIntakeList([]);
                }}
              />
              </span>
            </div>
          </div>


{/* <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
                        <div style={{ flex: 1, borderRadius: 4 }}>
                            <FormInputs 
                                label="Search Patient" 
                                name="patientSearch" 
                                value={patientSearch} 
                                onChange={e => setPatientSearch(e.target.value)}
                                placeholder="Enter food item name" 
                                style={patientSearchLoading ? { border: '1.5px solid red' } : {}}
                            />
                            {patientSearchLoading && (
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '4px', width:'20%' }}>
                                    {patientSearchLoading}
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1, borderRadius: 4 }}>
                            <ButtonWithGradient 
                                onClick={handlePatientSearch}
                                disabled={patientSearchLoading || !patientSearch.trim()}
                                style={{ marginLeft: 10, marginRight: 10, width:'100px' }}
                            >
                                Clear
                            </ButtonWithGradient>
                            
                            <ButtonWithGradient
                                onClick={handlePatientSearch}
                                disabled={patientSearchLoading || !patientSearch.trim()}
                                style={{ marginLeft: 10, marginRight: 10, width:'100px' }}
                            >
                                Search
                            </ButtonWithGradient>
                        </div>
                    </div> */}

          {/* Show patient search results as a list, but hide after selection */}
          {patientSearchResults.length > 0 && !selectedPatient && (
            <div style={{ marginBottom: 24 }}>
              {patientSearchResults.map((p, idx) => (
                <div key={p.patientId + p.contactNumber} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '10px 0', borderBottom: '1px solid #eee', cursor: 'pointer', marginBottom: 10, marginTop: 10 }} onClick={() => handleSelectPatient(p)}>
                  <Avatar name={p.patientName} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#0093b8', fontSize: 16 }}>{p.patientName}</div>
                    <div style={{ color: '#888', fontSize: 14 }}>ID: {p.patientId} | Contact: {p.contactNumber}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedPatient && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 24 }}>
              <Avatar name={selectedPatient.patientName} size={70} />
              <div style={{ fontSize: 18, fontWeight: 600, color: '#0093b8' }}>{selectedPatient.patientName}</div>
              <div style={{ color: '#888', fontSize: 15 }}>ID: {selectedPatient.patientId}</div>
              <div style={{ color: '#888', fontSize: 15 }}>Contact: {selectedPatient.contactNumber}</div>
              {dietEndDate && (
                <div style={{ color: '#888', fontSize: 15 }}>Diet End Date: {dietEndDate}</div>
              )}
              <div style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 700, color: '#0d92ae', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: '#222', marginRight: 6 }}>Amount to be paid:</span>
                <FontAwesomeIcon icon={faIndianRupeeSign} style={{ color: '#0d92ae', fontSize: 22 }} />
                {totalDeliveredAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          )}
          {selectedPatient && (
            <Table
              data={patientDeliveredOrders.map((order, idx) => ({
                serialNo: idx + 1,
                date: order.date || '',
                category: order.category || '',
                fooditem: order.fooditem || '',
                intake_amount: order.intake_amount || '',
                unit: order.unit || '',
                amount: (() => {
                  const food = foodItems.find(f => f.name === order.fooditem);
                  return food ? `₹${food.price}` : '-';
                })(),
                status: order.status,
                id: order.id,
              }))}
              columns={[
                { key: 'serialNo', header: 'S.No' },
                { key: 'date', header: 'Date' },
                { key: 'category', header: 'Category' },
                { key: 'fooditem', header: 'Food Item' },
                { key: 'intake_amount', header: 'Intake Amount' },
                { key: 'unit', header: 'Unit' },
                { key: 'amount', header: 'Amount' },
                { key: 'status', header: 'Status' },
              ]}
            />
          )}
          {/* Pending/Preparing Orders Table */}
          {selectedPatient && foodIntakeList.length > 0 && (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, color: '#0d92ae', marginTop: 32, marginBottom: 12 }}>Pending & Preparing Orders</div>
              <Table
                data={foodIntakeList
                  .filter(item => {
                    // Exclude delivered items
                    const delivered = mealOrders.find(o => o.patientId === item.patientId && o.date === item.date && o.fooditem === item.fooditem && o.status === 'delivered');
                    return !delivered;
                  })
                  .map((item, idx) => {
                    // Find canteen order for this item
                    const canteenOrder = mealOrders.find(o => o.patientId === item.patientId && o.date === item.date && o.fooditem === item.fooditem);
                    let status = 'Pending';
                    if (canteenOrder) {
                      if (canteenOrder.status === 'pending' || canteenOrder.status === 'preparing') status = canteenOrder.status;
                    }
                    return {
                      serialNo: idx + 1,
                      day: item.day || '',
                      date: item.date || '',
                      category: item.category || '',
                      fooditem: item.fooditem || '',
                      intake_amount: item.intake_amount || '',
                      unit: item.unit || '',
                      status,
                      id: item.id,
                    };
                  })}
                columns={[
                  { key: 'serialNo', header: 'S.No' },
                  { key: 'day', header: 'Day' },
                  { key: 'date', header: 'Date' },
                  { key: 'category', header: 'Category' },
                  { key: 'fooditem', header: 'Food Item' },
                  { key: 'intake_amount', header: 'Intake Amount' },
                  { key: 'unit', header: 'Unit' },
                  { key: 'status', header: 'Status' },
                ]}
              />
            </>
          )}
          {!selectedPatient && (
            <div style={{ color: '#888', textAlign: 'center', fontSize: 16, margin: 32 }}>Select a patient to view delivered orders.</div>
          )}
        </div>
      </PageContainer>
      <Footer />
    </>
  );
};

export default PatientDeliveredOrders; 