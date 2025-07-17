import { useState, useEffect } from "react";
import '../styles/Dietician.css';
import '../styles/Notification.css';
import '../styles/ShortcutModal.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import SectionHeading from "../components/SectionHeading";
import Searchbar from "../components/Searchbar";
import ButtonWithGradient from "../components/button";
import FormInputType from "../components/Inputtype";
import FormInputs from "../components/Input";
import FormDateInput from "../components/Date";
// import editLogo from '../assets/edit.png'
import CancelButton from "../components/CancelButton";
import deleteLogo from '../assets/delete.png'
import Table from '../components/Table';
import EditButton from '../components/EditButton';
import DeleteButton from '../components/DeleteButton';
import ApproveButton from '../components/AcceptButton';
import RejectButton from '../components/RejectButton';
import { FiPause, FiSquare } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { useFood } from '../context/FoodContext';
import AddressInput from "../components/Addressinput";
import { dietOrdersApi, dietPackagesApi, canteenOrdersApi } from '../services/api';
import type { DietOrder, DietPackage } from '../services/api';
import 'react-toastify/dist/ReactToastify.css';
// import { foodItemApi } from "../api/foodItemApi";
// import type { FoodItem } from "../types/foodItem";


type Status = "active" | "paused" | "stopped";
type ApprovalStatus = "pending" | "approved" | "rejected";


interface DieticianInterface {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}


type MealType = 'breakfast' | 'brunch' | 'lunch' | 'evening' | 'dinner';
interface CustomPlanMealItem {
  foodItemId: string;
  foodItemName: string;
  quantity: number;
  unit: string;
  time?: string;
  period?: 'AM' | 'PM';
}


