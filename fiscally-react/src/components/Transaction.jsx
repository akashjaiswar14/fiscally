import { ArrowRight } from 'lucide-react'
import React from 'react'
import TransactionInfoCard from './TransactionInfoCard'
import moment from 'moment'

const Transaction = ({transactions, onMore, type, title}) => {
    return (
        <div className='card bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>{title}</h5>
                <button className='card-btn' onClick={onMore}>
                    More <ArrowRight size={15} className='text-base'/>
                </button>
            </div>
            <div>
                {transactions?.slice(0,5)?.map(item => (
                    <TransactionInfoCard 
                        key={item.id}
                        title={item.name}
                        icon={item.icon}
                        date={moment(item.date).format("DD MMM YYYY")}
                        amount={item.amount}
                        type={type}
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    )
}

export default Transaction