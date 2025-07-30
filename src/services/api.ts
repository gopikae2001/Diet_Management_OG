const API_BASE_URL = 'http://192.168.50.90:3001';


export interface DietOrder {
  id: string;
  patientName: string;
  patientId: string;
  contactNumber: string;
  email: string;
  address: string;
  bloodGroup: string;
  tokenNo: string;
  visitId: string;
  age: string;
  gender: string; // Added for patient gender
  bed: string;
  ward: string;
  floor: string;
  doctor: string;
  dietPackage: string;
  packageRate: string;
  startDate: string;
  endDate: string;
  doctorNotes: string;
  status: 'active' | 'paused' | 'stopped';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  patientType: string; // Added for patient type (OP/IP)
  dieticianInstructions?: string;
}

export interface DietPackage {
  id: string;
  name: string;
  type: string;
  breakfast: MealItem[];
  brunch: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  evening: MealItem[];
  totalRate: number;
  totalNutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
}

export interface MealItem {
  foodItemId: string;
  foodItemName: string;
  quantity: number;
  unit: string;
  time?: string;
  period?: 'AM' | 'PM';
}

export interface DietRequest {
  id: string;
  patientId: string;
  patientName: string;
  age: string;
  gender: string;
  contactNumber: string;
  email: string;
  address: string;
  bloodGroup: string;
  tokenNo: string;
  visitId: string;
  bed: string;
  ward: string;
  floor: string;
  doctor: string;
  doctorNotes: string;
  status: 'Pending' | 'Diet Order Placed' | 'Rejected';
  approval: string;
  patientType: string;
  date: string;
  requestedTime?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  foodType: string;
  category: string;
  unit: string;
  quantity: string;
  calories: string;
  protein: string;
  carbohydrates: string;
  fat: string;
  price: string;
  pricePerUnit: string;
}

export interface CanteenOrder {
  id: string;
  patientName: string;
  bed: string;
  ward: string;
  dietPackageName: string;
  dietType: string;
  foodItems: string[];
  specialNotes: string;
  status: 'pending' | 'active' | 'paused' | 'stopped' | 'prepared' | 'preparing' | 'delivered';
  prepared: boolean;
  delivered: boolean;
  dieticianInstructions?: string;
  mealItems?: Record<string, MealItem[]>;
}

export interface CustomPlan {
  id: string;
  packageName: string;
  dietType: string;
  meals: Record<string, any[]>;
  amount: number;
}

// Generic API functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Diet Orders API
export const dietOrdersApi = {
  getAll: async () => {
    const response = await apiCall('dietOrders');
    if (Array.isArray(response)) {
      return response.map(mapDietOrderFromBackend);
    }
    return response;
  },
  getById: async (id: string) => {
    const response = await apiCall(`dietOrders/${id}`);
    return mapDietOrderFromBackend(response);
  },
  create: (order: Omit<DietOrder, 'id'>) =>
    apiCall('dietOrders', {
      method: 'POST',
      body: JSON.stringify(mapDietOrderToBackend(order)),
    }),
  update: (id: string, order: Partial<DietOrder>) =>
    apiCall(`dietOrders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(mapDietOrderToBackend(order)),
    }),
  delete: (id: string) =>
    apiCall(`dietOrders/${id}`, { method: 'DELETE' }),
};

// Diet Packages API
export const dietPackagesApi = {
  getAll: () => apiCall('dietPackages'),
  getById: (id: string) => apiCall(`dietPackages/${id}`),
  create: (pkg: Omit<DietPackage, 'id'>) =>
    apiCall('dietPackages', {
      method: 'POST',
      body: JSON.stringify({ ...pkg, id: Date.now().toString() }),
    }),
  update: (id: string, pkg: Partial<DietPackage>) =>
    apiCall(`dietPackages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(pkg),
    }),
  delete: (id: string) =>
    apiCall(`dietPackages/${id}`, { method: 'DELETE' }),
};

// Diet Requests API
export const dietRequestsApi = {
  getAll: () => apiCall('dietRequests'),
  getById: (id: string) => apiCall(`dietRequests/${id}`),
  create: (request: Omit<DietRequest, 'id'>) =>
    apiCall('dietRequests', {
      method: 'POST',
      body: JSON.stringify({ ...request, id: Date.now().toString() }),
    }),
  update: (id: string, request: Partial<DietRequest>) =>
    apiCall(`dietRequests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    }),
  delete: (id: string) =>
    apiCall(`dietRequests/${id}`, { method: 'DELETE' }),
};

// Map frontend fields to backend MSSQL fields
function mapFoodItemToBackend(item: any) {
  return {
    FI_name: item.name,
    FI_foodType: item.foodType,
    FI_category: item.category,
    FI_unit: item.unit,
    FI_quantity: item.quantity,
    FI_price: item.price,
    FI_priceperunit: item.pricePerUnit,
    // Add other fields as needed
  };
}
// Food Items API
export const foodItemsApi = {
  getAll: () => apiCall('foodItems'),
  getById: (id: string) => apiCall(`foodItems/${id}`),
  create: (item: Omit<FoodItem, 'id'>) =>
    apiCall('foodItems', {
      method: 'POST',
      body: JSON.stringify(mapFoodItemToBackend(item)),
    }),
  update: (id: string, item: Partial<FoodItem>) =>
    apiCall(`foodItems/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(mapFoodItemToBackend(item)),
    }),
  delete: (id: string) =>
    apiCall(`foodItems/${id}`, { method: 'DELETE' }),
};

