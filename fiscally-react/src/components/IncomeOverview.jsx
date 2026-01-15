import React, { useEffect, useState } from 'react'
import { prepareIncomeLineChartData } from '../util/util';
import CustomLineChart from './CustomLineChart';
import { Plus } from 'lucide-react';

const IncomeOverview = ({transaction, onAddIncome}) => {
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        const result = prepareIncomeLineChartData(transaction);
        console.log("chart data", result);
        setChartData(result);
        return () => {};
    }, [transaction])
    return (
        <div className="card bg-white rounded-2xl p-4">
    {/* HEADER */}
    <div className="flex items-start justify-between gap-4">
        <div>
            <h5 className="text-lg font-semibold">Income Overview</h5>
            <p className="text-xs text-gray-400">
                Track your earnings over time and analyze your income trends.
            </p>
        </div>

        <button
            onClick={onAddIncome}
            className="add-btn flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-purple-200 rounded-full shadow-sm hover:bg-blue-100 transition whitespace-nowrap"
        >
            <Plus size={15} />
            Add Income
        </button>
    </div>

    {/* CHART */}
    <div className="mt-6 w-full h-80">
        <CustomLineChart data={chartData} />
    </div>
</div>
    )
}

export default IncomeOverview