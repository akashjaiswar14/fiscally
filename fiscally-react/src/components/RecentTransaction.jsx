import { ArrowRight } from 'lucide-react'
import React from 'react'
import TransactionInfoCard from './TransactionInfoCard'
import moment from 'moment'

const RecentTransaction = ({transactions, onMore}) => {
    return (
        <div className='card bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50'>
            <div className='flex items-center justify-between'>
                <h4 className='text-lg'>Recent Transactions</h4>
                <button 
                    className='card-btn' 
                    onClick={onMore}>
                        More <ArrowRight size={15} className='text-base'/>
                </button>   
            </div>
                <div className='mt-6'>
                    {transactions.slice(0, 5).map((item, index) => (
                        <TransactionInfoCard 
                            key={`${item.type}-${item.id}-${index}`}
                            title={item.name}
                            icon={item.icon}
                            date={moment(item.date).format("DD MMM YYYY")}
                            amount={item.amount}
                            type={item.type}
                            hideDeleteBtn
                        />
                    ))}
                </div>
        </div>
    )
}

export default RecentTransaction