const DieticianInterface: React.FC<DieticianInterface> = ({ sidebarCollapsed, toggleSidebar }) => {
  const [pendingOrders, setPendingOrders] = useState<DietOrder[]>([]);
  const [dietPackages, setDietPackages] = useState<DietPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DietOrder | null>(null);
  const [instructions, setInstructions] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<DietPackage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string>("");
  const [showCustomDietForm, setShowCustomDietForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customDietForm, setCustomDietForm] = useState<{
    patientName: string;
    patientId: string;
    contactNumber: string;
    age: string;
    bed: string;
    ward: string;
    dietPackage: string;
    rate: string;
    startDate: string;
    endDate: string;
    status: string;
    approvalStatus: string;
  }>({
    patientName: '',
    patientId: '',
    contactNumber: '',
    age: '',
    bed: '',
    ward: '',
    dietPackage: '',
    rate: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    status: 'active',
    approvalStatus: 'pending',
  });
  const [showCustomPlanForm, setShowCustomPlanForm] = useState(false);
  const [customPlanForm, setCustomPlanForm] = useState({
    packageName: '',
    dietType: '',
  });
  const [customPlanMeals, setCustomPlanMeals] = useState<Record<MealType, CustomPlanMealItem[]>>({
    breakfast: [],
    brunch: [],
    lunch: [],
    evening: [],
    dinner: [],
  });
  const { foodItems } = useFood();
  const [customPlanAmount, setCustomPlanAmount] = useState(0);
  const [customPlans, setCustomPlans] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [customPlanNutrition, setCustomPlanNutrition] = useState({ calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
  const [patientNutrition, setPatientNutrition] = useState({ calories: 0, protein: 0, carbohydrates: 0, fat: 0 });


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  // Load orders and packages from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load orders and packages in parallel
        const [orders, packages] = await Promise.all([
          dietOrdersApi.getAll(),
          dietPackagesApi.getAll()
        ]);
        
        setPendingOrders(orders);
        setDietPackages(packages);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);


  // Update selected package when order changes
  useEffect(() => {
    if (selectedOrder) {
      const pkg = dietPackages.find(p => p.id === selectedOrder.dietPackage);
      setSelectedPackage(pkg || null);
      setEditingPackageId(selectedOrder.dietPackage || '');
      setInstructions(selectedOrder.dieticianInstructions || '');
    }
  }, [selectedOrder, dietPackages]);


//   useEffect(() => {
//     foodItemApi.getAll().then(setFoodItems);
//   }, []);


//   useEffect(() => {
//     // Calculate total amount
//     let total = 0;
//     Object.values(customPlanMeals).forEach(mealArr => {
//       mealArr.forEach((item: any) => {
//         const food = foodItems.find(f => f.id === item.foodItemId);
//         if (food) total += food.price * (item.quantity || 1);
//       });
//     });
//     setCustomPlanAmount(total);
//   }, [customPlanMeals, foodItems]);


  const updateOrders = async (updatedOrders: DietOrder[]) => {
    setPendingOrders(updatedOrders);
    // Note: We don't need to save to localStorage anymore since we're using the API
    // The API calls will handle persistence
  };


  const handleEditClick = () => {
    if (selectedOrder) {
      setEditingPackageId(selectedOrder.dietPackage);
      setSelectedPackage(dietPackages.find(pkg => pkg.id === selectedOrder.dietPackage) || 
        customPlans.find(plan => `custom-${plan.id}` === selectedOrder.dietPackage) || null);
    }
    setIsEditing(true);
  };


  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedOrder) {
      setEditingPackageId(selectedOrder.dietPackage);
    }
  };


  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPackageId = e.target.value;
    setEditingPackageId(newPackageId);
    
    // Check if it's a custom package
    if (newPackageId.startsWith('custom-')) {
      const planId = newPackageId.replace('custom-', '');
      const plan = customPlans.find(p => p.id.toString() === planId);
      if (plan) {
        // Create a mock package structure for custom plans
        const customPackage = {
          id: newPackageId,
          name: plan.packageName,
          type: plan.dietType,
          breakfast: plan.meals.breakfast || [],
          brunch: plan.meals.brunch || [],
          lunch: plan.meals.lunch || [],
          evening: plan.meals.evening || [],
          dinner: plan.meals.dinner || [],
          totalRate: plan.amount,
          totalNutrition: { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
        };
        setSelectedPackage(customPackage as any);
      }
    } else {
      // Regular package
      const newPackage = dietPackages.find(pkg => pkg.id === newPackageId);
      if (newPackage) {
        setSelectedPackage(newPackage);
      }
    }
  };


  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
   
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 1500);
  };


  const handleSaveChanges = async () => {
    if (selectedOrder) {
      try {
        let packageName = '';
        if (editingPackageId.startsWith('custom-')) {
          const planId = editingPackageId.replace('custom-', '');
          const plan = customPlans.find(p => p.id.toString() === planId);
          packageName = plan ? plan.packageName : '';
        } else {
          const selectedPkg = dietPackages.find(pkg => pkg.id === editingPackageId);
          packageName = selectedPkg?.name || '';
        }
        
        const updatedOrder = {
          ...selectedOrder,
          dietPackage: editingPackageId,
          packageName: packageName
        };
       
        await dietOrdersApi.update(selectedOrder.id, updatedOrder);
        
        // Refresh orders from API
        const updatedOrders = await dietOrdersApi.getAll();
        setPendingOrders(updatedOrders);
        setSelectedOrder(updatedOrder);
        setIsEditing(false);
        setSelectedOrder(null); // Close the review order page after saving
      } catch (error) {
        console.error('Failed to update diet order:', error);
      }
    }
  };


  const handleApprove = async (id: string) => {
    try {
      const orderToApprove = pendingOrders.find(order => order.id === id);
      if (!orderToApprove) return;

      const approvedOrder = {
        ...orderToApprove,
        approvalStatus: "approved" as const,
        dieticianInstructions: instructions,
        status: "active" as const
      };
     
      // Update the order in the API
      await dietOrdersApi.update(id, approvedOrder);
     
      // Get current canteen orders from API
      const existingCanteenOrders = await canteenOrdersApi.getAll();
     
      // Check if order already exists in canteen orders
      const orderIndex = existingCanteenOrders.findIndex((o: any) => o.id === id);
     
      // Always fetch the correct package for this order
      let pkgName = 'N/A';
      let dietType = 'N/A';
      let foodItems: string[] = [];
      
      if (approvedOrder.dietPackage.startsWith('custom-')) {
        const planId = approvedOrder.dietPackage.replace('custom-', '');
        const plan = customPlans.find(p => p.id.toString() === planId);
        if (plan) {
          pkgName = plan.packageName;
          dietType = plan.dietType;
          // Convert custom plan meals to food items
          Object.values(plan.meals).forEach((mealArr: any) => {
            mealArr.forEach((item: any) => {
              foodItems.push(`${item.foodItemName} - ${item.quantity} ${item.unit}`);
            });
          });
        }
      } else {
        const pkg = dietPackages.find(p => p.id === approvedOrder.dietPackage);
        pkgName = pkg?.name || 'N/A';
        dietType = pkg?.type || 'N/A';
        foodItems = pkg ? Object.values(pkg).filter(Array.isArray).flat().map(item => `${item.foodItemName} - ${item.quantity} ${item.unit}`) : [];
      }
      
      // Update the order with the package name
      const updatedOrder = {
        ...approvedOrder,
        packageName: pkgName
      };
      
      // Update the order in the API
      await dietOrdersApi.update(id, updatedOrder);
      
      const canteenOrder = {
        id: approvedOrder.id,
        patientName: approvedOrder.patientName,
        bed: approvedOrder.bed,
        ward: approvedOrder.ward,
        dietPackageName: pkgName,
        dietType: dietType,
        foodItems: foodItems,
        specialNotes: approvedOrder.dieticianInstructions || '',
        status: 'pending' as const,
        prepared: false,
        delivered: false,
        dieticianInstructions: approvedOrder.dieticianInstructions
      };

      // Update or add the order to canteen orders
      if (orderIndex >= 0) {
        await canteenOrdersApi.update(id, canteenOrder);
      } else {
        await canteenOrdersApi.create(canteenOrder);
      }
     
      // Refresh orders from API
      const updatedOrders = await dietOrdersApi.getAll();
      setPendingOrders(updatedOrders);
      setSelectedOrder(null);
      setInstructions("");
     
      // Show success notification
      // toast.success('Order approved and sent to canteen!');
     
      // Trigger custom event to notify canteen interface
      window.dispatchEvent(new Event('canteenOrdersUpdated'));
     
    } catch (error) {
      console.error('Error approving order:', error);
      // toast.error('Failed to approve order. Please try again.');
    }
  };


  const handleReject = async (id: string) => {
    try {
      const rejectedOrder = {
        approvalStatus: "rejected" as const,
        dieticianInstructions: instructions,
        status: "stopped" as const
      };
      
      await dietOrdersApi.update(id, rejectedOrder);
      
      // Refresh orders from API
      const updatedOrders = await dietOrdersApi.getAll();
      setPendingOrders(updatedOrders);
      setSelectedOrder(null);
      setInstructions("");
      // toast.error('Order rejected successfully');
    } catch (error) {
      console.error('Failed to reject order:', error);
      // toast.error('Failed to reject order');
    }
  };


  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await dietOrdersApi.delete(id);
        
        // Refresh orders from API
        const updatedOrders = await dietOrdersApi.getAll();
        setPendingOrders(updatedOrders);
        setSelectedOrder(null);
        setInstructions("");
        // toast.error('Order deleted successfully');
      } catch (error) {
        console.error('Failed to delete order:', error);
        // toast.error('Failed to delete order');
      }
    }
  };

  const handleEdit = (id: string) => {
    const orderToEdit = pendingOrders.find(order => order.id === id);
    if (orderToEdit) {
      setSelectedOrder(orderToEdit);
      setShowReviewModal(true);
    }
  };

  const handleView = (id: string) => {
    const orderToView = pendingOrders.find(order => order.id === id);
    if (orderToView) {
      setSelectedOrder(orderToView);
    }
  };


  const handlePause = async (id: string) => {
    try {
      const now = new Date().toISOString();
      await dietOrdersApi.update(id, {
        status: 'paused' as const,
        pauseDate: now
      });
      
      // Refresh orders from API
      const updatedOrders = await dietOrdersApi.getAll();
      setPendingOrders(updatedOrders);
      // toast.error('Order paused successfully');
    } catch (error) {
      console.error('Failed to pause order:', error);
      // toast.error('Failed to pause order');
    }
  };


  const handleRestart = async (id: string) => {
    try {
      const now = new Date().toISOString();
      await dietOrdersApi.update(id, {
        status: 'active' as const,
        restartDate: now
      });
      
      // Refresh orders from API
      const updatedOrders = await dietOrdersApi.getAll();
      setPendingOrders(updatedOrders);
      // toast.success('Diet order restarted!');
    } catch (error) {
      console.error('Failed to restart order:', error);
      // toast.error('Failed to restart order');
    }
  };


  // Autofill rate when package changes
  const getNextPatientId = () => {
    const existingIds = pendingOrders.map(order => order.patientId || '');
    
    // Find the highest numeric part of existing IDs
    const numbers = existingIds
      .filter(id => id.startsWith('p'))
      .map(id => {
        const num = parseInt(id.slice(1));
        return !isNaN(num) ? num : 0;
      })
      .filter(num => num > 0);
    
    if (!numbers.length) {
      return 'p001';
    }
    
    const maxNumber = Math.max(...numbers);
    const nextNumber = maxNumber + 1;
    return `p${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleCustomDietPackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkgId = e.target.value;
    // Check if it's a custom plan
    if (pkgId.startsWith('custom-')) {
      const planId = pkgId.replace('custom-', '');
      const plan = customPlans.find(p => p.id.toString() === planId);
      let nutrition = { calories: 0, protein: 0, carbohydrates: 0, fat: 0 };
      if (plan) {
        Object.values(plan.meals).forEach((mealArr: any) => {
          mealArr.forEach((item: any) => {
            const food = foodItems.find(f => f.id.toString() === item.foodItemId);
            if (food) {
              const qty = Number(item.quantity) || 1;
              nutrition.calories += Number(food.calories) * qty || 0;
              nutrition.protein += Number(food.protein) * qty || 0;
              nutrition.carbohydrates += Number(food.carbohydrates) * qty || 0;
              nutrition.fat += Number(food.fat) * qty || 0;
            }
          });
        });
      }
      setPatientNutrition(nutrition);
      setCustomDietForm(prev => ({
        ...prev,
        dietPackage: pkgId,
        rate: plan ? plan.amount.toString() : ''
      }));
    } else {
      const pkg = dietPackages.find(p => p.id === pkgId);
      setPatientNutrition(pkg?.totalNutrition || { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
      setCustomDietForm(prev => ({
        ...prev,
        dietPackage: pkgId,
        rate: pkg?.totalRate?.toString() || ''
      }));
    }
  };

  const handleCustomDietInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // For contactNumber, restrict to 10 digits
    if (name === 'contactNumber') {
      if (!/^\d{0,10}$/.test(value)) return;
    }
    setCustomDietForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomDietSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!customDietForm.patientName || !customDietForm.dietPackage || !customDietForm.startDate || !customDietForm.rate || !customDietForm.endDate) {
      // toast.error('Please fill all required fields (Patient Name, Diet Package, Rate, Start Date, End Date)');
      return;
    }
    if (!customDietForm.contactNumber || !/^\d{10}$/.test(customDietForm.contactNumber)) {
      // toast.error('Contact number must be exactly 10 digits');
      return;
    }
   

    try {
      // Generate patient ID if not set
      let patientId = customDietForm.patientId;
      if (!patientId) {
        patientId = getNextPatientId();
      }
      const pkg = dietPackages.find(p => p.id === customDietForm.dietPackage);
      const newOrder = {
        patientName: customDietForm.patientName,
        patientId: patientId,
        contactNumber: customDietForm.contactNumber,
        age: customDietForm.age,
        bed: customDietForm.bed,
        ward: customDietForm.ward,
        floor: '', // required by DietOrder, not in form
        dietPackage: customDietForm.dietPackage,
        packageRate: customDietForm.rate,
        startDate: customDietForm.startDate,
        endDate: customDietForm.endDate,
        doctorNotes: '', // required by DietOrder, not in form
        status: customDietForm.status as Status,
        approvalStatus: customDietForm.approvalStatus as ApprovalStatus,
        dieticianInstructions: '',
      };
      
      await dietOrdersApi.create(newOrder);
      
      // Refresh orders
      const updatedOrders = await dietOrdersApi.getAll();
      setPendingOrders(updatedOrders);
      
      // toast.success('Order created successfully');
      setShowCustomDietForm(false);
      setCustomDietForm({
        patientName: '',
        patientId: '',
        contactNumber: '',
        age: '',
        bed: '',
        ward: '',
        dietPackage: '',
        rate: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: '',
        status: 'active',
        approvalStatus: 'pending',
      });
    } catch (error) {
      console.error('Failed to create order:', error);
      // toast.error('Failed to create order');
    }
  };


  const addCustomPlanMealItem = (mealType: MealType) => {
    setCustomPlanMeals(prev => ({
      ...prev,
      [mealType]: [...prev[mealType], { foodItemId: '', foodItemName: '', quantity: 1, unit: '', time: '', period: 'AM' }],
    }));
  };
  const updateCustomPlanMealItem = (mealType: MealType, idx: number, field: string, value: any) => {
    setCustomPlanMeals(prev => {
      const arr = [...prev[mealType]];
      arr[idx] = { ...arr[idx], [field]: value };
      if (field === 'foodItemId') {
        const food = foodItems.find(f => f.id.toString() === value);
        if (food) {
          arr[idx].foodItemName = food.name;
          arr[idx].unit = food.unit;
        }
      }
      return { ...prev, [mealType]: arr };
    });
  };
  const removeCustomPlanMealItem = (mealType: MealType, idx: number) => {
    setCustomPlanMeals(prev => {
      const arr = [...prev[mealType]];
      arr.splice(idx, 1);
      return { ...prev, [mealType]: arr };
    });
  };
  const handleCustomPlanInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomPlanForm(prev => ({ ...prev, [name]: value }));
  };
  const handleCustomPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save as a new diet package (custom plan)
    const newPlan = {
      id: Date.now().toString(),
      packageName: customPlanForm.packageName,
      dietType: customPlanForm.dietType,
      meals: customPlanMeals,
      amount: customPlanAmount,
    };
    // Save to localStorage or your preferred storage
    const saved = localStorage.getItem('customPlans');
    const plans = saved ? JSON.parse(saved) : [];
    plans.push(newPlan);
    localStorage.setItem('customPlans', JSON.stringify(plans));
    setShowCustomPlanForm(false);
    setCustomPlanForm({ packageName: '', dietType: '' });
    setCustomPlanMeals({ breakfast: [], brunch: [], lunch: [], evening: [], dinner: [] });
    setCustomPlanAmount(0);
    // showNotification('Custom plan created!', 'success');
  };

  // Load custom plans from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customPlans');
    setCustomPlans(saved ? JSON.parse(saved) : []);
  }, [showCustomPlanForm]);

  // Calculate total rate and nutrition for custom plan
  useEffect(() => {
    let total = 0;
    let nutrition = { calories: 0, protein: 0, carbohydrates: 0, fat: 0 };
    Object.values(customPlanMeals).forEach(mealArr => {
      mealArr.forEach((item: any) => {
        const food = foodItems.find(f => f.id.toString() === item.foodItemId);
        if (food) {
          const qty = Number(item.quantity) || 1;
          total += Number(food.price || 0) * qty;
          nutrition.calories += Number(food.calories) * qty || 0;
          nutrition.protein += Number(food.protein) * qty || 0;
          nutrition.carbohydrates += Number(food.carbohydrates) * qty || 0;
          nutrition.fat += Number(food.fat) * qty || 0;
        }
      });
    });
    setCustomPlanAmount(total);
    setCustomPlanNutrition(nutrition);
  }, [customPlanMeals, foodItems]);


  return (
    <>
    <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator/>
    {/* <div className="dietician-container"> */}
    <PageContainer>
      {/* <div className="header" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}> */}
        <SectionHeading title="Dietician Interface" subtitle="Review and approve diet orders from doctors"/>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom:'20px' }}>
          <ButtonWithGradient onClick={() => setShowCustomDietForm((f: boolean) => {
            setCustomDietForm(prev => ({
              ...prev,
              startDate: new Date().toISOString().slice(0, 10)
            }));
            return !f;
          })} text="+ Add Patient"/>
          <ButtonWithGradient onClick={() => setShowCustomPlanForm((f: boolean) => !f)} text="+ Add a custom plan"/>
          <Searchbar value={searchTerm} onChange={handleSearchChange}/>
        </div>
      {/* </div> */}



      {showCustomDietForm && (
        <div className="form-container" style={{marginBottom:'2rem'}}>
          {/* <div className="section-header border border-black">Add Patient</div> */}
          <form onSubmit={handleCustomDietSubmit}>
            <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
              <div style={{ flex: 1 }}>
                <FormInputs label="Patient Id" type="text" name="patientId" placeholder='Patient ID' value={customDietForm.patientId} onChange={handleCustomDietInputChange}/>
              </div>
              <div style={{ flex: 1 }}>
                <FormInputs label="Patient Name" type="text" name="patientName" placeholder='Patient Name' value={customDietForm.patientName} onChange={handleCustomDietInputChange}/>
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
              <div style={{ flex: 1 }}>
                <FormInputs label="Contact Number" type="text" name="contactNumber" placeholder='Contact Number' value={customDietForm.contactNumber} onChange={handleCustomDietInputChange}/>
              </div>
              <div style={{ flex: 1 }}>
                <FormInputs label="Age" type="text" name="age" placeholder='Age' value={customDietForm.age} onChange={handleCustomDietInputChange}/>
              </div>
            </div>
            

            <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}> 
              <div style={{ flex: 1 }}>
                <FormInputType
                  name="dietPackage"
                  label="Diet Package"
                  value={customDietForm.dietPackage}
                  onChange={handleCustomDietPackageChange}
                  options={[
                    ...dietPackages.map(pkg => ({ label: `${pkg.name} (${pkg.type})`, value: pkg.id })),
                    ...customPlans.map(plan => ({ label: `Custom: ${plan.packageName} (${plan.dietType})`, value: `custom-${plan.id}` }))
                  ]}
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormInputs label="Rate" name="rate" value={customDietForm.rate} placeholder="Rate" readOnly onChange={() => {}}/>
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
              <div style={{ flex: 1 }}>
                <FormDateInput label="Start date"  name="startDate" value={customDietForm.startDate} onChange={handleCustomDietInputChange}/>
              </div>
              <div style={{ flex: 1 }}>
                <FormDateInput label="End date"  name="endDate" value={customDietForm.endDate} onChange={handleCustomDietInputChange}/>
              </div>
            </div>
            
            <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
              <div style={{ flex: 1 }}>
                <FormInputType name="status"
                label="Status"
                  value={customDietForm.status}
                  onChange={handleCustomDietInputChange}
                options={[
                    { label: "Active", value: "active" },
                    { label: "Pause", value: "pause" },
                    { label: "Stop", value: "stop" }
                ]}
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormInputType name="approvalStatus"
                label="Approval"
                  value={customDietForm.approvalStatus}
                  onChange={handleCustomDietInputChange}
                options={[
                    { label: "Pending", value: "pending" },
                    { label: "Approved", value: "approved" },
                    { label: "Rejected", value: "rejected" }
                ]}
                />
              </div>
            </div>
            <div style={{ margin: '10px 0', fontWeight: 600, color: '#0d92ae' }}>
              <div>Total Rate: ₹{customDietForm.rate || 0}</div>
            </div>
            <div style={{ margin: '10px 0', fontWeight: 600, color: '#0d92ae' }}>
              <div>Total Nutrition: Calories: {patientNutrition.calories} kcal, Protein: {patientNutrition.protein}g, Carbs: {patientNutrition.carbohydrates}g, Fat: {patientNutrition.fat}g</div>
            </div>
            <div className="form-actions">
              {/* <button className="btn-text approve" type="submit">Add Order</button> */}
              <ButtonWithGradient type="submit" text="Add Order"/>
              {/* <button className="btn-text" type="button" onClick={() => setShowCustomDietForm(false)}>Cancel</button> */}
              <CancelButton type="button" onClick={() => setShowCustomDietForm(false)} text="Cancel"/>
            </div>
          </form>
        </div>
      )}


      {showCustomPlanForm && (
          <div className="form-container" style={{ marginBottom: '2rem' }}>
          {/* <div className="section-header">Add Custom Plan</div> */}
          <form className="form" onSubmit={handleCustomPlanSubmit}>
            <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' ,marginTop:'10px'}}>
              <div style={{ flex: 1 }}>
                <FormInputs
                  label="Diet Package Name"
                  type="text"
                  name="packageName"
                  value={customPlanForm.packageName}
                  onChange={handleCustomPlanInputChange}
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormInputType
                  label="Diet Type"
                  name="dietType"
                  value={customPlanForm.dietType}
                  onChange={handleCustomPlanInputChange}
                  options={[
                    { label: "Regular", value: "regular" },
                    { label: "Specialized", value: "specialized" },
                    { label: "Therapeutic", value: "therapeutic" },
                    { label: "Weight Loss", value: "weight loss" },
                    { label: "Weight Gain", value: "weight gain" },
                    { label: "Maintenance", value: "maintenance" },
                    { label: "Weight Management", value: "weight management" },
                    { label: "Soft Diet", value: "soft diet" },
                    { label: "Cardiac Diet", value: "cardiac diet" },
                    { label: "High Protein Diet", value: "high protein diet" },
                    { label: "Gluten-Free Diet", value: "gluten-free diet" },
                    { label: "Gastric Diet", value: "gastric diet" },
                    { label: "Keto Diet", value: "keto diet" },
                    { label: "Low Carb Diet", value: "low carb diet" },
                    { label: "Low Fat Diet", value: "low fat diet" },
                    { label: "Low Sodium Diet", value: "low sodium diet" },
                    { label: "Low Sugar Diet", value: "low sugar diet" },
                    { label: "Paleo Diet", value: "paleo diet" },
                    { label: "Vegan Diet", value: "vegan diet" },
                    { label: "Vegetarian Diet", value: "vegetarian diet" },
                    { label: "Renal Diet", value: "renal diet" },
                  ]}
                />
              </div>
            </div>
            <div className="form-section" style={{ background: '##038ba4', color: '#fff', fontWeight: 600, margin: '20px 0 10px 0' }}>Meals Configuration</div>
            <div className="grid-two-cols">
              {(['breakfast', 'brunch', 'lunch', 'evening', 'dinner'] as MealType[]).map(mealType => (
                  <div className="meal-card" key={mealType} style={{ minWidth: 0 }}>
                  <h3 style={{ color: '#333', fontSize: '16px', marginBottom: '10px' }}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    <button 
          type="button" 
          className="add" 
          onClick={() => addCustomPlanMealItem(mealType)}
          style={{
              padding: '8px 12px',
              fontSize: '11px',
              borderRadius: '4px',
              border: '1px solid #0d92ae',
              background: 'transparent',
              color: '#0d92ae',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              marginLeft: '10px'
            }}
        >
          + Add Item
        </button>
                  </h3>
                  {customPlanMeals[mealType].length > 0 ? (
                    <div className="meal-items" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {customPlanMeals[mealType].map((item, idx) => (
                        <div key={idx} style={{ border: '1px solid #e0e0e0', borderRadius: 6, padding: 12, background: '#fafbfc', marginBottom: 0 }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ flex: 2, maxWidth: 180 }}>
                              <FormInputType
                                name="foodItemId"
                                label="Food Item"
                                value={item.foodItemId}
                                onChange={e => updateCustomPlanMealItem(mealType, idx, 'foodItemId', e.target.value)}
                                options={foodItems.map(food => ({ label: food.name, value: food.id.toString() }))}
                              />
                            </div>
                            <div style={{ flex: 1, maxWidth: 80 }}>
                              <FormInputs
                                type="number"
                                name="quantity"
                                label="Qty"
                                value={item.quantity}
                                onChange={e => updateCustomPlanMealItem(mealType, idx, 'quantity', e.target.value)}
                              />
                            </div>
                            <div style={{ flex: 1, maxWidth: 80 }}>
                              <FormInputs
                                name="unit"
                                label="Unit"
                                value={item.unit}
                                readOnly
                                onChange={() => {}}
                              />
                            </div>
                            <button 
                              type="button" 
                              className="danger" 
                              onClick={() => removeCustomPlanMealItem(mealType, idx)}
                              style={{
                                background: 'none',
                                border: '1px solid #dc3545',
                                color: '#dc3545',
                                cursor: 'pointer',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                padding: '6px 6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                flex: '0 0 auto',
                                width: '30px',
                                height: '30px',
                                marginLeft: 8,
                                marginTop: 18
                              }}
                            >
                              ×
                            </button>
                          </div>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ flex: 1, maxWidth: 180 }}>
                              <div className="time-input-wrapper">
                                <FormInputs
                                  type="time"
                                  name="time"
                                  label="Time"
                                  value={item.time || ''}
                                  onChange={e => updateCustomPlanMealItem(mealType, idx, 'time', e.target.value)}
                                />
                              </div>
                            </div>
                            <div style={{ flex: 1, maxWidth: 80 }}>
                              <FormInputType
                                name="period"
                                label="AM/PM"
                                value={item.period || 'AM'}
                                onChange={e => updateCustomPlanMealItem(mealType, idx, 'period', e.target.value)}
                                options={[{ label: 'AM', value: 'AM' }, { label: 'PM', value: 'PM' }]}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic', margin: '10px 0 0 0' }}>
                      No items added yet. Click "Add Item" to get started.
                    </p>
                  )}
                </div>
              ))}
            </div>
             <div style={{ margin: '10px 0', fontWeight: 600, color: '#0d92ae' }}>
              <div>Total Rate: ₹{customPlanAmount || 0}</div>
            </div>
            <div style={{ margin: '10px 0', fontWeight: 600, color: '#0d92ae' }}>
              <div>Total Nutrition: Calories: {customPlanNutrition.calories} kcal, Protein: {customPlanNutrition.protein}g, Carbs: {customPlanNutrition.carbohydrates}g, Fat: {customPlanNutrition.fat}g</div>
            </div>
            <div className="form-actions">
              <ButtonWithGradient type="submit" text="Add Custom Plan"/>
                <CancelButton type='button' onClick={() => setShowCustomPlanForm(false)} text="cancel"/>
            </div>
          </form>
        </div>
      )}


      <div className="orders-table-wrapper">
        <Table
          columns={[
            { 
              key: 'serial', 
              header: 'S.No.', 
              render: (_: any, __: any, idx?: number) => (typeof idx === 'number' ? idx + 1 : '') 
            },
            { 
              key: 'patientId', 
              header: 'Patient ID', 
              render: (_: any, row: any) => row.patientId || '-' 
            },
            { 
              key: 'patient', 
              header: 'Patient', 
              render: (_: any, row: any) => row.patientName 
            },
            { 
              key: 'contactNumber', 
              header: 'Contact Number', 
              render: (_: any, row: any) => row.contactNumber || '-' 
            },
            { 
              key: 'bedWard', 
              header: 'Bed/Ward', 
              render: (_: any, row: any) => `${row.bed || '-'} / ${row.ward || '-'}` 
            },
            { 
              key: 'packageName', 
              header: 'Diet Package', 
              render: (_: any, row: any) => {
                if (row.packageName) {
                  return row.packageName;
                }
                if (row.dietPackage) {
                  // Check if it's a custom package
                  if (row.dietPackage.startsWith('custom-')) {
                    const planId = row.dietPackage.replace('custom-', '');
                    const plan = customPlans.find(p => p.id.toString() === planId);
                    return plan ? plan.packageName : 'N/A';
                  }
                  // Regular package
                  const pkg = dietPackages.find(p => p.id === row.dietPackage);
                  return pkg ? pkg.name : 'N/A';
                }
                return 'N/A';
              }
            },
            { 
              key: 'startDate', 
              header: 'Start Date', 
              render: (val: any) => new Date(val).toLocaleDateString() 
            },
            { 
              key: 'endDate', 
              header: 'End Date', 
              render: (val: any) => val ? new Date(val).toLocaleDateString() : '-' 
            },
            { 
              key: 'status', 
              header: 'Status', 
              render: (val: any, row: any) => (
                <span className={`status-badge ${row.status}`}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
              ) 
            },
            { 
              key: 'approval', 
              header: 'Approval', 
              render: (_: any, row: any) => (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {row.approvalStatus === 'pending' && (
                    <>
                      <ApproveButton 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleApprove(row.id); 
                        }} 
                        size={12} 
                      />
                      <RejectButton 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleReject(row.id); 
                        }} 
                        size={12} 
                      />
                    </>
                  )}
                  {row.approvalStatus === 'approved' && (
                    <span style={{ color: '#219653', fontWeight: 600, fontSize: 12 }}>
                      Approved
                    </span>
                  )}
                  {row.approvalStatus === 'rejected' && (
                    <span style={{ color: '#b71c1c', fontWeight: 600, fontSize: 12 }}>
                      Rejected
                    </span>
                  )}
                </div>
              ) 
            },
            { 
              key: 'pauseRestart', 
              header: 'Pause/Restart', 
              render: (_: any, row: any) => (
                row.approvalStatus === 'approved' ? (
                  <div>
                    <div className="pause-restart-container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <ButtonWithGradient 
                        className="btn-with-gradient btn-sm square-btn" 
                        onClick={() => handlePause(row.id)} 
                        aria-label="Pause"
                      >
                        <FiPause size={12} />
                      </ButtonWithGradient>
                      <ButtonWithGradient 
                        className="btn-with-gradient btn-sm square-btn" 
                        onClick={() => handleRestart(row.id)} 
                        aria-label="Restart"
                      >
                        <FiSquare size={12} />
                      </ButtonWithGradient>
                    </div>
                    <div>
                      {row.status === 'paused' && row.pauseDate && (
                        <div style={{ fontSize: 10, color: '#b71c1c', marginTop: 2 }}>
                          Paused: {new Date(row.pauseDate).toLocaleString()}
                        </div>
                      )}
                      {row.status === 'active' && row.restartDate && row.approvalStatus === 'approved' && (
                        <div style={{ fontSize: 10, color: '#219653', marginTop: 2 }}>
                          Restarted: {new Date(row.restartDate).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ) : <span style={{ color: '#aaa', fontSize: 12 }}>Only for approved</span>
              ) 
            },
            { 
              key: 'actions', 
              header: 'Actions', 
              render: (_: any, row: any) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <EditButton onClick={() => handleEdit(row.id)} />
                  <DeleteButton onClick={() => handleDelete(row.id)} />
                  <button 
                    onClick={() => handleView(row.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#2196f3',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.1)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    title="View Details"
                  >
                    {/* <FiEye size={16} /> */}
                  </button>
                </div>
              ) 
            },
          ]}
          data={pendingOrders.filter(order =>
            Object.values(order).some(val =>
              val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
          )}
        />
      </div>


      {showReviewModal && selectedOrder && (
        <>
          <div className="modal-overlay" onClick={() => setShowReviewModal(false)} />
          <div className="shortcuts-modal" style={{ maxWidth: 900, width: '90%', minHeight: 400, overflowY: 'auto'}}>
            <div className="modal-header" style={{ borderBottom: 'none' }}>
              <h2>REVIEW ORDER - {selectedOrder.patientName}</h2>
              <button className="close-btn" onClick={() => setShowReviewModal(false)} aria-label="Close">×</button>
            </div>
            <div className="review-content" style={{ borderTop: '3px solid #0d92ae',borderTopLeftRadius: '6px',borderTopRightRadius: '6px' }}>
              <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <FormInputs label="Patient ID" name="patientId" value={selectedOrder.patientId} readOnly onChange={() => {}} />
                </div>
                <div style={{ flex: 1 }}>
                  <FormInputs label="Patient Name" name="patientName" value={selectedOrder.patientName} readOnly onChange={() => {}} />
                </div>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <FormInputs label="Age" name="age" value={`${selectedOrder.age}`} readOnly onChange={() => {}} />
                </div>
                <div style={{ flex: 1 }}>
                  <FormInputs label="Contact Number" name="contactNumber" value={`${selectedOrder.contactNumber}`} readOnly onChange={() => {}} />
                </div>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                <FormInputs label="Bed" name="bed" value={selectedOrder.bed || ''} readOnly onChange={() => {}} />
                </div>
                <div style={{ flex: 1 }}>
                  <FormInputs label="Ward" name="ward" value={selectedOrder.ward || ''} readOnly onChange={() => {}} />
                 
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                <FormInputType
                    label="Diet Package"
                    name="dietPackage"
                    value={isEditing ? editingPackageId : selectedPackage?.id || ''}
                    onChange={handlePackageChange}
                    options={[
                      ...dietPackages.map(pkg => ({ value: pkg.id, label: `${pkg.name} (${pkg.type})` })),
                      ...customPlans.map(plan => ({ value: `custom-${plan.id}`, label: `Custom: ${plan.packageName} (${plan.dietType})` }))
                    ]}
                  />
                </div>
                <div style={{ flex: 1 }}>
                   <FormInputType
                    label="Package Type"
                    name="packageType"
                    value={isEditing ? (selectedPackage?.type || '') : (selectedPackage?.type || 'N/A')}
                    onChange={isEditing ? (e => {
                      // update selectedPackage type if needed
                      const newType = e.target.value;
                      if (selectedPackage) selectedPackage.type = newType;
                    }) : (() => {})}
                    options={Array.from(new Set(dietPackages.map(pkg => ({ value: pkg.type, label: pkg.type })))).filter(o => o.value)}
                  />
                </div>
              </div>
              
              {selectedPackage && (
                <div className="meal-items-section">
                  <h4>Meal Items</h4>
                  {(['breakfast', 'brunch', 'lunch', 'evening', 'dinner'] as MealType[]).map((mealType) => {
                    const items = selectedPackage[mealType as keyof DietPackage] as any[];
                    if (!items || items.length === 0) return null;
                   
                    return (
                      <div key={mealType} className="meal-type">
                        <h5>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h5>
                        <table className="meal-items-table">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Quantity</th>
                              <th>Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, index) => (
                              <tr key={`${mealType}-${index}`}>
                                <td>{item.foodItemName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="form-row" style={{maxWidth:'50%', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
                <AddressInput
                  label="Dietician Instructions"
                  name="dieticianInstructions"
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="Enter special instructions (e.g., no sugar, soft food)"
                />
              </div>
              <div className="form-actions">
                {isEditing ? (
                  <>
                    <ButtonWithGradient onClick={handleSaveChanges}>
                      Save Changes
                    </ButtonWithGradient>
                    <CancelButton onClick={handleCancelEdit} text="Cancel" />
                  </>
                ) : (
                  <>
                    {/* <ButtonWithGradient onClick={handleEditClick}>
                      Change Package
                    </ButtonWithGradient> */}
                    <ButtonWithGradient onClick={handleSaveChanges}>
                      Save Changes
                    </ButtonWithGradient>
                    <CancelButton onClick={() => setShowReviewModal(false)} text="Close" />
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    {/* </div> */}
    </PageContainer>
    <Footer/>
    </>
  );
}
export default DieticianInterface;
