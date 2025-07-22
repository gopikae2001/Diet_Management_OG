import React, { useState, useEffect } from "react";
// import "./DietOrderForm.css";
import '../styles/DietOrder.css'
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import SectionHeading from "../components/SectionHeading";
import FormInputs from "../components/Input";
import ButtonWithGradient from "../components/button";
import AddressInput from "../components/Addressinput";
import Searchbar from "../components/Searchbar";
import FormInputType from "../components/Inputtype";
import FormDateInput from "../components/Date";
import Input from '../components/Input';
import Inputtype from '../components/Inputtype';
import { useNavigate } from 'react-router-dom';
import { Form, useLocation } from 'react-router-dom';
import { Modal } from "antd";
import { dietOrdersApi, dietPackagesApi } from '../services/api';
import type { DietOrder, DietPackage } from '../services/api';
import { FaWhatsapp, FaRedo } from 'react-icons/fa';
import type { FoodIntake } from '../services/api';
import { FaRegClock, FaTrashAlt, FaEdit } from 'react-icons/fa';
import Table from '../components/Table';
import { addFoodIntakeApi } from '../services/api';
import DeleteButton from '../components/DeleteButton';
import EditButton from '../components/EditButton';
import FoodIntakeEditModal from '../components/FoodIntakeEditModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { canteenOrdersApi } from '../services/api';
import type { CanteenOrder } from '../services/api';
import Avatar from '../components/Avatar';
import { foodItemsApi } from '../services/api';
import dayjs from 'dayjs';
import CancelButton from "../components/CancelButton";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as ReactDOM from 'react-dom';

interface DietOrderFormProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

interface MealItem {
  foodItemId: string;
  foodItemName: string;
  quantity: number;
  unit: string;
}

// Function to load diet packages from API
const loadDietPackages = async (): Promise<DietPackage[]> => {
  try {
    return await dietPackagesApi.getAll();
  } catch (error) {
    console.error('Failed to load diet packages:', error);
    return [];
  }
};



