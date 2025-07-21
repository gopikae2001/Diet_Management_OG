import { useState, useEffect } from "react";
import "../styles/canteen.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import PageContainer from "../components/PageContainer";
import FormInputType from "../components/Inputtype";
import Table from "../components/Table";
import DeleteButton from "../components/DeleteButton";
import { canteenOrdersApi, dietPackagesApi } from '../services/api';
import type { CanteenOrder, DietPackage } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatusBadge from '../components/StatusBadge';
import FormDateInput from "../components/Date";
import FormInputs from "../components/Input";
import Searchbar from "../components/Searchbar";


type Status = "pending" | "active" | "paused" | "stopped" | "preparing" | "delivered";


interface CanteenInterfaceProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}


const CanteenInterface: React.FC<CanteenInterfaceProps> = ({ sidebarCollapsed, toggleSidebar }) => {
  const [selectedMeal, setSelectedMeal] = useState<string>("breakfast");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [mealOrders, setMealOrders] = useState<CanteenOrder[]>([]);
  const [dietPackages, setDietPackages] = useState<DietPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  // Load orders and packages from API
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const [orders, packages] = await Promise.all([
        canteenOrdersApi.getAll(),
        dietPackagesApi.getAll()
      ]);
      setMealOrders(orders);
      setDietPackages(packages);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    loadOrders();
  }, [selectedMeal]);




  // Update order status in API
  const updateOrderStatus = async (id: string, status: Status) => {
    try {
      const orderToUpdate = mealOrders.find(order => order.id === id);
      if (!orderToUpdate) return;

      const updatedOrder = {
        ...orderToUpdate,
        status: status
      };

      await canteenOrdersApi.update(id, updatedOrder);
      await loadOrders(); // Reload orders
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleMarkActive = (id: string) => {
    updateOrderStatus(id, 'active');
  };

  const handleMarkpreparing = (id: string) => {
    updateOrderStatus(id, 'preparing');
  };

  const handleMarkDelivered = (id: string) => {
    updateOrderStatus(id, 'delivered');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await canteenOrdersApi.delete(id);
        await loadOrders(); // Reload orders
        toast.error('Order deleted successfully');
      } catch (error) {
        console.error('Failed to delete order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  // Helper to format time as 12-hour clock with AM/PM
  const formatTime12Hour = (time: string, period?: string) => {
    if (!time) return '';
    let [h, m] = time.split(':');
    let hour = parseInt(h, 10);
    let minute = m || '00';
    let ampm = 'AM';
    if (period) {
      ampm = period.toUpperCase();
    } else if (hour >= 12) {
      ampm = 'PM';
    }
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${hour}:${minute.padStart(2, '0')} ${ampm}`;
  };

  // Get meal-specific food items for an order
  const getMealSpecificItems = (order: CanteenOrder) => {
    // Find the diet package for this order
    const dietPackage = dietPackages.find(pkg => pkg.name === order.dietPackageName);

    if (dietPackage && dietPackage[selectedMeal as keyof DietPackage]) {
      const mealItems = dietPackage[selectedMeal as keyof DietPackage] as any[];
      return mealItems.map(item => {
        let timeStr = '';
        if (item.time) {
          timeStr = ` (${formatTime12Hour(item.time, item.period)})`;
        }
        return `${item.foodItemName} - ${item.quantity} ${item.unit}${timeStr}`;
      });
    }

    // Fallback to all food items if no meal-specific data
    return order.foodItems || [];
  };

  // Calculate total quantities for the selected meal and date
  const totalQuantities = mealOrders
    .filter(order => {
      const o = order as any;
      if (selectedMeal === 'all') {
        return o.date === selectedDate;
      }
      return (
        (o.category || '').toLowerCase() === selectedMeal.toLowerCase() &&
        (o.date === selectedDate)
      );
    })
    .reduce((acc, order) => {
      const o = order as any;
      const itemName = o.fooditem;
      const quantity = parseFloat(o.intake_amount) || 0;
      const unit = o.unit || '';
      if (!itemName) return acc;
      if (acc[itemName]) {
        acc[itemName].quantity += quantity;
      } else {
        acc[itemName] = { quantity, unit };
      }
      return acc;
    }, {} as Record<string, { quantity: number; unit: string }>);

  // Filtering logic for table
  const filteredOrders = mealOrders.filter(order => {
    const o = order as any;
    // Date filter
    let dateMatch = true;
    if (fromDate) {
      dateMatch = false;
      if (o.date) {
        const itemDate = o.date.split('T')[0] || o.date.split(' ')[0] || o.date;
        if (itemDate >= fromDate) dateMatch = true;
      }
    }
    if (toDate) {
      if (o.date) {
        const itemDate = o.date.split('T')[0] || o.date.split(' ')[0] || o.date;
        if (itemDate > toDate) dateMatch = false;
      }
    }
    // Approval status filter
    let approvalMatch = true;
    if (approvalStatus) {
      approvalMatch = o.status === approvalStatus;
    }
    // Search filter
    let searchMatch = true;
    if (searchTerm) {
      searchMatch = Object.values(o).some(val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Meal type filter
    let mealMatch = true;
    if (selectedMeal !== 'all') {
      mealMatch = (o.category || '').toLowerCase() === selectedMeal.toLowerCase();
    }
    // Date selection filter (for selectedDate)
    let selectedDateMatch = true;
    if (selectedDate) {
      selectedDateMatch = o.date === selectedDate;
    }
    return dateMatch && approvalMatch && searchMatch && mealMatch && selectedDateMatch;
  });


  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showCalculator showDate showTime />
      <PageContainer>
        {/* <div className="canteen-container"> */}
        {/* <div className="header"> */}
        <SectionHeading title="Canteen Interface" subtitle="Meal preparation and delivery management" />

        <form >
          <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '20px', width: '60%'}}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <FormInputType
                label="Select Meal type"
                name="mealType"
                value={selectedMeal}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMeal(e.target.value)}
                options={[
                  { label: "All Meal", value: "all" },
                  { label: "Breakfast", value: "breakfast" },
                  { label: "Brunch", value: "brunch" },
                  { label: "Lunch", value: "lunch" },
                  { label: "Evening", value: "evening" },
                  { label: "Dinner", value: "dinner" },
                ]}
              />
            </div>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <FormDateInput
                label="Select Date"
                name="date"
                value={selectedDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}

              />
            </div>
            {/* <div style={{flex: 1, minWidth: '100px', marginLeft: '17rem'}}>
              <FormDateInput
                label="To Date"
                name="toDate"
                value={toDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToDate(e.target.value)}
              />
            </div>
            <div style={{ minWidth: '220px', width: '20%', marginLeft: '17rem' }}>
              <FormInputType
                label="Approval Status"
                name="approvalStatus"
                value={approvalStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setApprovalStatus(e.target.value)}
                options={[
                  { value: '', label: 'All' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'active', label: 'Active' },
                  { value: 'preparing', label: 'Preparing' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'paused', label: 'Paused' },
                  { value: 'stopped', label: 'Stopped' },
                ]}
              />
            </div> */}

          </div>
        </form>






        {/* <div className="form-row1" style={{ flexWrap: 'wrap', gap: '1.5rem' }} >
          <div className="form-group1">
            <FormInputType
              label="Select Meal type"
              name="mealType"
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value)}
              options={[
                { label: "All Meal", value: "all" },
                { label: "Breakfast", value: "breakfast" },
                { label: "Brunch", value: "brunch" },
                { label: "Lunch", value: "lunch" },
                { label: "Evening", value: "evening" },
                { label: "Dinner", value: "dinner" },


              ]}
            />
          </div>
          <div className="form-group1">
            <FormDateInput
              label="Select Date"
              name="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}

            />
          </div>
        </div> */}






        <div className="header">Total Quantity Summary - {selectedMeal.toUpperCase()}</div>
        <div className="card grid mb-4">
          {Object.entries(totalQuantities).map(([item, itemData]) => (
            <div key={item} className="summary-box">
              <div className="item-name">{item}</div>
              <div className="item-quantity">{itemData.quantity} {itemData.unit}</div>
            </div>
          ))}
        </div>


        <div className="header">Patient Meal Orders - {selectedMeal.toUpperCase()}</div>

        {/* Filter controls - improved UI, all in one row with searchbar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-end',
          margin: '20px 0',
          padding: '18px 20px',
          borderRadius: '10px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          background: '#f8fafc',
        }}>
          <div style={{ display: 'flex', gap: '16px', flex: 1, minWidth: 0 }}>
            <FormDateInput
              label="From Date"
              name="fromDate"
              value={fromDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFromDate(e.target.value)}
            />
            <FormDateInput
              label="To Date"
              name="toDate"
              value={toDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToDate(e.target.value)}
            />
            <div style={{ minWidth: '220px', width: '20%' }}>
              <FormInputType
                label="Approval Status"
                name="approvalStatus"
                value={approvalStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setApprovalStatus(e.target.value)}
                options={[
                  { value: '', label: 'All' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'active', label: 'Active' },
                  { value: 'preparing', label: 'Preparing' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'paused', label: 'Paused' },
                  { value: 'stopped', label: 'Stopped' },
                ]}
              />
            </div>
          </div>
          <div style={{ minWidth: 220, flex: '0 0 250px' }}>
            <Searchbar
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
            />
          </div>
        </div>

        <div className="card">
          {isLoading ? (
            <div className="loading">Loading orders...</div>
          ) : (
            <Table
              data={filteredOrders
                .map((order, index) => {
                  const o = order as any;
                  return {
                    serialNo: index + 1,
                    patientId: o.patientId || '',
                    patientName: o.patientName || '',
                    contactNumber: o.contactNumber || '',
                    day: o.day || '',
                    date: o.date || '',
                    category: o.category || '',
                    fooditem: o.fooditem || '',
                    intake_amount: o.intake_amount || '',
                    end_date: o.end_date || '',
                    status: o.status || 'pending',
                    id: o.id,
                  };
                })}
              columns={[
                { key: 'serialNo', header: 'S.No' },
                { key: 'day', header: 'Day' },
                { key: 'date', header: 'Date' },
                { key: 'patientId', header: 'Patient ID' },
                { key: 'patientName', header: 'Patient Name' },
                { key: 'contactNumber', header: 'Contact Number' },
                { key: 'category', header: 'Category' },
                { key: 'fooditem', header: 'Food Item' },
                { key: 'intake_amount', header: 'Intake Amount' },
                { key: 'end_date', header: 'End Date' },
                {
                  key: 'status', header: 'Status', render: (v, row) => {
                    let label = 'Pending';
                    let status = 'pending';
                    if (row?.status === 'preparing' || row?.status === 'preparing') {
                      label = 'preparing';
                      status = 'preparing';
                    } else if (row?.status === 'delivered') {
                      label = 'Delivered';
                      status = 'delivered';
                    } else if (row?.status === 'active') {
                      label = 'Active';
                      status = 'active';
                    } else if (row?.status === 'paused') {
                      label = 'Paused';
                      status = 'paused';
                    } else if (row?.status === 'stopped') {
                      label = 'Stopped';
                      status = 'stopped';
                    }
                    return <StatusBadge label={label} status={status} />;
                  }
                },
                {
                  key: 'approval', header: 'Approval', render: (_v, row = {}) => {
                    const ispreparing = row.status === 'preparing';
                    const isDelivered = row.status === 'delivered';
                    return (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <StatusBadge
                          label="preparing"
                          status={ispreparing ? 'preparing' : 'preparing'}
                          active={ispreparing}
                          disabled={isDelivered}
                          onClick={() => {
                            if (!ispreparing && !isDelivered) handleMarkpreparing(row.id);
                          }}
                        />
                        <StatusBadge
                          label="Delivered"
                          status={isDelivered ? 'delivered' : 'delivered'}
                          active={isDelivered}
                          disabled={!ispreparing || isDelivered}
                          onClick={() => {
                            if (ispreparing && !isDelivered) handleMarkDelivered(row.id);
                          }}
                        />
                      </div>
                    );
                  }
                },
              ]}
            />
          )}
        </div>
        {/* </div> */}
      </PageContainer>
      <Footer />
    </>
  );
}

export default CanteenInterface;
