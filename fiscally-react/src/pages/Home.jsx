import React, { useEffect, useState} from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
import InfoCard from '../components/InfoCard';
import { Coins, Wallet, WalletCards } from 'lucide-react';
import { addThousandsSeparator } from '../util/util';
import { useNavigate } from 'react-router-dom';
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/apiEndPoints';
import toast from 'react-hot-toast';
import RecentTransaction from '../components/RecentTransaction';
import FinanceOverview from '../components/FinanceOverview';
import Transaction from '../components/Transaction';

const Home = () => {
  useUser();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if(loading) return;
    setLoading(true);
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
      console.log("transaction data: ", response.data);
      if(response.status === 200){
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Something went wrong while fetching data ", error);
      toast.error("Something went wrong while fetching data");
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
    return () => {}
  }, [])
  return (
    <div>
      <Dashboard>
        <div className='my-5 mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Display the cards */}
            <InfoCard 
              icon={<WalletCards />}
              label="Total Balance"
              value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
              color="bg-purple-800"
            />
            <InfoCard 
              icon={<Wallet />}
              label="Total Income"
              value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
              color="bg-green-800"
            />
            <InfoCard 
              icon={<Coins />}
              label="Total Expense"
              value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
              color="bg-red-800"
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-2'>
            {/* Recent transactions */}
            <RecentTransaction 
              transactions={dashboardData?.recentTransaction   || []}
              onMore={() => navigate("/expense")}
            />

            {/* Finance overview chart */}
            <FinanceOverview 
              totalBalance={dashboardData?.totalBalance || 0}
              totalIncome={dashboardData?.totalIncome || 0}
              totalExpense={dashboardData?.totalExpense || 0}
            />
            {/* Expense transactions */}
            <Transaction 
              transactions={dashboardData?.recent5Expenses || []}
              onMore={() => navigate("/expense")}
              type="expense"
              title="Recent Expenses"
            />

            {/* Income transactoion */}
            <Transaction 
              transactions={dashboardData?.recent5Income || []}
              onMore={() => navigate("/income")}
              type="income"
              title="Recent Incomes"
            />
          </div>
        </div>
      </Dashboard>
    </div>
  )
}

export default Home