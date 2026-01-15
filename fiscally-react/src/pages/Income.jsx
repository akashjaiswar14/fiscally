import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/apiEndPoints';
import IncomeList from '../components/IncomeList';
import Model from '../components/Model'
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import AddIncomeForm from '../components/AddIncomeForm';
import DeleteAlert from '../components/DeleteAlert';
import IncomeOverview from '../components/IncomeOverview';

const Income = () => {
  useUser();
  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddIncomeModel, setOpenAddIncomeModel] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });

  const fetchIncomeDetails = async ()=>{
    if(loading) return;

    setLoading(true);

    try{
      const response = await AxiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
      if(response.status === 200){
        console.log("income list", response.data);
        setIncomeData(response.data);
      }
    } catch(error){
      console.error("Failed to fetch income details: ", error);
      toast.error(error.response?.data?.message || "Failed to fetch income details");
    } finally{
      setLoading(false);
    }
  }

  // fetch categories from income
  const fetchIncomeCategories = async () =>{
    setLoading(true);
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
      if(response.status === 200){
        console.log("income categories: ", response.data);
        setCategories(response.data);
      }
    } catch (error) {
      console.log("Failed to fetch income category: ", error);
      toast.error(error.data?.message || "Failed to fetch income category");
    }finally{
      setLoading(false);
    }
  }
  
  // save the income details
  const handleAddincome = async (income) =>{
    const {name, amount, date, icon, categoryId} = income;

    if(!name.trim()){
      toast.error("Please enter a name");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be valid number greater than 0");
      return;
    }

    if(!date){
      toast.error("Please select a date");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if(date > today){
      toast.error("Date cannot be in the future");
      return;
    }

    if(!categoryId){
      toast.error("Please select a category");
      return;
    }

    try {
      const response = await AxiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
        name, 
        amount: Number(amount),
        date,
        icon,
        categoryId
      });
      if(response.status === 201){
        console.log("income added", response.data);
        setOpenAddIncomeModel(false);
        toast.success("Income added successfully");
        fetchIncomeDetails();
        fetchIncomeCategories();
      }
    } catch (error) {
        console.log("Error adding income", error);
        toast.error(error.response?.data?.message || "Failed to adding income");
    }
  }

  // delet income details
  const deleteIncome = async (id) => {
    try {
      await AxiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
      setOpenDeleteAlert({show: false, data: null})
      toast.success("Income delete successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.log("Error deleting income ", error);
      toast.error(error.response?.data?.message || "Failed to delete income");
    }
  }

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await AxiosConfig.get(
        API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD,
        { responseType: "blob" }
      );

      // Validate content type
      const contentType = response.headers["content-type"];
      if (!contentType?.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
        throw new Error("Invalid Excel response");
      }

      // Extract filename
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "income.xlsx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match?.[1]) fileName = match[1];
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Income downloaded successfully");
    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error("Failed to download income");
    }
  };


  const handleEmailIncomeDetails = async () =>{
    try {
      const response = await AxiosConfig.post(API_ENDPOINTS.EMAIL_INCOME);
      if(response.status === 200){
        toast.success("Income details emailed successfully");
      }
    } catch (error) {
      console.error("Error emailing income details: ", error);
      toast.error(error.response?.data?.message || "Failed to email income");
    }
  }
  
  useEffect(()=>{
    fetchIncomeDetails();
    fetchIncomeCategories();
  },[]);

  return (
    <Dashboard>
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div>
            {/* overview for income through chart */}
            <IncomeOverview 
            transaction={incomeData} 
            onAddIncome={() => setOpenAddIncomeModel(true)}
            />
          </div>
          <IncomeList 
            transaction={incomeData}
            onDelete={(id)=> setOpenDeleteAlert({show: true, data: id})}
            onDownload={handleDownloadIncomeDetails}
            onEmail={handleEmailIncomeDetails}
          />

          {/* Add income modal */}
          <Model
            isOpen={openAddIncomeModel}
            onClose={() => setOpenAddIncomeModel(false)}
            title="Add Income"
          >
            <AddIncomeForm 
              onAddIncome={(income) => handleAddincome(income)}
              categories={categories}
            />
          </Model>

          {/* delete income modal */}
          <Model 
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({show: false, data: null})}
            title="Delete Income"
          >
            <DeleteAlert 
              content="Are you sure want to delete this income details?"
              onDelete={() => deleteIncome(openDeleteAlert.data)}
            />
          </Model>
        </div>
      </div>
    </Dashboard>
  )
}

export default Income