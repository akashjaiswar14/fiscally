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
    const {id, name,type, icon} = category;

    if(!name.trim()){
      toast.error("Category name is required");
      return;
    }

    // check if the category already exist
    const isDublicate = categoryData.some((category) => {
      return category.name.toLowerCase() === name.trim().toLowerCase();
    })
    
    if(isDublicate){
      toast.error("Category name is already exist");
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

  const handleEditCategory = (categoryToEdit)=>{
    console.log("Editing the category", categoryToEdit);
    setSelectedCategory(categoryToEdit);
    setOpenEditCategoryModel(true);
    
  }

  const handleUpdateCategory = async (updatedCategory)=>{
    console.log("updating the category", updatedCategory);
    const {id, name, type, icon} = updatedCategory;
    if(!name.trim()){
      toast.error("Category name is required");
      return;
    }
    if(!id){
      toast.error("Category id is  missing for update");
      return;
    }
    try {
      await AxiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {name, type, icon});
      setOpenEditCategoryModel(false);
      setSelectedCategory(null);
      toast.success("Category updated successfully");
      fetchCategoryDetails();
    } catch (error) {
      console.error("Error updating category: ",error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to update category");
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
        <CategoryList categories={categoryData} onEditCategory={handleEditCategory}/>
        {/* Adding category model */}
        <Model
          isOpen={openAddCategoryModel}
          onClose={()=> setOpenAddCategroyModel(false)}
          title="Add Category"
        >
          <AddCategoryForm onAddCategory={handleAddCategory}/>
        </Model>

        {/* updating category model */}
        <Model
          onClose={()=> {
            setOpenEditCategoryModel(false);
            setSelectedCategory(null);
          }}
          isOpen={openEditCategoryModel}
          title="Update Category"
        >
          <AddCategoryForm
            initialCategoryData={selectedCategory}
            onAddCategory={handleUpdateCategory}
            isEditing={true}
          />
        </Model>
      </div>
    </Dashboard>
  )
}

export default Category