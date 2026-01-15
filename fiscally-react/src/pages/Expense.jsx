import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/apiEndPoints';
import Model from '../components/Model'
import toast from 'react-hot-toast';
import DeleteAlert from '../components/DeleteAlert';
import ExpenseOverview from '../components/ExpenseOverview';
import ExpenseList from '../components/ExpenseList';
import AddExpenseForm from '../components/AddExpenseForm';

const Expense = () => {
  useUser();
  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });

  const fetchExpenseDetails = async ()=>{
    if(loading) return;

    setLoading(true);

    try{
      const response = await AxiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
      if(response.status === 200){
        console.log("espense list", response.data);
        setExpenseData(response.data);
      }
    } catch(error){
      console.error("Failed to fetch expense details: ", error);
      toast.error(error.response?.data?.message || "Failed to fetch expense details");
    } finally{
      setLoading(false);
    }
  }

  // fetch categories from income
  const fetchExpenseCategories = async () =>{
    setLoading(true);
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
      if(response.status === 200){
        console.log("expense categories: ", response.data);
        setCategories(response.data);
      }
    } catch (error) {
      console.log("Failed to fetch expense category: ", error);
      toast.error(error.data?.message || "Failed to fetch expense category");
    }finally{
      setLoading(false);
    }
  }

   // save the expense details
  const handleAddExpense = async (expense) =>{
    const {name, amount, date, icon, categoryId} = expense;

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
      const response = await AxiosConfig.post(API_ENDPOINTS.Add_EXPENSE, {
        name, 
        amount: Number(amount),
        date,
        icon,
        categoryId
      });
      if(response.status === 201){
        console.log("expense added", response.data);
        toast.success("Expense added successfully");
        setOpenAddExpenseModel(false);
        fetchExpenseDetails();
      }
    } catch (error) {
        console.log("Error adding expense", error);
        toast.error(error.response?.data?.message || "Failed to adding expense");
    }
  }

  // delete expense details
  const deleteExpense = async (id) => {
    try {
      await AxiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
      setOpenDeleteAlert({show: false, data: null})
      toast.success("Expense delete successfully");
      fetchExpenseCategories();
    } catch (error) {
      console.log("Error deleting expense ", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  }

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.Expense_EXCEL_DOWNLOAD,{ responseType: "blob" });

      // Validate content type
      const contentType = response.headers["content-type"];
      if (!contentType?.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
        throw new Error("Invalid Excel response");
      }

      // Extract filename
    const contentDisposition = response.headers["content-disposition"];
      let fileName = "expense.xlsx";
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

      toast.success("Expense downloaded successfully");
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense");
    }
  };

  const handleEmailExpenseDetails = async () =>{
    try {
      const response = await AxiosConfig.post(API_ENDPOINTS.EMAIL_EXPENSE);
      if(response.status === 200){
        toast.success("Expense details emailed successfully");
      }
    } catch (error) {
      console.error("Error emailing expense details: ", error);
      toast.error(error.response?.data?.message || "Failed to email expense");
    }
  }

  useEffect(()=>{
      fetchExpenseDetails();
      fetchExpenseCategories();
    },[]);

  return (
    <Dashboard>
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div>
            {/* overview for income through chart */}
            <ExpenseOverview
            transaction={expenseData} 
            onAddExpense={() => setOpenAddExpenseModel(true)}
            />
          </div>
          <ExpenseList 
            transaction={expenseData}
            onDelete={(id)=> setOpenDeleteAlert({show: true, data: id})}
            onDownload={handleDownloadExpenseDetails}
            onEmail={handleEmailExpenseDetails}
          />

          {/* Add income modal */}
          <Model
            isOpen={openAddExpenseModel}
            onClose={() => setOpenAddExpenseModel(false)}
            title="Add Expense"
          >
            <AddExpenseForm 
              onAddExpense={(expense) => handleAddExpense(expense)}
              categories={categories}
            />
          </Model>

          {/* delete income modal */}
          <Model 
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({show: false, data: null})}
            title="Delete Expense"
          >
            <DeleteAlert 
              content="Are you sure want to delete this expense details?"
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
          </Model>
        </div>
      </div>
    </Dashboard>
  )
}

export default Expense