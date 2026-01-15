// import { Download, Mail } from 'lucide-react'
// import React from 'react'
// import TransactionInfoCard from './TransactionInfoCard'
// import moment from 'moment'

// const IncomeList = ({transaction, onDelete}) => {
//     return (
//         <div className='card bg-green-100 p-3 rounded-2xl'>
//             <div className='flex items-center justify-between'>
//                 <h5 className='text-lg'>Income Sources</h5>
//                 <div className='flex items-center justify-end gap-5'>
//                     <button className="flex items-center gap-2 px-4 py-2 
//                                     bg-blue-50 text-blue-700 
//                                     border border-purple-200 
//                                     rounded-full shadow-sm
//                                     hover:bg-blue-100 transition">
//                         <Mail size={16} />
//                         <span className="text-sm font-medium">Email</span>
//                     </button>

//                     <button className="flex items-center gap-2 px-4 py-2 
//                                     bg-blue-50 text-blue-700 
//                                     border border-purple-200 
//                                     rounded-full shadow-sm
//                                     hover:bg-blue-100 transition">
//                         <Download size={16} />
//                         <span className="text-sm font-medium">Download</span>
//                     </button>
//                 </div>
//             </div>
//             <div className='grid grid-cols-1 md:grid-cols-2'>
//                 {/* display the incomes */}
//                 {Array.isArray(transaction) && transaction.length > 0 && 
//                     (transaction?.map((income)=>(
//                         <TransactionInfoCard 
//                             key={income.id}
//                             title={income.income}
//                             icon={income.icon}
//                             date={moment(income.date).format('Do MMM YYYY')}
//                             amount={income.amount}
//                             type={income}
//                             onClick={()=>onDelete(income.id)}
//                         />)
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default IncomeList

import { Download, LoaderCircle, Mail } from 'lucide-react'
import React, { useState } from 'react'
import TransactionInfoCard from './TransactionInfoCard'
import moment from 'moment'

const IncomeList = ({ transaction, onDelete, onDownload, onEmail }) => {
    console.log("IncomeList transaction:", transaction);
    const [loading, setLoading] = useState(false);
    
    const handleEmail = async () =>{
        setLoading(true);
        try {
            await onEmail();
        } finally {
            setLoading(false);
        }
    }

    const handleDownload = async () => {
        setLoading(true);
        try {
            await onDownload();
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='card bg-green-50 p-3 rounded-2xl'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Income Sources</h5>

            <div className='flex items-center justify-end gap-5'>
            <button 
                onClick={handleEmail}
                disabled={loading}
                className='flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-purple-200 rounded-full shadow-sm hover:bg-blue-100 transition'>
                {loading ? (
                    <>
                        <LoaderCircle className='w-4 h-4 animate-spin'/>
                        <span className='text-sm font-medium'>Emailing...</span>
                    </>
                ) : (
                    <>
                        <Mail size={16} />
                        <span className='text-sm font-medium'>Email</span>
                    </>
                )}
            </button>

            <button 
                onClick={handleDownload}
                disabled={loading}
                className='flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-purple-200 rounded-full shadow-sm hover:bg-blue-100 transition'>
                {loading ? (
                    <>
                        <LoaderCircle className='w-4 h-4 animate-spin'/>
                        <span className='text-sm font-medium'>Downloading...</span>
                    </>
                ) : (
                    <>
                        <Download size={16} />
                        <span className='text-sm font-medium'>Download</span>
                    </>
                )}
            </button>
            </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            {Array.isArray(transaction) && transaction.length > 0 ? (
            transaction.map((income) => (
                <TransactionInfoCard
                key={income.id}
                title={income.name}                 // ✅ FIXED
                icon={income.icon}
                date={moment(income.date).format('Do MMM YYYY')}
                amount={income.amount}
                type="income"                       // ✅ FIXED
                onDelete={() => onDelete(income.id)}
                />
            ))
            ) : (
            <p className='text-sm text-gray-600'>No income records found</p>
            )}
        </div>
        </div>
    )
}

export default IncomeList