// Canteen Orders API
export const canteenOrdersApi = {
  getAll: () => apiCall('canteenOrders'),
  getById: (id: string) => apiCall(`canteenOrders/${id}`),
  create: (order: Omit<CanteenOrder, 'id'>) =>
    apiCall('canteenOrders', {
      method: 'POST',
      body: JSON.stringify({ ...order, id: Date.now().toString() }),
    }),
  update: (id: string, order: Partial<CanteenOrder>) =>
    apiCall(`canteenOrders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(order),
    }),
  delete: (id: string) =>
    apiCall(`canteenOrders/${id}`, { method: 'DELETE' }),
};

// Custom Plans API
export const customPlansApi = {
  getAll: () => apiCall('customPlans'),
  getById: (id: string) => apiCall(`customPlans/${id}`),
  create: (plan: Omit<CustomPlan, 'id'>) =>
    apiCall('customPlans', {
      method: 'POST',
      body: JSON.stringify({ ...plan, id: Date.now().toString() }),
    }),
  update: (id: string, plan: Partial<CustomPlan>) =>
    apiCall(`customPlans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(plan),
    }),
  delete: (id: string) =>
    apiCall(`customPlans/${id}`, { method: 'DELETE' }),
}; 

// Add Food Intake API
export const addFoodIntakeApi = {
  getAll: () => apiCall('AddFoodIntake'),
  getById: (id: string) => apiCall(`AddFoodIntake/${id}`),
  create: (entry: any) =>
    apiCall('AddFoodIntake', {
      method: 'POST',
      body: JSON.stringify({ ...entry, id: Date.now().toString() }),
    }),
  update: (id: string, entry: any) =>
    apiCall(`AddFoodIntake/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(entry),
    }),
  delete: (id: string) =>
    apiCall(`AddFoodIntake/${id}`, { method: 'DELETE' }),
}; 

// Add Diet Request Approval API
export const dietRequestApprovalApi = {
  getAll: () => apiCall('dietRequestApproval'),
  getById: (id: string) => apiCall(`dietRequestApproval/${id}`),
  create: (entry: any) =>
    apiCall('dietRequestApproval', {
      method: 'POST',
      body: JSON.stringify({ ...entry, id: Date.now().toString() }),
    }),
  update: (id: string, entry: any) =>
    apiCall(`dietRequestApproval/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(entry),
    }),
  delete: (id: string) =>
    apiCall(`dietRequestApproval/${id}`, { method: 'DELETE' }),
}; 

// Map frontend DietOrder fields to backend MSSQL fields
function mapDietOrderToBackend(order: any) {
  return {
    DO_patientName: order.patientName,
    DO_patientId: order.patientId,
    DO_contactNumber: order.contactNumber,
    DO_age: order.age,
    DO_bed: order.bed,
    DO_ward: order.ward,
    DO_floor: order.floor,
    DO_doctor: order.doctor,
    DO_dietPackage: order.dietPackage,
    DO_packageRate: parseFloat(order.packageRate) || 0,
    DO_startDate: order.startDate,
    DO_endDate: order.endDate,
    DO_doctorNotes: order.doctorNotes,
    DO_status: order.status || 'pending',
    DO_approvalStatus: order.approvalStatus || 'pending',
    DO_dieticianInstructions: order.dieticianInstructions,
    DO_gender: order.gender,
    DO_patientType: order.patientType,
    DO_email: order.email,
    DO_address: order.address,
    DO_bloodGroup: order.bloodGroup,
    DO_tokenNo: order.tokenNo,
    DO_visitId: order.visitId,
    DO_added_by: 'frontend',
    DO_outlet_fk: 'OUTLET001'
  };
}

// Map backend MSSQL fields to frontend DietOrder fields
function mapDietOrderFromBackend(order: any) {
  return {
    id: order.DO_ID_PK?.toString() || order.id?.toString() || '',
    patientName: order.DO_patientName,
    patientId: order.DO_patientId,
    contactNumber: order.DO_contactNumber,
    age: order.DO_age,
    bed: order.DO_bed,
    ward: order.DO_ward,
    floor: order.DO_floor,
    doctor: order.DO_doctor,
    dietPackage: order.DO_dietPackage,
    packageRate: order.DO_packageRate?.toString() || '0',
    startDate: order.DO_startDate,
    endDate: order.DO_endDate,
    doctorNotes: order.DO_doctorNotes,
    status: order.DO_status,
    approvalStatus: order.DO_approvalStatus,
    dieticianInstructions: order.DO_dieticianInstructions,
    gender: order.DO_gender,
    patientType: order.DO_patientType,
    email: order.DO_email,
    address: order.DO_address,
    bloodGroup: order.DO_bloodGroup,
    tokenNo: order.DO_tokenNo,
    visitId: order.DO_visitId
  };
} 