import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import FormInputs from '../components/Input';
import FormInputType from '../components/Inputtype';
import ButtonWithGradient from '../components/button';
import SectionHeading from '../components/SectionHeading';
import { useFood } from '../context/FoodContext';
import '../styles/Fooditem.css';

interface FoodItemProps {
    sidebarCollapsed?: boolean;
    toggleSidebar?: () => void;
}

const FoodItemForm: React.FC<FoodItemProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
    const { id } = useParams<{ id?: string }>();
    const isEditMode = Boolean(id);
    const [foodType, setFoodType] = useState('');

    const { addFoodItem, editFoodItem, getFoodItem } = useFood();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        foodType: '',
        category: '',
        unit: '',
        quantity: '',
        calories: '',
        protein: '',
        carbohydrates: '',
        fat: '',
        price: '',
        pricePerUnit: '',
    });

    useEffect(() => {
        if (isEditMode && id) {
            const item = getFoodItem(id);
            if (item) {
                const { id: _, ...rest } = item;
                setFormData(rest);
                setFoodType(rest.foodType);
            }
        }
    }, [id, isEditMode, getFoodItem]);

    useEffect(() => {
        const quantityNum = Number(formData.quantity);
        const priceNum = Number(formData.price);
        const pricePerUnit = (!isNaN(quantityNum) && quantityNum > 0 && !isNaN(priceNum)) ? (priceNum / quantityNum).toFixed(2) : '';
        setFormData(prev => ({ ...prev, pricePerUnit }));
    }, [formData.quantity, formData.price]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'foodType') {
            setFoodType(value);
        }
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check for required fields
        const requiredFields = [
            'name', 'foodType', 'category', 'unit', 'quantity', 'price',
            'calories', 'protein', 'carbohydrates', 'fat'
        ];
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
        
        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }
        
        // Validate numeric fields
        const numericFields = ['quantity', 'calories', 'protein', 'carbohydrates', 'fat', 'price'];
        const invalidNumericFields = numericFields.filter(field => {
            const value = formData[field as keyof typeof formData];
            return isNaN(Number(value)) || value === '';
        });
        
        if (invalidNumericFields.length > 0) {
            toast.error(`Please enter valid numbers for: ${invalidNumericFields.join(', ')}`);
            return;
        }
        
        // Ensure all nutritional values are non-negative
        const nutritionalFields = ['calories', 'protein', 'carbohydrates', 'fat'];
        const negativeValues = nutritionalFields.filter(field => {
            const value = Number(formData[field as keyof typeof formData]);
            return value < 0;
        });
        
        if (negativeValues.length > 0) {
            toast.error(`Nutritional values cannot be negative: ${negativeValues.join(', ')}`);
            return;
        }
        
        try {
            if (isEditMode && id) {
                editFoodItem(id, formData);
                toast.info('Food item updated successfully!');
            } else {
                addFoodItem(formData);
                toast.success('Food item added successfully!');
            }
        
            if (!isEditMode) {
                setFormData({
                    name: '',
                    foodType: '',
                    category: '',
                    unit: '',
                    quantity: '',
                    calories: '',
                    protein: '',
                    carbohydrates: '',
                    fat: '',
                    price: '',
                    pricePerUnit: '',
                });
                setFoodType('');
            }
            
            setTimeout(() => {
                navigate('/fooditemdata');
            }, 50);
        } catch (error) {
            console.error('Error saving food item:', error);
            toast.error('Failed to save food item. Please try again.');
        }
    };

   

    return (
        <>
            <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator/>
            <PageContainer>
                <SectionHeading title="Add Food Item" subtitle="Enter details of the food item below" />
              <div className="form-section3">
                <form  onSubmit={handleSubmit}>
                    <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',marginBottom:'10px' }}>
                        <div style={{ flex: 1 }}>
                            <FormInputs 
                            label="Food Item Name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            placeholder="Enter food item name" 
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormInputType 
                            label="Food Type" 
                            name="foodType" 
                            value={foodType} 
                            onChange={handleInputChange} 
                            options={[
                                { label: "Solid", value: "Solid" },
                                { label: "Liquid", value: "Liquid" },
                                { label: "Semi-Solid", value: "Semi-Solid" }
                            ]}
                            />
                        </div>
                    </div>
                    {/* Second Row */}
                    <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' ,marginBottom:'10px' }}>
                        <div style={{ flex: 1 }}>
                            <FormInputType 
                                label="Food Category" 
                                name="category" 
                                value={formData.category} 
                                onChange={handleInputChange} 
                                options={[
                                    { label: "Vegetables", value: "Vegetables" },
                                    { label: "Fruits", value: "Fruits" },
                                    { label: "Grains", value: "Grains" },
                                    { label: "Poultry", value: "Poultry" },
                                    { label: "Legumes & Pulses", value: "Legumes & Pulses" },
                                    { label: "Spices", value: "Spices" },
                                    { label: "Dairy", value: "Dairy" },
                                    { label: "Nuts & Seeds", value: "Nuts & Seeds" },
                                    { label: "Meat", value: "Meat" },
                                    { label: "Seafood", value: "Seafood" },
                                    {label: "Sweets & Snacks", value: "Sweets & Snacks"},
                                    {label: "Spices & Condiments", value: "Spices & Condiments"},
                                    {label: "Non-veg", value: "Non-veg"},
                            
                                    // { label: "Other", value: "Other" }
                                ]}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FormInputType 
                                label="Unit" 
                                name="unit" 
                                value={formData.unit} 
                                onChange={handleInputChange} 
                                options={[
                                    {label:"Litre", value:"Litre"},
                                    {label:"Millilitre", value:"Millilitre"},
                                    {label:"Gram", value:"Gram"},
                                    {label: "Kilogram", value:"Kilogram"},
                                    {label:"Piece", value:"Piece"},
                                    {label:"Cup", value:"Cup"},
                                    {label:"Plate", value:"Plate"},
                                    {label:"Bowl", value:"Bowl"},
                                    {label:"Tablespoon", value:"Tablespoon"},
                                    {label:"Teaspoon", value:"Teaspoon"},
                                    {label:"Glass", value:"Glass"}
                                   
                                ]}
                            />
                        </div>
                    </div>

                    <div className="quantity-container">
                        <FormInputs 
                            label="Quantity" 
                            name="quantity" 
                            value={formData.quantity} 
                            onChange={handleInputChange} 
                            placeholder="Enter quantity" 
                        />
                    </div>

                    {/* Nutritional Info Header */}
                    <div className="sub-header1">Nutritional Information</div>

                    {/* Nutritional Input Section */}
                    <div className="nutritional-section">
                        <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <FormInputs label="Calories" name="calories" value={formData.calories} onChange={handleInputChange} placeholder="Enter calories" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <FormInputs label="Protein" name="protein" value={formData.protein} onChange={handleInputChange} placeholder="Enter protein" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <FormInputs label="Carbohydrates" name="carbohydrates" value={formData.carbohydrates} onChange={handleInputChange} placeholder="Enter carbohydrates" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <FormInputs label="Fat" name="fat" value={formData.fat} onChange={handleInputChange} placeholder="Enter fat" />
                            </div>
                        </div>
                        <FormInputs label="Price" name="price" value={formData.price} onChange={handleInputChange} placeholder="Enter price" />
                        <FormInputs label="Price Per Unit" name="pricePerUnit" value={formData.pricePerUnit} onChange={() => {}} placeholder="Price per unit" readOnly />
                    </div>
                 
                    <ButtonWithGradient text={isEditMode ? "Update Food Item" : "Add Food Item"} type="submit" />
                </form>
              </div>
            </PageContainer>
            <Footer />
        </>
    );
};

export default FoodItemForm;
