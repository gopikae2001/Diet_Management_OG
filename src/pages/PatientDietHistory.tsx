import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import SectionHeading from '../components/SectionHeading';
import FormInputs from '../components/Input';
import Table from '../components/Table';
import '../styles/DietOrder.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ButtonWithGradient from '../components/button';
import { dietOrdersApi, dietPackagesApi, addFoodIntakeApi } from '../services/api';
import type { DietOrder } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PatientDietHistoryProps {
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
}


const PatientDietHistory: React.FC<PatientDietHistoryProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  const [contactNumber, setContactNumber] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [allOrders, setAllOrders] = useState<DietOrder[]>([]);
  const [allFoodIntake, setAllFoodIntake] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [packageDetails, setPackageDetails] = useState<Record<string, any>>({});

  // Load all diet orders and food intake from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [orders, foodIntake] = await Promise.all([
          dietOrdersApi.getAll(),
          addFoodIntakeApi.getAll()
        ]);
        setAllOrders(orders);
        setAllFoodIntake(foodIntake);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load diet history');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setContactNumber(value);
    if (value.length >= 6) { // search after 6+ digits
      // Find all patient orders with this contact number
      const patientOrders = allOrders.filter(order => order.contactNumber === value);
      // Map patientId to patient info
      const patientMap: Record<string, DietOrder> = {};
      patientOrders.forEach(order => {
        patientMap[order.patientId] = order;
      });
      // Find all food intake entries for these patients
      const filtered = allFoodIntake.filter(entry => {
        return patientMap[entry.patientId];
      }).map(entry => {
        const patient = patientMap[entry.patientId] || {};
        return {
          id: entry.id,
          day: entry.day || '',
          date: entry.date || '',
          patientName: patient.patientName || '',
          contactNumber: patient.contactNumber || '',
          age: patient.age || '',
          fooditem: entry.fooditem || '',
          time: entry.time || '',
          intake_amount: entry.intake_amount || '',
          end_date: entry.end_date || '',
          calories: entry.calories || '',
          comments: entry.comments || '',
        };
      });
      setResults(filtered);
      setSearched(true);
    } else {
      setResults(null);
      setSearched(false);
    }
  };

  // No need to fetch package details for food intake history

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        <SectionHeading title="Patient Diet History" subtitle="Search for a patient's previous diet items by contact number" />
        <div className="form-section3">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              Loading diet history...
            </div>
          ) : (
            <>
              <div className="form-row" style={{ maxWidth:'30%', display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <FormInputs
                    label="Enter Contact Number"
                    name="contactNumber"
                    value={contactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter patient's contact number"
                  />
                </div>
              </div>
            </>
          )}
          {/* Show OP and IP patient diet history with requested columns */}
          {!isLoading && searched && (
            results && results.length > 0 ? (
              <Table
                columns={[
                  { key: 'day', header: 'Day' },
                  { key: 'date', header: 'Date' },
                  { key: 'patientName', header: 'Patient Name' },
                  { key: 'contactNumber', header: 'Contact Number' },
                  { key: 'age', header: 'Age' },
                  { key: 'fooditem', header: 'Food Item' },
                  { key: 'time', header: 'Time' },
                  { key: 'intake_amount', header: 'Intake Amount' },
                  { key: 'end_date', header: 'End Date' },
                  { key: 'calories', header: 'Calories' },
                  { key: 'comments', header: 'Comments' },
                ]}
                data={results}
              />
            ) : (
              <div style={{ marginTop: 20, color: '#888' }}>No previous diet items found.</div>
            )
          )}
        </div>
      </PageContainer>
      <Footer />
    </>
  );
};

export default PatientDietHistory; 