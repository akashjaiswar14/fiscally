import React from "react";
import CustomPieChart from "./CustomPieChart";
import { addThousandsSeparator } from "../util/util";

const COLORS = ["#59168B", "#a0090e", "#016630"];

const FinanceOverview = ({
    totalIncome = 0,
    totalExpense = 0,
    totalBalance = 0
    }) => {
    const balanceData = [
        { name: "Expense", value: Number(totalExpense) },
        { name: "Income", value: Number(totalIncome) },
        { name: "Balance", value: Number(totalBalance) }
    ];

    return (
        <CustomPieChart
        data={balanceData}
        label="Finance Overview"
        totalAmount={`₹${addThousandsSeparator(totalBalance)}`}
        colors={COLORS}
        showTextAnchor
        />
    );
};

export default FinanceOverview;
