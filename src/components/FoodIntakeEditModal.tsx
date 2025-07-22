import React, { useState, useEffect } from 'react';
import CustomModal from './Modal';
import Input from './Input';
import Inputtype from './Inputtype';
import CancelButton from './CancelButton';
import ButtonWithGradient from './button';
import { foodItemsApi } from '../services/api';

interface FoodIntakeEditModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  initialData: any;
  onSave: (data: any) => void;
  dateList: string[]; // Add this prop
}

const defaultState = {
  id: '',
  day: '',
  date: '',
  time: '',
  ampm: 'AM',
  category: '',
  fooditem: '',
  intake_amount: '',
  unit: '',
  // carbohydrates: '',
  // proteins: '',
  // fat: '',
  calories: '',
  end_date: '',
  comments: '',
  status: '',
};

const FoodIntakeEditModal: React.FC<FoodIntakeEditModalProps> = ({ isOpen, onRequestClose, initialData, onSave, dateList }) => {
  const [form, setForm] = React.useState({ ...defaultState, ...initialData });
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    setForm({ ...defaultState, ...initialData });
  }, [initialData, isOpen]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const items = await foodItemsApi.getAll();
        setFoodItems(items);
      } catch (err) {
        setFoodItems([]);
      }
    };
    fetchFoodItems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === 'date') {
      // Build a unique, sorted list of dates including the new value
      const allDates = Array.from(new Set([...dateList.filter(d => d), value])).sort();
      const newDay = allDates.indexOf(value) + 1;
      setForm((prev: any) => ({ ...prev, date: value, day: newDay.toString() }));
      return;
    }
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <CustomModal isOpen={isOpen} onRequestClose={onRequestClose} title="Edit Food Intake">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px', marginBottom: 18 }}>
          <Input label="Date" name="date" value={form.date} onChange={handleChange} type="date" min={today} />
          <Input label="Day" name="day" value={form.day} onChange={handleChange} readOnly />
          <Inputtype label="Category" name="category" value={form.category} onChange={handleChange} options={[
            { value: '', label: 'Select category' },
            { value: 'Breakfast', label: 'Breakfast' },
            { value: 'Lunch', label: 'Lunch' },
            { value: 'Dinner', label: 'Dinner' },
            { value: 'Snack', label: 'Snack' },
          ]} />
          <Inputtype
            label="Food Item"
            name="fooditem"
            value={form.fooditem}
            onChange={handleChange}
            options={foodItems.map((item: any) => ({ value: item.name, label: item.name }))}
          />
          <Input label="Time" name="time" value={form.time} onChange={handleChange} type="time" />
          <Inputtype label="AM/PM" name="ampm" value={form.ampm} onChange={handleChange} options={[
            { value: 'AM', label: 'AM' },
            { value: 'PM', label: 'PM' },
          ]} />
          <Input label="Intake Amount" name="intake_amount" value={form.intake_amount} onChange={handleChange} type="number" />
          <Inputtype label="Unit" name="unit" value={form.unit} onChange={handleChange} options={[
            { value: '', label: 'Select unit' },
            { value: 'g', label: 'g' },
            { value: 'ml', label: 'ml' },
            { value: 'pcs', label: 'pcs' },
          ]} />
          <Input label="Calories (kcal)" name="calories" value={form.calories} onChange={handleChange} type="number" />
          <Input label="End Date" name="end_date" value={form.end_date} onChange={handleChange} type="date" min={today} />
          <Input label="Comments" name="comments" value={form.comments} onChange={handleChange} />
          <Inputtype label="Status" name="status" value={form.status} onChange={handleChange} options={[
            { value: '', label: 'Select status' },
            { value: 'Active', label: 'Active' },
            { value: 'Paused', label: 'Paused' },
            { value: 'Stopped', label: 'Stopped' },
          ]} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <CancelButton text="Cancel" onClick={onRequestClose} />
          <ButtonWithGradient className="primary" type="submit">Save</ButtonWithGradient>
        </div>
      </form>
    </CustomModal>
  );
};

export default FoodIntakeEditModal; 