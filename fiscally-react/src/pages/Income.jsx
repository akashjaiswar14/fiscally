import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/apiEndPoints';
import IncomeList from '../components/IncomeList';

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
    } catch{
      console.error("Failed to fetch income details: ", error);
      toast.error(error.response?.data?.message || "Failed to fetch income details");
    } finally{
      setLoading(false);
    }
  }
  useEffect(()=>{
    fetchIncomeDetails();
  },[]);

  return (
    <Dashboard>
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div>
            {/* overview for income through chart */}
          </div>
          <IncomeList 
            transaction={incomeData}
            onDelete={(id) => console.log("deleting the income", id)}
          />
        </div>
      </div>
    </Dashboard>
  )
}

export default Income