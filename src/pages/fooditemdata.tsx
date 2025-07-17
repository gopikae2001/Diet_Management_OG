import React, { useState } from 'react';
import { useFood } from '../context/FoodContext';
import { toast } from 'react-toastify';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import ButtonWithGradient from '../components/button';
import PageContainer from '../components/PageContainer';
import SectionHeading from '../components/SectionHeading';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Searchbar from '../components/Searchbar';
import EditButton from '../components/EditButton';
import DeleteButton from '../components/DeleteButton';
// import { ToastContainer } from 'react-toastify';

interface FoodItemDataProps {
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
}

const FoodItemData: React.FC<FoodItemDataProps> = ({ sidebarCollapsed = false, toggleSidebar }) => {
  const { foodItems, deleteFoodItem } = useFood();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };


  //   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  //   const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const columns = [
    { 
      key: 'id', 
      header: 'S.No',
      render: (_: any, _row: any, index?: number) => index !== undefined ? (index + 1).toString() : ''
    },
    { key: 'name', header: 'Name' },
    { key: 'foodType', header: 'Type' },
    { key: 'category', header: 'Category' },
    { key: 'unit', header: 'Unit' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'calories', header: 'Calories' },
    { key: 'protein', header: 'Protein' },
    { key: 'carbohydrates', header: 'Carbs' },
    { key: 'fat', header: 'Fat' },
    {
      key: 'price',
      header: 'Price',
      render: (value: string) => `₹${value}`
    },
    {
      key: 'pricePerUnit',
      header: 'Price Per Unit',
      render: (value: string) => value ? `₹${value}` : ''
    },
    {
      key: 'actions', header: 'Actions', render: (_: any, row: any) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <a onClick={() => navigate(`/food-item/${row.id}`)} style={{ cursor: 'pointer' }}>
            {/* <img src={editLogo} alt="edit" /> */}
            <EditButton onClick={() => navigate(`/food-item/${row.id}`)}/>
          </a>
          <div onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this food item?')) {
              deleteFoodItem(row.id);
              toast.error('Food item deleted successfully');
            }
          }} style={{ cursor: 'pointer' }}>
            <DeleteButton />
          </div>
        </div>
      )
    }
  ];

  const filteredData = foodItems.filter(item =>
    Object.values(item).some(
      val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} showDate showTime showCalculator />
      <PageContainer>
        <SectionHeading
          title="Food Items"
          subtitle="View and manage all food items"
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", marginBottom: '20px' }}>
          <ButtonWithGradient
            text="+ Add New Food Item"
            onClick={() => navigate('/food-item')}
          />
          <Searchbar value={searchTerm} onChange={handleSearchChange} placeholder="Search food items..." />
        </div>


        <div style={{ marginTop: '20px' }}>
          <Table
            columns={columns}
            data={filteredData.map((item) => ({
              ...item
            }))}
          />
        </div>
      </PageContainer>
      <Footer />
    </>
  );
};

export default FoodItemData;