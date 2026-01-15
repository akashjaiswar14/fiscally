import React, { useState } from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
import { Search } from 'lucide-react';
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/apiEndPoints';
import toast from 'react-hot-toast';
import TransactionInfoCard from '../components/TransactionInfoCard';
import moment from 'moment';

const Filter = () => {
  useUser();
  const [type, setType] = useState("income");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortFeild, setSortFeild] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [transactions, setTransaction] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(type, startDate, endDate, keyword, sortFeild, sortOrder);
    setLoading(true);
    try {
      const response = await AxiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, {
                                                  type, 
                                                  startDate, 
                                                  endDate, 
                                                  keyword, 
                                                  sortFeild, 
                                                  sortOrder
                                              });
      setTransaction(response.data);
      console.log("transaction", response.data);
    } catch (error) {
      console.error("Failed to fetch transaction: ", error);
      toast.error(error.message || "Failed to fetch transaction. Please try again");
    } finally{
      setLoading(false);
    }
  }
  return ( 
    <Dashboard>
      <div className='my-5 mx-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold'>Filter Transactions</h2>
        </div>
        <div className='card p-4 mb-4'>
          <div className='flex items-center justify-between mb-4'>
            <h5 className='text-lg font-semibold'>Select the filters</h5>
          </div>
          <form className='grid grid-cols-1 sm:grid-cols-6 gap-4'>
            <div>
              <label 
              className='block text-sm font-medium mb-1' 
              htmlFor='type'>Type
              </label>
              <select 
              value={type}
              onChange={e => setType(e.target.value)}
              id="type" 
              className='w-full border rounded px-3 py-2'>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label 
              htmlFor="startdate" 
              className='block text-sm font-medium mb-1'>Start Date
              </label>
              <input 
              type="date" 
              id='startdate'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className='w-full border rounded px-3 py-2'/>
            </div>
            <div>
              <label 
              htmlFor="enddate" 
              className='block text-sm font-medium mb-1'>End Date</label>
              <input 
              value={endDate}
              type="date" 
              id='enddate' 
              onChange={e => setEndDate(e.target.value)}
              className='w-full border rounded px-3 py-2'/>
            </div>
            <div>
              <label 
              htmlFor="sortfeild"
              className='block text-sm font-medium mb-1'>Sort Feild</label>
              <select 
              name="" 
              id=""
              value={sortFeild}
              onChange={e => setSortFeild(e.target.value)}
              className='w-full border rounded px-3 py-2'>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
            </div>
            <div>
              <label 
              htmlFor="sortorder" 
              className='block text-sm font-medium mb-1'>Sort Order</label>
              <select 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value)}
              id="sortorder" 
              className='w-full border rounded px-3 py-2'>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div className='sm:col-span-1 md:col-span-1 flex items-end'>
              <div className='w-full'>
                <label htmlFor="keyword" className='block text-sm font-medium mb-1'>Search</label>
                <input 
                id="keyword" 
                type='text' 
                placeholder='search...' 
                value={keyword} 
                onChange={e => setKeyword(e.target.value)}
                className='w-full border rounded px-3 py-2'/>
              </div>
              <button 
              onClick={handleSearch}
              className='ml-2 mb-1 p-2 bg-purple-800 hover:bg-purple-800 text-white flex items-center justify-center cursor-pointer'>
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
        <div className='card p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h5 className='text-lg font-semibold'>Transactions</h5>
          </div>
          {transactions.length === 0 && !loading? (
            <p className='text-gray-500'>Select the filters and click apply to filter the transaction</p>
          ) : ""}
          {loading? (
            <p className='text-gray-500'>Loading Transactions</p>
          ) : ("")}
          {transactions.map((transaction) => (
            <TransactionInfoCard 
              key={transaction.id}
              title={transaction.name}
              icon={transaction.icon}
              date={moment(transaction.date).format("DD MMM YYYY")}
              amount={transaction.amount}
              type={type}
              hideDeleteBtn
            />
          ))}
        </div>
      </div>
    </Dashboard>
  )
}

export default Filter