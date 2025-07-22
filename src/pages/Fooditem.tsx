import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
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

const FoodItem: React.FC<FoodItemProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
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

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'foodType') {
            setFoodType(value);
        }
        setFormData({
            ...formData,
            [name]: value,
        });
        setFormErrors(prev => ({ ...prev, [name]: '' })); // Clear error on input change
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'foodType') {
            setFoodType(value);
        }
        setFormData({
            ...formData,
            [name]: value,
        });
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: { [key: string]: string } = {};
        if (!formData.name) errors.name = 'Food item name is required';
        if (!formData.foodType) errors.foodType = 'Food type is required';
        if (!formData.category) errors.category = 'Category is required';
        if (!formData.unit) errors.unit = 'Unit is required';
        if (!formData.quantity) errors.quantity = 'Quantity is required';
        if (!formData.price) errors.price = 'Price is required';
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;
        
        // Check for required fields
        // const requiredFields = [
        //     'name', 'foodType', 'category', 'unit', 'quantity', 'price'
            
        // ];
        // const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
        
        // if (missingFields.length > 0) {
        //     toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        //     return;
        // }
        
        // Validate numeric fields
        // const numericFields = ['quantity', 'calories', 'protein', 'carbohydrates', 'fat', 'price'];
        // const invalidNumericFields = numericFields.filter(field => {
        //     const value = formData[field as keyof typeof formData];
        //     return isNaN(Number(value)) || value === '';
        // });
        
        // if (invalidNumericFields.length > 0) {
        //     toast.error(`Please enter valid numbers for: ${invalidNumericFields.join(', ')}`);
        //     return;
        // }
        
        // Ensure all nutritional values are non-negative
        // const nutritionalFields = ['calories', 'protein', 'carbohydrates', 'fat'];
        // const negativeValues = nutritionalFields.filter(field => {
        //     const value = Number(formData[field as keyof typeof formData]);
        //     return value < 0;
        // });
        
        // if (negativeValues.length > 0) {
        //     toast.error(`Nutritional values cannot be negative: ${negativeValues.join(', ')}`);
        //     return;
        // }
        
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
                        <div style={{ flex: 1, borderRadius: 4 }}>
                            <FormInputs 
                                label="Food Item Name" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleInputChange} 
                                placeholder="Enter food item name" 
                                style={formErrors.name ? { border: '1.5px solid red' } : {}}
                            />
                            {formErrors.name && (
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                    {formErrors.name}
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1, borderRadius: 4 }}>
                            <FormInputType 
                                label="Food Type" 
                                name="foodType" 
                                value={foodType} 
                                onChange={handleSelectChange} 
                                options={[
                                    { label: "Solid", value: "Solid" },
                                    { label: "Liquid", value: "Liquid" },
                                    { label: "Semi-Solid", value: "Semi-Solid" }
                                ]}
                                selectStyle={formErrors.foodType ? { border: '1.5px solid red' } : {}}
                            />
                            {formErrors.foodType && (
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                    {formErrors.foodType}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Second Row */}
                    <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' ,marginBottom:'10px' }}>
                        <div style={{ flex: 1, borderRadius: 4 }}>
                            <FormInputType 
                                label="Food Category" 
                                name="category" 
                                value={formData.category} 
                                onChange={handleSelectChange} 
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
                                ]}
                                selectStyle={formErrors.category ? { border: '1.5px solid red' } : {}}
                            />
                            {formErrors.category && (
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                    {formErrors.category}
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1, borderRadius: 4 }}>
                            <FormInputType 
                                label="Unit" 
                                name="unit" 
                                value={formData.unit} 
                                onChange={handleSelectChange} 
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
                                selectStyle={formErrors.unit ? { border: '1.5px solid red' } : {}}
                            />
                            {formErrors.unit && (
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                    {formErrors.unit}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', width:'100%', marginTop:'15px' }}>
                        <div style={{flex:1, borderRadius: 4}}>
                            <FormInputs 
                                label="Quantity" 
                                name="quantity" 
                                value={formData.quantity} 
                                onChange={handleInputChange} 
                                placeholder="Enter quantity" 
                                style={formErrors.quantity ? { border: '1.5px solid red' } : {}}
                            />
                            {formErrors.quantity && (
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                    {formErrors.quantity}
                                </div>
                            )}
                        </div>
                         <div style={{ flex: 1, borderRadius: 4 }}>
                            <FormInputs 
                                label="Price" 
                                name="price" 
                                value={formData.price} 
                                onChange={handleInputChange} 
                                placeholder="Enter price" 
                                style={formErrors.price ? { border: '1.5px solid red' } : {}}
                            />
                            {formErrors.price && (
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                    {formErrors.price}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', width:'100%', marginTop:'15px', width: '50%' }}>
                    <div style={{flex:1}}>
                            <FormInputs
                                label="Price Per Unit" 
                                name="pricePerUnit" 
                                value={formData.pricePerUnit} 
                                onChange={handleInputChange} 
                                readOnly
                            />
                        </div>
                    </div>



                    {/* Nutritional Info Header */}
                    {/* <div className="sub-header2">Nutritional Information</div> */}

                    {/* Nutritional Input Section */}
                    {/* <div className="nutritional-section"> */}
                        {/* <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}> */}
                            {/* <div style={{ flex: 1 }}>
                                <FormInputs label="Calories" name="calories" value={formData.calories} onChange={handleInputChange} placeholder="Enter calories" />
                            </div> */}
                            {/* <div style={{ flex: 1 }}>
                                <FormInputs label="Protein" name="protein" value={formData.protein} onChange={handleInputChange} placeholder="Enter protein" />
                            </div> */}
                            {/* <div style={{ flex: 1 }}>
                                <FormInputs label="Carbohydrates" name="carbohydrates" value={formData.carbohydrates} onChange={handleInputChange} placeholder="Enter carbohydrates" />
                            </div> */}
                            {/* <div style={{ flex: 1 }}>
                                <FormInputs label="Fat" name="fat" value={formData.fat} onChange={handleInputChange} placeholder="Enter fat" />
                            </div> */}
                        {/* </div> */}



                    {/* </div> */}
                 <div style={{marginLeft:'3px', marginTop: '18px'}}>
                    <ButtonWithGradient text={isEditMode ? "Update Food Item" : "Add Food Item"} type="submit" />
                    
                </div>
                </form>
              </div>
              
            </PageContainer>
            <ToastContainer autoClose={1300} />
           
            <Footer />
        </>
    );
};

export default FoodItem;
