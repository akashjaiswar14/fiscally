import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
import { Car, Plus } from 'lucide-react';
import CategoryList from '../components/CategoryList';
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/apiEndPoints';
import toast from 'react-hot-toast';
import Model from '../components/Model';
import AddCategoryForm from '../components/AddCategoryForm';

const Category = () => {
  useUser();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModel, setOpenAddCategroyModel] = useState(false);
  const [openEditCategoryModel, setOpenEditCategoryModel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategoryDetails = async () => {
    if(loading) return;

    setLoading(true);
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if(response.status === 200){
        console.log('categories: ',response.data);
        setCategoryData(response.data)
      }
    } catch (error) {
      console.error("Something went wrong. Please try again.", error); 
      toast.error(error.message);
    } finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchCategoryDetails();
  },[]);

  const handleAddCategory = async (category)=> {
    const {name,type, icon} = category;

    if(!name.trim()){
      toast.error("Category name is required");
      return;
    }

    try {
      const response = await AxiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {name, type, icon});
      if(response.status === 201){
        toast.success("Category added successfully");
        setOpenAddCategroyModel(false);
        fetchCategoryDetails();
      }
    } catch (error) {
      console.error("Error adding category: ", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    }
    
  }

  return (
    <Dashboard >
      <div className='my-5 mx-auto'>
        {/* Add button to add category */}
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-2xl font-semibold'>All Categroies</h2>
          <button 
          onClick={() => setOpenAddCategroyModel(true)}
          className='add-btn flex items-center gap-1 text-green-700 bg-green-100 rounded p-2'>
            <Plus size={15}/>
            Add Category
          </button>

        </div>
        {/* Category list */}
        <CategoryList categories={categoryData}/>
        {/* Adding category model */}
        <Model
          isOpen={openAddCategoryModel}
          onClose={()=> setOpenAddCategroyModel(false)}
          title="Add Category"
        >
          <AddCategoryForm onAddCategory={handleAddCategory}/>
        </Model>

        {/* updating category model */}

      </div>
    </Dashboard>
  )
}

export default Category