import React from 'react';
// import '../styles/MealSection.css';


const addMealItem = (mealType: string) => {
    // Implement add meal item logic here
  };

const updateMealItem = (mealType: string, index: number, key: string, value: string | number) => {
    // Implement update meal item logic here
  };

const removeMealItem = (mealType: string, index: number) => {
    // Implement remove meal item logic here
  };
interface MealItem {
    id: string;
    name: string;
    foodItemId: string;
    quantity: number;
    unit: string;
  }



const MealSection: React.FC<{ title: string; mealType: string; }> = ({
    title,
    mealType
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
        <div className="meal-items">
          {items.map((item, index) => (
            <div key={index} className="meal-row">
              <select
                value={item.foodItemId}
                onChange={(e) => updateMealItem(mealType, index, "foodItemId", e.target.value)}
                style={{
                  padding: '9px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '12px',
                  width: '100%',
                  maxWidth: '250px',
                  flex: '1 1 auto',
                  minWidth: '150px'
                }}
              >
                <option value="">Select Food Item</option>
                {foodItems.map((food) => (
                  <option key={food.id} value={food.id}>{food.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateMealItem(mealType, index, "quantity", parseFloat(e.target.value))}
                style={{
                  padding: '9px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  width: '50px',
                  flex: '0 0 auto',
                  textAlign: 'center'
                }}
              />
              <span style={{
                textAlign: 'center',
                minWidth: '40px',
                padding: '0 5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                {item.unit}
              </span>
              <button 
                type="button" 
                className="danger" 
                onClick={() => removeMealItem(mealType, index)}
                style={{
                  background: 'none',
                  border: '1px solid #dc3545',
                  color: '#dc3545',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '6px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  flex: '0 0 auto',
                  width: '30px',
                  height: '34px'
                }}
              >
                ×
              </button>
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

  export default MealSection;