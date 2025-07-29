import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { foodItemsApi } from '../services/api';

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

// Map backend MSSQL fields to frontend fields
function mapFoodItemFromBackend(item: any): FoodItem {
  return {
    id: item.FI_ID_PK?.toString() || item.id?.toString() || '',
    name: item.FI_name || item.name || '',
    foodType: item.FI_foodType || item.foodType || '',
    category: item.FI_category || item.category || '',
    unit: item.FI_unit?.toString() || item.unit || '',
    quantity: item.FI_quantity?.toString() || item.quantity || '',
    calories: item.FI_calories?.toString() || item.calories || '',
    protein: item.FI_protein?.toString() || item.protein || '',
    carbohydrates: item.FI_carbohydrates?.toString() || item.carbohydrates || '',
    fat: item.FI_fat?.toString() || item.fat || '',
    price: item.FI_price?.toString() || item.price || '',
    pricePerUnit: item.FI_priceperunit?.toString() || item.pricePerUnit || '',
  };
}

interface FoodContextType {
  foodItems: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id'>) => Promise<void>;
  editFoodItem: (id: string, updatedItem: Omit<FoodItem, 'id'>) => Promise<void>;
  deleteFoodItem: (id: string) => Promise<void>;
  getFoodItem: (id: string) => FoodItem | undefined;
  refreshFoodItems: () => Promise<void>;
  isLoading: boolean;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFoodItems = async () => {
    try {
      setIsLoading(true);
      const items = await foodItemsApi.getAll();
      setFoodItems(Array.isArray(items) ? items.map(mapFoodItemFromBackend) : []);
    } catch (error) {
      console.error('Failed to load food items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load items from API on initial render
  useEffect(() => {
    refreshFoodItems();
  }, []);

  const addFoodItem = async (item: Omit<FoodItem, 'id'>) => {
    try {
      const quantityNum = Number(item.quantity);
      const priceNum = Number(item.price);
      const pricePerUnit = (!isNaN(quantityNum) && quantityNum > 0 && !isNaN(priceNum)) ? (priceNum / quantityNum).toFixed(2) : '';
      await foodItemsApi.create({ ...item, pricePerUnit });
      await refreshFoodItems();
    } catch (error) {
      console.error('Failed to add food item:', error);
      throw error;
    }
  };

  const editFoodItem = async (id: string, updatedItem: Omit<FoodItem, 'id'>) => {
    try {
      const quantityNum = Number(updatedItem.quantity);
      const priceNum = Number(updatedItem.price);
      const pricePerUnit = (!isNaN(quantityNum) && quantityNum > 0 && !isNaN(priceNum)) ? (priceNum / quantityNum).toFixed(2) : '';
      await foodItemsApi.update(id, { ...updatedItem, pricePerUnit });
      await refreshFoodItems();
    } catch (error) {
      console.error('Failed to edit food item:', error);
      throw error;
    }
  };

  const getFoodItem = (id: string) => {
    return foodItems.find(item => item.id === id);
  };

  const deleteFoodItem = async (id: string) => {
    try {
      await foodItemsApi.delete(id);
      await refreshFoodItems();
    } catch (error) {
      console.error('Failed to delete food item:', error);
      throw error;
    }
  };

  return (
    <FoodContext.Provider value={{ foodItems, addFoodItem, editFoodItem, deleteFoodItem, getFoodItem, refreshFoodItems, isLoading }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = (): FoodContextType => {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error('useFood must be used within a FoodProvider');
  }
  return context;
};