const DietOrderForm: React.FC<DietOrderFormProps> = ({ sidebarCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dietPackages, setDietPackages] = useState<DietPackage[]>([]);
  const [orders, setOrders] = useState<DietOrder[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const viewOnly = location.state?.viewOnly;
  const [editingFoodIntakeId, setEditingFoodIntakeId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [mealOrders, setMealOrders] = useState<CanteenOrder[]>([]);
  const today = new Date().toISOString().split('T')[0];

  // Initialize form with default values or values from location state
  const [form, setForm] = useState<FormState>(() => {
    const state = location.state || {};
    return {
      patientName: state.patientName || "",
      patientId: state.patientId || "",
      contactNumber: state.contactNumber || "",
      email: state.email || "",
      address: state.address || "",
      bloodGroup: state.bloodGroup || "",
      tokenNo: state.tokenNo || "",
      visitId: state.visitId || "",
      age: state.age || "",
      gender: state.gender || "",
      bed: state.bed || "",
      ward: state.ward || "",
      floor: state.floor || "",
      doctor: state.doctor || "",
      patientType: state.patientType || "",
      dietPackage: "",
      packageRate: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      doctorNotes: state.doctorNotes || "",
      status: "active",
      approvalStatus: "pending"
    };
  });

  // Load data from API on component mount and when patientId changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [packagesData, ordersData, foodIntakeData] = await Promise.all([
          dietPackagesApi.getAll(),
          dietOrdersApi.getAll(),
          addFoodIntakeApi.getAll()
        ]);
        setDietPackages(packagesData);
        setOrders(ordersData);

        // Always use patientId from location.state if present
        const patientId = location.state?.patientId;
        console.log('DietOrderForm: patientId for food intake filter:', patientId);
        if (!patientId) {
          setFoodIntakeList([]); // No patient selected, show empty
          return;
        }
        const filteredFoodIntake = foodIntakeData.filter(
          (entry: any) => entry.patientId === patientId
        );
        setFoodIntakeList(filteredFoodIntake);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [location.state?.patientId]);

  interface FormState {
    patientName: string;
    patientId: string;
    contactNumber: string;
    email: string;
    address: string;
    bloodGroup: string;
    tokenNo: string;
    visitId: string;
    age: string;
    gender: string;
    bed: string;
    ward: string;
    floor?: string;
    doctor: string;
    patientType: string;
    dietPackage: string;
    packageRate: string;
    startDate: string;
    endDate: string;
    doctorNotes: string;
    status: "active" | "paused" | "stopped";
    approvalStatus: "pending" | "approved" | "rejected";
  }

  const [selectedPackageDetails, setSelectedPackageDetails] = useState<DietPackage | null>(null);
  const [foodIntakeList, setFoodIntakeList] = useState<FoodIntake[]>([]);
  const [foodItems, setFoodItems] = useState([]);

  // Update selected package details when dietPackage changes
  useEffect(() => {
    if (form.dietPackage) {
      const pkg = dietPackages.find(p => p.id === form.dietPackage);
      setSelectedPackageDetails(pkg || null);
    } else {
      setSelectedPackageDetails(null);
    }
  }, [form.dietPackage, dietPackages]);

  useEffect(() => {
    const loadOrders = async () => {
      const orders = await canteenOrdersApi.getAll();
      setMealOrders(orders);
    };
    loadOrders();
  }, [selectedPackageDetails]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const items = await foodItemsApi.getAll();
        setFoodItems(items);
      } catch (err) {
        console.error('Failed to fetch food items', err);
      }
    };
    fetchFoodItems();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Update form state
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Update selected package details and rate when diet package changes
    if (name === 'dietPackage') {
      const selected = dietPackages.find(pkg => pkg.id === value);
      setSelectedPackageDetails(selected || null);

      // Update the rate field when a package is selected
      if (selected) {
        setForm(prev => ({
          ...prev,
          packageRate: selected.totalRate.toString()
        }));
      } else {
        setForm(prev => ({
          ...prev,
          packageRate: ""
        }));
      }
    }
    if (name === 'contactNumber') {
      // Only allow numbers and limit to 10 digits
      const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
      setForm(prev => ({ ...prev, contactNumber: numbersOnly }));
      return;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await dietOrdersApi.delete(id);
        const updatedOrders = await dietOrdersApi.getAll();
        setOrders(updatedOrders);
      } catch (error) {
        console.error('Failed to delete order:', error);
        // setInfoMessage('Failed to delete order. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setForm({
      patientName: "",
      patientId: "",
      age: "",
      gender: "",
      contactNumber: "",
      email: "",
      address: "",
      bloodGroup: "",
      tokenNo: "",
      visitId: "",
      bed: "",
      ward: "",
      floor: "",
      doctor: "",
      patientType: "",
      dietPackage: "",
      packageRate: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      doctorNotes: "",
      status: "active",
      approvalStatus: "pending"
    });
  };

  const handleEdit = (order: DietOrder) => {
    setForm({
      patientName: order.patientName,
      patientId: order.patientId,
      age: order.age,
      gender: order.gender,
      contactNumber: order.contactNumber || "",
      email: order.email || "",
      address: order.address || "",
      bloodGroup: order.bloodGroup || "",
      tokenNo: order.tokenNo || "",
      visitId: order.visitId || "",
      bed: order.bed,
      ward: order.ward,
      floor: order.floor || "",
      doctor: order.doctor || "",
      patientType: order.patientType || "",
      dietPackage: order.dietPackage,
      packageRate: order.packageRate?.toString() || "",
      startDate: order.startDate,
      endDate: order.endDate || "",
      doctorNotes: order.doctorNotes,
      status: order.status,
      approvalStatus: order.approvalStatus
    });
    setEditingId(order.id);
    // showNotification('Editing order...', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Notification state for showing message if user clicks No
  // const [infoMessage, setInfoMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) {
      // Only for creating new order
      // const confirmCollect = window.confirm('Are you collecting the amount from patient?');
      // if (!confirmCollect) {
      //   setInfoMessage('Please collect amount from patient.');
      //   // Use setTimeout to ensure the scroll happens after the state update
      //   setTimeout(() => {
      //     window.scrollTo({ top: 0, behavior: 'smooth' });
      //   }, 10);
      //   return;
      // } else {
      //   setInfoMessage("");
      // }
    }


    try {
      const selectedPackage = dietPackages.find(pkg => pkg.id === form.dietPackage);
      const orderData: Omit<DietOrder, 'id'> = {
        ...form,
        floor: form.floor || '',
        doctor: form.doctor || '',
        packageRate: selectedPackage?.totalRate?.toString() || '',
      };

      if (editingId) {
        await dietOrdersApi.update(editingId, orderData);
      } else {
        await dietOrdersApi.create(orderData);
      }

      // Refresh orders from API
      const updatedOrders = await dietOrdersApi.getAll();
      setOrders(updatedOrders);

      setEditingId(null);
      resetForm();
      if (!editingId) {
        // navigate('/dietician');
      }
    } catch (error) {
      console.error('Failed to save order:', error);
      // setInfoMessage('Failed to save order. Please try again.');
    }
  };

  // Repeat Modal State
  const [repeatModalVisible, setRepeatModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [itemDates, setItemDates] = useState<Record<string, string>>({});

  // Food Intake State
  const [foodIntake, setFoodIntake] = useState({
    id: '',
    day: '',
    date: '',
    time: '',
    ampm: 'AM',
    category: '',
    fooditem: '',
    intake_amount: '',
    unit: '',
    carbohydrates: '',
    proteins: '',
    fat: '',
    calories: '',
    end_date: '',
    comments: '',
    status: '',
  });

  // Track unique dates to assign day numbers chronologically
  const [dateToDayMap, setDateToDayMap] = useState<{ [date: string]: number }>({});

  // For date input, set placeholder and handle clear
  const dateInputPlaceholder = 'dd/mm/yyyy';

  const handleFoodIntakeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // If date input is cleared, set to empty string
    if (type === 'date' && value === '') {
      setFoodIntake(prev => ({ ...prev, [name]: '' }));
      return;
    }
    if (name === 'date') {
      setFoodIntake(prev => {
        let newDay = prev.day;
        setDateToDayMap(prevMap => {
          // Add or update the date in the map, then sort all dates
          const allDates = Object.keys(prevMap).concat(value).filter((v, i, arr) => arr.indexOf(v) === i && v);
          allDates.sort();
          const newMap: { [date: string]: number } = {};
          allDates.forEach((d, idx) => { newMap[d] = idx + 1; });
          newDay = newMap[value]?.toString() || '';
          return newMap;
        });
        return { ...prev, date: value, day: newDay };
      });
      return;
    }
    setFoodIntake(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFoodIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId) {
      toast.error('No patient selected. Please select or create a patient first.');
      return;
    }
    if (editingFoodIntakeId) {
      // Edit mode: update the entry, preserve createdAt
      setFoodIntakeList(prev =>
        prev.map(item =>
          item.id === editingFoodIntakeId
            ? { ...foodIntake, id: editingFoodIntakeId, createdAt: item.createdAt, patientId: form.patientId }
            : item
        )
      );
      setEditingFoodIntakeId(null);
      setFoodIntake({
        id: '', day: '', date: '', time: '', ampm: 'AM', category: '', fooditem: '', intake_amount: '', unit: '', carbohydrates: '', proteins: '', fat: '', calories: '', end_date: '', comments: '', status: '',
      });
      toast.success('Food intake entry updated successfully.');
      return;
    }
    // Add mode: add new entry
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const newEntry = { ...foodIntake, id: Date.now().toString(), patientId: form.patientId, createdAt };
    try {
      await addFoodIntakeApi.create(newEntry);
      setFoodIntakeList(prev => [...prev, newEntry]);
      setFoodIntake({
        id: '', day: '', date: '', time: '', ampm: 'AM', category: '', fooditem: '', intake_amount: '', unit: '', carbohydrates: '', proteins: '', fat: '', calories: '', end_date: '', comments: '', status: '',
      });
      toast.success('Food intake entry added successfully.');
    } catch (err) {
      toast.error('Failed to save food intake. Please try again.');
    }
  };

  const handleEditFoodIntake = (item: any) => {
    setEditModalData(item);
    setEditModalOpen(true);
  };

  const handleSaveFoodIntakeEdit = async (updated: any) => {
    // Update in db.json via API
    try {
      await addFoodIntakeApi.update(updated.id, updated);
      setFoodIntakeList(prev => prev.map(item => item.id === updated.id ? updated : item));
      // setInfoMessage('Food intake entry updated successfully.');
      // setTimeout(() => setInfoMessage(''), 1000);
    } catch (err) {
      // setInfoMessage('Failed to update food intake entry.');
      // setTimeout(() => setInfoMessage(''), 2000);
    }
    setEditModalOpen(false);
  };

  const handleDeleteFoodIntake = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this food intake entry?')) {
      try {
        await addFoodIntakeApi.delete(id);
        setFoodIntakeList(prev => prev.filter(item => item.id !== id));
        // Remove from selected items if it was selected
        setSelectedItems(prev => {
          const newSelected = { ...prev };
          delete newSelected[id];
          return newSelected;
        });
      } catch (err) {
        console.error('Failed to delete food intake entry:', err);
      }
    }
  };

  // Toggle item selection for repeat
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => {
      const newSelected = {
        ...prev,
        [id]: !prev[id]
      };

      // If item is being selected, initialize its date to tomorrow
      if (!prev[id]) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedDate = tomorrow.toISOString().split('T')[0];
        setItemDates(prevDates => ({
          ...prevDates,
          [id]: formattedDate
        }));
      } else {
        // If item is being unselected, remove its date
        setItemDates(prev => {
          const newDates = { ...prev };
          delete newDates[id];
          return newDates;
        });
      }

      return newSelected;
    });
  };

  // Handle date change for an item
  const handleItemDateChange = (id: string, date: string) => {
    setItemDates(prev => ({
      ...prev,
      [id]: date
    }));
  };

  // Handle repeat button click
  const handleRepeatClick = () => {
    if (Object.values(selectedItems).some(selected => selected)) {
      setRepeatModalVisible(true);
    } else {
      toast.info('Please select at least one item to repeat');
    }
  };

  // Handle repeat confirmation
  const handleRepeatConfirm = async () => {
    try {
      const selectedEntries = foodIntakeList.filter(item => selectedItems[item.id]);
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');

      // Prepare all new dates (including repeated ones)
      const allDates = [
        ...foodIntakeList.map(item => item.date),
        ...selectedEntries.map(entry => itemDates[entry.id] || entry.date)
      ];
      const uniqueDates = Array.from(new Set(allDates)).sort();
      const dateToDay = Object.fromEntries(uniqueDates.map((date, idx) => [date, (idx + 1).toString()]));

      // Process entries in parallel for better performance
      await Promise.all(selectedEntries.map(async (entry) => {
        const newDate = itemDates[entry.id] || entry.date;
        const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const newDay = dateToDay[newDate] || '';
        const newEntry = {
          ...entry,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          date: newDate,
          day: newDay, // Save correct day
          createdAt,
          patientId: form.patientId
        };
        return addFoodIntakeApi.create(newEntry);
      }));

      // Refresh the food intake list to include the newly created entries
      const updatedList = await addFoodIntakeApi.getAll();
      setFoodIntakeList(updatedList);
      setSelectedItems({}); // Clear selection
      setItemDates({}); // Clear dates
      setRepeatModalVisible(false);
      toast.success('Selected items have been repeated successfully');

    } catch (error) {
      console.error('Failed to repeat items:', error);
      toast.error('Failed to repeat items. Please try again.');
    }
  };

  // Add Send to Canteen button in table header
  const [sentToCanteen, setSentToCanteen] = useState(false);
  const handleSendToCanteen = async () => {
    if (form.patientType.toLowerCase() !== 'ip') {
      toast.error('Only IP patients can be sent to canteen.');
      return;
    }
    try {
      // Send each food intake entry to the canteen API
      for (const entry of foodIntakeList) {
        await canteenOrdersApi.create({
          ...entry,
          patientName: form.patientName,
          contactNumber: form.contactNumber,
        });
      }
      toast.success('Food intake list sent to canteen!');
      setFoodIntakeList([]); // Clear the list after sending
    } catch (err) {
      toast.error('Failed to send to canteen');
    }
  };



  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        {/* <div className="header"> */}
        <SectionHeading title="Diet Order" subtitle="Meal preparation and delivery management" />
        {/* </div> */}

        <div className="form-section4">

          {/* infoMessage && (
          <div style={{ color: '#b71c1c', fontWeight: 600, marginBottom: 10 }}>{infoMessage}</div>
        ) */}
          <form onSubmit={handleSubmit}>
            {/* Patient Information Section - Styled as per image */}
            <div style={{
              // background: '#fff',
              // borderRadius: '10px',
              // border: '1px solid #e0e0e0',
              padding: '24px 24px 12px 24px',
              marginBottom: '24px',
              // boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '40px',
                marginBottom: '0px',
              }}>



                {/* Avatar on the left, info grid on the right */}

                <div style={{ flex: '0 0 auto' }}>
                  <Avatar name={form.patientName || '-'} size={100} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '18px 32px',
                    alignItems: 'center',
                    fontSize: '15px',
                  }}>
                    {/* Name */}
                    <div>
                      <div style={{ color: '#888', fontWeight: 500, fontSize: '13px', marginBottom: 2 }}>Name</div>
                      <div style={{ fontWeight: 700, color: '#0093b8', cursor: 'pointer', textDecoration: 'underline' }}>{form.patientName || '-'}</div>
                    </div>
                    {/* Phone Number */}
                    <div>
                      <div style={{ color: '#888', fontWeight: 500, fontSize: '13px', marginBottom: 2 }}>Phone Number</div>
                      <div style={{ fontWeight: 700, color: '#222', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FaWhatsapp color="#25D366" style={{ fontSize: 18 }} />
                        {form.contactNumber || '-'}
                      </div>
                    </div>
                    {/* Email */}
                    <div>
                      <div style={{ color: '#888', fontWeight: 500, fontSize: '13px', marginBottom: 2 }}>Email</div>
                      <div style={{ fontWeight: 700, color: '#222' }}>{form.email || '-'}</div>
                    </div>
                    {/* Token No */}
                    <div>
                      <div style={{ color: '#888', fontWeight: 500, fontSize: '13px', marginBottom: 2 }}>Token No</div>
                      <div style={{ fontWeight: 700, color: '#222' }}>{form.tokenNo || '-'}</div>
                    </div>
                    {/* Age & Gender */}
                    <div>
                      <div style={{ color: '#888', fontWeight: 500, fontSize: '13px', marginBottom: 2 }}>Age & Gender</div>
                      <div style={{ fontWeight: 700, color: '#222' }}>{form.age ? `${form.age} yrs` : '-'}, {form.gender || '-'}</div>
                    </div>
                    {/* Patient Type */}
                    <div>
                      <div style={{ color: '#888', fontWeight: 500, fontSize: '13px', marginBottom: 2 }}>Patient Type</div>
                      <div style={{ fontWeight: 700, color: '#222' }}>{form.patientType || location.state?.patientType || '-'}</div>
                    </div>
                    {/* Address */}
                    <div>
                      <div style={{ color: '#888', fontWeight: 500, fontSize: '13px', marginBottom: 2 }}>Address</div>
                      <div style={{ fontWeight: 700, color: '#222' }}>{form.address || '-'}</div>
                    </div>
                    {/* Blood Group */}
                    <div>
                      <div style={{ color: '#888', fontWeight: 500, fontSize: '13px', marginBottom: 2 }}>Blood Group</div>
                      <div style={{ fontWeight: 700, color: '#222' }}>{form.bloodGroup || '-'}</div>
                    </div>
                    {/* Visit ID */}
                    <div>
                      <div style={{ color: '#888', fontWeight: 500, fontSize: '13px', marginBottom: 2 }}>Visit ID</div>
                      <div style={{ fontWeight: 700, color: '#0093b8', cursor: 'pointer', textDecoration: 'underline' }}>{form.visitId || '-'}</div>
                    </div>
                    {/* UHID */}
                    <div>
                      <div style={{ color: '#888', fontWeight: 500, fontSize: '13px', marginBottom: 2 }}>UHID</div>
                      <div style={{ fontWeight: 700, color: '#222' }}>{form.patientId || '-'}</div>
                    </div>

                    {/* <div>
                    <div style={{ color: '#888', fontWeight: 500, fontSize: '13px', marginBottom: 2 }}>ABHA Address</div>
                    <div style={{ fontWeight: 700, color: '#0093b8', cursor: 'pointer', textDecoration: 'underline' }}>No ABHA Found</div>
                  </div> */}

                  </div>

                </div>
              </div>

            </div>


            {/* Food Intake Entry Section */}
            <div style={{
              // background: '#fff',
              borderRadius: '10px',
              // border: '1px solid #e0e0e0',
              padding: '24px',
              marginBottom: '24px',
              // boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              {/* <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}>
          <div style={{
            backgroundColor: '#038ba4',
            padding: '3px 5px',
            width: '100%',
            borderRadius: '4px 4px 2px 2px',
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>  */}

              {/* <h3 style={{
              margin: '6px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>Add Food Intake</h3> */}
              {/* </div>
        </div> */}
              {/* Sub-header with stretched background */}
              <div style={{
                background: '#37a9be',
                color: '#fff',
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.5px',
                borderRadius: '6px 6px 0 0',
                padding: '10px 10px 8px 10px',
                margin: '0 -20px 0 -20px', // stretch to container edges
                position: 'relative',
                top: '-12px',
                zIndex: 1,
              }}>
                Add Food Intake
              </div>


              {/* White container for form */}
              <div style={{
                background: '#fff',
                margin: '0 -20px 0 -20px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
                padding: '15px',
                marginBottom: '24px',
                marginTop: 10,
                // border: '1px solid #ddd',
              }}>
                <form onSubmit={handleAddFoodIntake}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr ', gap: '18px 24px', marginBottom: 20, padding: '10px' }}>
                    {/* <Input label="Day" name="day" value={foodIntake.day} onChange={handleFoodIntakeChange} /> */}
                    <Input label="Date" name="date" value={foodIntake.date} onChange={handleFoodIntakeChange} type="date" placeholder={dateInputPlaceholder} min={today} />
                    <Input label="Day" name="day" value={foodIntake.day} onChange={handleFoodIntakeChange} readOnly />
                    <Inputtype label="Category" name="category" value={foodIntake.category} onChange={handleFoodIntakeChange} options={[
                      { value: '', label: 'Select category' },
                      { value: 'Breakfast', label: 'Breakfast' },
                      { value: 'Lunch', label: 'Lunch' },
                      { value: 'Dinner', label: 'Dinner' },
                      { value: 'Snack', label: 'Snack' },
                    ]} />
                    <Inputtype
                      label="Food Item"
                      name="fooditem"
                      value={foodIntake.fooditem}
                      onChange={handleFoodIntakeChange}
                      options={[

                        ...foodItems.map((item: any) => ({ value: item.name, label: item.name }))
                      ]}
                    />

                    <Input label="Time" name="time" value={foodIntake.time} onChange={handleFoodIntakeChange} type="time" />
                    <Inputtype label="AM/PM" name="ampm" value={foodIntake.ampm} onChange={handleFoodIntakeChange} options={[
                      { value: 'AM', label: 'AM' },
                      { value: 'PM', label: 'PM' },
                    ]} />
                    <Input label="Intake Amount" name="intake_amount" value={foodIntake.intake_amount} onChange={handleFoodIntakeChange} type="number" />
                    <Inputtype label="Unit" name="unit" value={foodIntake.unit} onChange={handleFoodIntakeChange} options={[
                      { value: '', label: 'Select unit' },
                      { value: 'g', label: 'g' },
                      { value: 'ml', label: 'ml' },
                      { value: 'pcs', label: 'pcs' },
                    ]} />
                    {/* <Input label="Carbohydrates (g)" name="carbohydrates" value={foodIntake.carbohydrates} onChange={handleFoodIntakeChange} type="number" />
              <Input label="Proteins (g)" name="proteins" value={foodIntake.proteins} onChange={handleFoodIntakeChange} type="number" />
              <Input label="Fat (g)" name="fat" value={foodIntake.fat} onChange={handleFoodIntakeChange} type="number" /> */}
                    <Input label="Calorie (kcal)" name="calories" value={foodIntake.calories} onChange={handleFoodIntakeChange} type="number" placeholder="Enter Calorie" />
                    <Input label="End Date" name="end_date" value={foodIntake.end_date} onChange={handleFoodIntakeChange} type="date" min={today} />
                    <Input label="Comments" name="comments" value={foodIntake.comments} onChange={handleFoodIntakeChange} />
                    <Inputtype label="Status" name="status" value={foodIntake.status} onChange={handleFoodIntakeChange} options={[
                      { value: '', label: 'Select status' },
                      { value: 'Active', label: 'Active' },
                      { value: 'Paused', label: 'Paused' },
                      { value: 'Stopped', label: 'Stopped' },
                    ]} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'left', gap: 12, marginBottom: 3, paddingLeft: '10px' }}>
                    {/* <button type="submit" onClick={handleAddFoodIntake} 
              style={{ background: '#0093b8', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 28px', 
              fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Add</button> */}
                    <ButtonWithGradient className="primary" type="submit" onClick={handleAddFoodIntake}>
                      Add
                    </ButtonWithGradient>
                  </div>
                </form>
              </div>


              {/* White container for form */}
              <div style={{
                background: '#fff',
                margin: '0 -20px 0 -20px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
                padding: '15px',
                marginBottom: '24px',
                marginTop: 10,
                // border: '1px solid #ddd',
              }}>
                {foodIntakeList.length > 0 && (
                  <div style={{ margin: '18px 0', display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center', flexDirection: 'row-reverse' }}>
                    <Searchbar value={search} onChange={e => setSearch(e.target.value)} />
                    <ButtonWithGradient
                      onClick={async () => {
                        try {
                          // Create a temporary container for the PDF content
                          const pdfContainer = document.createElement('div');
                          pdfContainer.style.position = 'absolute';
                          pdfContainer.style.left = '-9999px';
                          pdfContainer.style.width = '1200px';
                          pdfContainer.style.padding = '20px';
                          pdfContainer.style.backgroundColor = '#ffffff';

                          // Create a title and date
                          const title = document.createElement('h2');
                          title.textContent = 'Diet Plan';
                          title.style.textAlign = 'center';
                          title.style.marginBottom = '20px';

                          const date = document.createElement('p');
                          date.textContent = `Generated on: ${new Date().toLocaleString()}`;
                          date.style.marginBottom = '20px';
                          date.style.textAlign = 'center';

                          // Create a temporary table with all rows for PDF
                          const tempTable = document.createElement('table');
                          tempTable.style.width = '100%';
                          tempTable.style.borderCollapse = 'collapse';

                          // Add table header
                          const thead = document.createElement('thead');
                          const headerRow = document.createElement('tr');
                          headerRow.style.backgroundColor = '#f8f9fa';
                          headerRow.style.borderBottom = '2px solid #dee2e6';

                          // Add headers
                          [
                            'Day', 'Date', 'Category', 'Food Item', 'Time',
                            'Intake Amount', 'Calories', 'End Date', 'Comments', 'Status'
                          ].forEach(headerText => {
                            const th = document.createElement('th');
                            th.textContent = headerText;
                            th.style.padding = '12px';
                            th.style.textAlign = 'left';
                            th.style.fontWeight = 'bold';
                            headerRow.appendChild(th);
                          });

                          thead.appendChild(headerRow);
                          tempTable.appendChild(thead);

                          // Add table body with all rows, using the same sortedList as the table
                          const sortedList = [...foodIntakeList].sort((a, b) => {
                            if (a.date < b.date) return -1;
                            if (a.date > b.date) return 1;
                            if (a.createdAt && b.createdAt) {
                              return a.createdAt.localeCompare(b.createdAt);
                            }
                            return 0;
                          });
                          const tbody = document.createElement('tbody');

                          sortedList.forEach((row, idx) => {
                            const tr = document.createElement('tr');
                            tr.style.borderBottom = '1px solid #dee2e6';
                            // Add day cell (only show for first row of each date)
                            const dayCell = document.createElement('td');
                            dayCell.style.padding = '10px';
                            dayCell.style.verticalAlign = 'top';
                            if (idx === 0 || (idx > 0 && sortedList[idx - 1].date !== row.date)) {
                              dayCell.textContent = row.day || '';
                            }
                            tr.appendChild(dayCell);
                            // Add other cells
                            ['date', 'category', 'fooditem', 'time', 'intake_amount',
                              'calories', 'end_date', 'comments', 'status'].forEach(key => {
                                const td = document.createElement('td');
                                td.style.padding = '10px';
                                td.style.verticalAlign = 'top';
                                td.textContent = row[key] !== undefined ? String(row[key]) : '';
                                tr.appendChild(td);
                              });
                            tbody.appendChild(tr);
                          });

                          tempTable.appendChild(tbody);

                          // Assemble the PDF content
                          pdfContainer.appendChild(title);
                          pdfContainer.appendChild(date);
                          pdfContainer.appendChild(tempTable);
                          document.body.appendChild(pdfContainer);

                          // Generate PDF
                          const canvas = await html2canvas(pdfContainer, {
                            scale: 1.5,
                            useCORS: true,
                            logging: true,
                            backgroundColor: '#ffffff'
                          });

                          // Create PDF
                          const imgData = canvas.toDataURL('image/png');
                          const pdf = new jsPDF({
                            orientation: 'landscape',
                            unit: 'mm',
                            format: 'a4'
                          });

                          // Calculate dimensions
                          const imgProps = pdf.getImageProperties(imgData);
                          const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // Add margins
                          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                          // Add image to PDF with margins
                          pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);

                          // Save the PDF
                          pdf.save(`diet-plan-${new Date().toISOString().split('T')[0]}.pdf`);

                          // Show success message
                          toast.success('PDF generated successfully!');
                        } catch (error) {
                          console.error('Error generating PDF:', error);
                          toast.error('Failed to generate PDF. Please try again.');
                        } finally {
                          // Clean up
                          const container = document.querySelector('div[style*="left: -9999px"]');
                          if (container) {
                            document.body.removeChild(container);
                          }
                        }
                      }}
                    >
                      Export to PDF
                    </ButtonWithGradient>
                  </div>
                )}

                {/* Table of added food intake entries - Table component, show day in first row of group */}
                {foodIntakeList.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <div id="diet-plan-table-pdf">
                      {/** Sort foodIntakeList by date (asc), then by createdAt (asc) if available */}
                      {(() => {
                        const sortedList = [...foodIntakeList].sort((a, b) => {
                          if (a.date < b.date) return -1;
                          if (a.date > b.date) return 1;
                          // If same date, sort by createdAt if available
                          if (a.createdAt && b.createdAt) {
                            return a.createdAt.localeCompare(b.createdAt);
                          }
                          return 0;
                        });
                        return (
                          <Table
                            columns={[
                              {
                                key: 'day', header: 'Day', render: (_v, row, idx) => {
                                  // Only show day for the first row of each date
                                  if (typeof idx !== 'number' || !row) return '';
                                  if (idx === 0) return row.day;
                                  const prev = sortedList[idx - 1];
                                  return prev && prev.date !== row.date ? row.day : '';
                                }
                              },
                              { key: 'date', header: 'Date' },
                              { key: 'category', header: 'Category' },
                              { key: 'fooditem', header: 'Food Item' },
                              { key: 'time', header: 'Time' },
                              { key: 'intake_amount', header: 'Intake Amount' },
                              { key: 'calories', header: 'Calories' },
                              { key: 'end_date', header: 'End Date' },
                              { key: 'comments', header: 'Comments' },
                              { key: 'status', header: 'Status' },
                              {
                                key: 'select',
                                header: 'Select',
                                render: (_v, row = {}) => (
                                  <input
                                    type="checkbox"
                                    checked={!!selectedItems[row.id]}
                                    onChange={() => toggleItemSelection(row.id)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                  />
                                )
                              },
                              {
                                key: 'action',
                                header: 'Action',
                                render: (_v, row = {}) => (
                                  <span style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                    <EditButton onClick={() => handleEditFoodIntake(row)} size={18} />
                                    <DeleteButton onClick={() => handleDeleteFoodIntake(row.id)} size={18} />
                                  </span>
                                )
                              },
                              {
                                key: 'details', header: 'Details', render: (_v, row = {}) => (
                                  <span style={{ color: '#222', fontWeight: 500 }}>
                                    {row.createdAt ? row.createdAt : '-'}
                                  </span>
                                )
                              },
                            ]}
                            data={sortedList.filter(item => {
                              if (!search) return true;
                              const searchStr = search.toLowerCase();
                              return Object.values(item).some(val =>
                                val && val.toString().toLowerCase().includes(searchStr)
                              );
                            })}
                          />
                        );
                      })()}
                    </div>
                    {/* Send to Canteen button only for IP patients */}
                    {/* {form.patientType.toLowerCase() === 'ip' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', gap: 12 }}>
                  <ButtonWithGradient onClick={handleSendToCanteen} className="primary" type="button">
                    Send to Canteen
                  </ButtonWithGradient>
                </div>
              )} */}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', gap: 12 }}>
                      <CancelButton
                        onClick={handleRepeatClick}
                        className="primary"
                        type="button"
                      >
                        <FaRedo style={{ marginRight: '8px' }} />
                        Repeat Diet
                      </CancelButton>


                      {form.patientType.toLowerCase() === 'ip' && (
                        <ButtonWithGradient onClick={handleSendToCanteen} className="primary" type="button">
                          Send to Canteen
                        </ButtonWithGradient>
                      )}

                    </div>
                    {sentToCanteen && (
                      <div style={{ color: '#0093b8', fontWeight: 600, marginTop: 10 }}>Food intake list sent to canteen!</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* {!viewOnly && (
              <ButtonWithGradient className="primary" type="submit">
                {editingId ? 'Update Order' : 'Create Diet Order'}
              </ButtonWithGradient>
            )} */}
          </form>
        </div>

        {/* </div> */}


      </PageContainer>
      <Footer />
      <FoodIntakeEditModal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        initialData={editModalData}
        onSave={handleSaveFoodIntakeEdit}
        dateList={foodIntakeList.map(item => item.date)}
      />
      <Modal
        title="Repeat Selected Items"
        open={repeatModalVisible}
        onCancel={() => setRepeatModalVisible(false)}
        footer={[
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <CancelButton text="Cancel" onClick={() => setRepeatModalVisible(false)} />
          <ButtonWithGradient className="primary" type="submit" onClick={handleRepeatConfirm}>
            <FaRedo style={{ marginRight: '8px' }} />
            Repeat 
          </ButtonWithGradient>
        </div>
          // <CancelButton key="cancel" text="Cancel" onClick={() => setRepeatModalVisible(false)} />,
          // <ButtonWithGradient key="repeat" className="primary" onClick={handleRepeatConfirm} type="button">
          //   <FaRedo style={{ marginRight: '8px' }} />
          //   Repeat 
          // </ButtonWithGradient>
        ]}
       
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '16px', fontWeight: 500, fontSize: '14px' }}>
            Selected Items: {Object.values(selectedItems).filter(Boolean).length}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>Item</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', width: '200px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {foodIntakeList
                  .filter(item => selectedItems[item.id])
                  .map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 500 }}>{item.fooditem}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {item.category} • {item.time} {item.ampm} • {item.intake_amount} {item.unit}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <FormDateInput
                          name={`date-${item.id}`}
                          value={itemDates[item.id] || ''}
                          onChange={e => handleItemDateChange(item.id, e.target.value)}
                          style={{ width: '100%' }}
                          min={today}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
      <ToastContainer autoClose={1300} />
    </>
  );
}
export default DietOrderForm;