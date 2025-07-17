import React, { useState, useEffect } from "react";
import "../styles/DietPackageForm.css";
import Header from "../components/Header"; 
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import FormInputs from "../components/Input";
import FormInputType from "../components/Inputtype";
import ButtonWithGradient from "../components/button";
import PageContainer from "../components/PageContainer";
import { useFood } from "../context/FoodContext";
import type { FoodItem } from "../context/FoodContext";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { dietPackagesApi } from '../services/api';
import type { DietPackage } from '../services/api';
// import { foodItemApi } from "../api/foodItemApi";
// import type { FoodItem } from "../types/foodItem";

interface MealItem {
  foodItemId: string;
  foodItemName: string;
  quantity: number;
  unit: string;
  time?: string; // Added
  period?: 'AM' | 'PM'; // Added
}
interface DietPackageFormProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}


const DietPackageForm: React.FC<DietPackageFormProps> = ({ sidebarCollapsed, toggleSidebar }) => {
  const { foodItems } = useFood();
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dietPackages, setDietPackages] = useState<DietPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load packages from API
  useEffect(() => {
    const loadPackages = async () => {
      try {
        setIsLoading(true);
        const packages = await dietPackagesApi.getAll();
        setDietPackages(packages);
      } catch (error) {
        console.error('Failed to load diet packages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPackages();
  }, []);

  const filteredDietPackages = dietPackages.filter((pkg, index) => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (index + 1).toString().includes(searchLower) ||
      pkg.name.toLowerCase().includes(searchLower) ||
      pkg.type.toLowerCase().includes(searchLower) ||
      pkg.totalRate.toString().includes(searchLower) ||
      pkg.totalNutrition.calories.toString().includes(searchLower)
    );
  });

  const [formData, setFormData] = useState({ name: "", type: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [meals, setMeals] = useState({
    breakfast: [] as MealItem[],
    brunch: [] as MealItem[],
    lunch: [] as MealItem[],
    dinner: [] as MealItem[],
    evening: [] as MealItem[],
  });

  useEffect(() => {
    // If editing, pre-fill form with package data from navigation state or API
    const editId = params.id;
    if (editId) {
      let pkg = location.state?.packageData;
      if (!pkg) {
        // fallback: load from API
        pkg = dietPackages.find((p: any) => p.id === editId);
      }
      if (pkg) {
        setFormData({ name: pkg.name, type: pkg.type });
        setEditingId(pkg.id);
        setMeals({
          breakfast: pkg.breakfast || [],
          brunch: pkg.brunch || [],
          lunch: pkg.lunch || [],
          dinner: pkg.dinner || [],
          evening: pkg.evening || [],
        });
      }
    }
  }, [location.state, params.id, dietPackages]);

  const calculateTotals = () => {
    let totalRate = 0;
    let totalNutrition = { calories: 0, protein: 0, carbohydrates: 0, fat: 0 };

    const allMeals = [...meals.breakfast, ...meals.brunch, ...meals.lunch, ...meals.dinner, ...meals.evening];

    allMeals.forEach((meal) => {
      const foodItem = foodItems.find((item) => item.id === meal.foodItemId);
      if (foodItem) {
        totalRate += Number(foodItem.price) * meal.quantity;
        totalNutrition.calories += Number(foodItem.calories) * meal.quantity;
        totalNutrition.protein += Number(foodItem.protein) * meal.quantity;
        totalNutrition.carbohydrates += Number(foodItem.carbohydrates) * meal.quantity;
        totalNutrition.fat += Number(foodItem.fat) * meal.quantity;
      }
    });

    return { totalRate, totalNutrition };
  };

  const addMealItem = (mealType: string) => {
    const newItem: MealItem = { foodItemId: "", foodItemName: "", quantity: 1, unit: "", time: '', period: 'AM' };

    setMeals((prev) => ({
      ...prev,
      [mealType]: [...prev[mealType as keyof typeof prev], newItem],
    }));
  };

  const updateMealItem = (mealType: string, index: number, field: string, value: any) => {
    setMeals((prev) => {
      const updatedMeals = { ...prev };
      const mealArray = [...updatedMeals[mealType as keyof typeof updatedMeals]] as MealItem[];
      
      mealArray[index] = { ...mealArray[index], [field]: value };

      if (field === "foodItemId") {
        const foodItem = foodItems.find((item) => item.id === value);
        if (foodItem) {
          mealArray[index].foodItemName = foodItem.name;
          mealArray[index].unit = foodItem.unit;
        }
      }

      updatedMeals[mealType as keyof typeof updatedMeals] = mealArray as any;
      return updatedMeals;
    });
  };

  const removeMealItem = (mealType: string, index: number) => {
    setMeals((prev) => {
      const updatedMeals = { ...prev };
      const mealArray = [...updatedMeals[mealType as keyof typeof updatedMeals]] as MealItem[];
      mealArray.splice(index, 1);
      updatedMeals[mealType as keyof typeof updatedMeals] = mealArray as any;
      return updatedMeals;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { totalRate, totalNutrition } = calculateTotals();
    const packageData: Omit<DietPackage, 'id'> = {
      name: formData.name,
      type: formData.type,
      breakfast: meals.breakfast,
      brunch: meals.brunch,
      lunch: meals.lunch,
      dinner: meals.dinner,
      evening: meals.evening,
      totalRate,
      totalNutrition,
    };
    
    // Check for required fields
    const requiredFields = [
      'name', 'type'
    ];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      if (editingId) {
        await dietPackagesApi.update(editingId, packageData);
        toast.info('Diet package updated!');
      } else {
        await dietPackagesApi.create(packageData);
        toast.success('Diet package created successfully!');
      }

      // Refresh packages from API
      const updatedPackages = await dietPackagesApi.getAll();
      setDietPackages(updatedPackages);

      // Handle navigation after update/create
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate('/dietpackagelist');
      }, 100);
      
      if (!editingId) {
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save diet package:', error);
      toast.error('Failed to save diet package. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({ name: "", type: "" });
    setMeals({ breakfast: [], brunch: [], lunch: [], dinner: [], evening: [] });
    setEditingId(null);
  };

  const handleEdit = (pkg: DietPackage) => {
    setFormData({ name: pkg.name, type: pkg.type });
    setEditingId(pkg.id);
    setMeals({
      breakfast: pkg.breakfast || [],
      brunch: pkg.brunch || [],
      lunch: pkg.lunch || [],
      dinner: pkg.dinner || [],
      evening: pkg.evening || [],
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await dietPackagesApi.delete(id);
        const updatedPackages = await dietPackagesApi.getAll();
        setDietPackages(updatedPackages);
        toast.error('Diet package deleted successfully!');
      } catch (error) {
        console.error('Failed to delete diet package:', error);
        toast.error('Failed to delete diet package. Please try again.');
      }
    }
  };

  const MealSection: React.FC<{ title: string; mealType: string; items: MealItem[] }> = ({
    title,
    mealType,
    items,
  }) => (
    <div className="meal-card">
      <h3>
        {title}
        <button 
          type="button" 
          className="add" 
          onClick={() => addMealItem(mealType)}
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
      {items.length > 0 ? (
        <div className="meal-items" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item, index) => (
            <div key={index} style={{ border: '1px solid #e0e0e0', borderRadius: 6, padding: 12, background: '#fafbfc', marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ flex: 2, maxWidth: 180 }}>
                  <FormInputType
                    name="foodItemId"
                    label="Food Item"
                    value={item.foodItemId}
                    onChange={e => updateMealItem(mealType, index, 'foodItemId', e.target.value)}
                    options={foodItems.map(food => ({ label: food.name, value: food.id }))}
                  />
                </div>
                <div style={{ flex: 1, maxWidth: 80 }}>
                  <FormInputs
                    type="number"
                    name="quantity"
                    label="Qty"
                    value={item.quantity}
                    onChange={e => updateMealItem(mealType, index, 'quantity', e.target.value)}
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
                  onClick={() => removeMealItem(mealType, index)}
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
                      onChange={e => updateMealItem(mealType, index, 'time', e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        // Allow only arrow keys, tab, and backspace
                        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Backspace'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, maxWidth: 80 }}>
                  <FormInputType
                    name="period"
                    label="AM/PM"
                    value={item.period || 'AM'}
                    onChange={e => updateMealItem(mealType, index, 'period', e.target.value)}
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
  );

  const { totalRate, totalNutrition } = calculateTotals();

  return (
    <>
    <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator/>
    <PageContainer>
    {/* <div className="dietpackage-container"> */}
      {/* <div className="header"> */}
        <SectionHeading title='Diet Package' subtitle='Create your diet package'/>
      {/* </div> */}

      {/* <div className="form-section">DIET PACKAGE</div> */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
            <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
              <div style={{ flex: 1 }}>
                <FormInputs
                  label="Diet Package Name"
                  name="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter diet package name"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormInputType
                  label="Diet Type"
                  name="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  options={[
                    { label: "Regular", value: "regular" },
                    { label: "Specialized", value: "specialized" },
                    { label: "Therapeutic", value: "therapeutic" },
                    { label: "Weight Loss", value: "weight loss" },
                    { label: "Weight Gain", value: "weight gain" },
                    { label: "Maintenance", value: "maintenance" },
                    { label: "Weight Management", value: "weight management" },
                    {label: "Soft Diet", value: "soft diet"},
                    {label:"Cardiac Diet", value:"cardiac diet"},
                    {label:"High Protein Diet", value:"high protein diet"},
                    {label:"Gluten-Free Diet", value:"gluten-free diet"},
                    {label:"Gastric Diet", value:"gastric diet"},
                    {label:"Keto Diet", value:"keto diet"},
                    {label:"Low Carb Diet", value:"low carb diet"},
                    {label:"Low Fat Diet", value:"low fat diet"},
                    {label:"Low Sodium Diet", value:"low sodium diet"},
                    {label:"Low Sugar Diet", value:"low sugar diet"},
                    {label:"Paleo Diet", value:"paleo diet"},
                    {label:"Vegan Diet", value:"vegan diet"},
                    {label:"Vegetarian Diet", value:"vegetarian diet"},
                    {label:"Renal Diet", value:"renal diet"},
                  ]}
                />
              </div>
            </div>

          <div className="form-section">Meals Configuration</div>
          <div className="grid-two-cols">
            <MealSection title="Breakfast" mealType="breakfast" items={meals.breakfast} />
            <MealSection title="Brunch" mealType="brunch" items={meals.brunch} />
            <MealSection title="Lunch" mealType="lunch" items={meals.lunch} />
            <MealSection title="Evening" mealType="evening" items={meals.evening} />
            <MealSection title="Dinner" mealType="dinner" items={meals.dinner} />
           
          </div>

          <div className="total-section">
            <div>
              <strong>Total Rate:</strong> ₹{totalRate.toFixed(2)}
            </div>
            <div>
              <strong>Total Nutrition:</strong><br />
              Calories: {totalNutrition.calories.toFixed(1)}<br />
              Protein: {totalNutrition.protein.toFixed(1)}g<br />
              Carbs: {totalNutrition.carbohydrates.toFixed(1)}g<br />
              Fat: {totalNutrition.fat.toFixed(1)}g
            </div>
          </div>

          <ButtonWithGradient type="submit" text={editingId ? "Update Diet Package" : "Create Diet Package"} />
        </form>
      </div>
      

      {/* <div className="table-container">
        <div className="form-section2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="section-header2" style={{ marginBottom: 0 }}>Diet Packages List</div>
          <div className="search-container" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <i className="fa fa-search" style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999',
                fontSize: '14px'
              }}></i>
              <input
                type="text"
                placeholder="Search by name, type, rate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 8px 8px 34px',
                  width: '100%',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  backgroundColor: '#fff',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0d92ae'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
          </div>
        </div>
        <table className="dietpackage-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Package Name</th>
              <th>Diet Type</th>
              <th>Breakfast</th>
              <th>Brunch</th>
              <th>Lunch</th>
              <th>Evening</th>
              <th>Dinner</th>
              <th>Total Rate</th>
              <th>Total Calories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDietPackages.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '20px' }}>
                  {dietPackages.length === 0 
                    ? 'No diet packages available' 
                    : searchTerm 
                      ? 'No matching packages found' 
                      : 'No diet packages available'}
                </td>
              </tr>
            ) : (
              filteredDietPackages.map((pkg, index) => (
                <tr key={pkg.id}>
                  <td>{index + 1}</td>
                  <td>{pkg.name}</td>
                  <td>{pkg.type}</td>
                  <td>
                    {pkg.breakfast?.map((item: MealItem, i: number) => (
                      <div key={i} className="meal-item">
                        {item.quantity} {item.unit} {item.foodItemName}
                      </div>
                    ))}
                  </td>
                  <td>
                    {pkg.brunch?.map((item: MealItem, i: number) => (
                      <div key={i} className="meal-item">
                        {item.quantity} {item.unit} {item.foodItemName}
                      </div>
                    ))}
                  </td>
                  <td>
                    {pkg.lunch?.map((item: MealItem, i: number) => (
                      <div key={i} className="meal-item">
                        {item.quantity} {item.unit} {item.foodItemName}
                      </div>
                    ))}
                  </td>
                  <td>
                    {pkg.evening?.map((item: MealItem, i: number) => (
                      <div key={i} className="meal-item">
                        {item.quantity} {item.unit} {item.foodItemName}
                      </div>
                    ))}
                  </td>
                  <td>
                    {pkg.dinner?.map((item: MealItem, i: number) => (
                      <div key={i} className="meal-item">
                        {item.quantity} {item.unit} {item.foodItemName}
                      </div>
                    ))}
                  </td>
                  <td>₹{pkg.totalRate.toFixed(2)}</td>
                  <td>{pkg.totalNutrition.calories.toFixed(1)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-text edit" 
                        onClick={() => handleEdit(pkg)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-text reject" 
                        onClick={() => handleDelete(pkg.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div> */}
    {/* </div> */}
    </PageContainer>
    <Footer/>
    </>
  );
};

export default DietPackageForm;