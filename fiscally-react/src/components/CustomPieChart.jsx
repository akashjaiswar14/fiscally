import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
    } from "recharts";

    /* 🔒 SEMANTIC COLOR MAP */
    const PIE_COLOR_MAP = {
    Expense: "#a0090e",   // red
    Income: "#016630",    // green
    Balance: "#59168B"    // purple
    };

    const CustomPieChart = ({
    data = [],
    label = "",
    totalAmount = "",
    showTextAnchor = false
    }) => {
    if (!Array.isArray(data) || data.length === 0) {
        return (
        <div className="card flex items-center justify-center h-64 text-sm text-gray-500">
            No data available
        </div>
        );
    }

    return (
        <div className="card bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
        {/* HEADER */}
        {label && (
            <h4 className="text-lg font-semibold mb-3">{label}</h4>
        )}

        {/* CHART */}
        <div className="relative">
            <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                isAnimationActive
                >
                {data.map((entry, index) => (
                    <Cell
                    key={`${entry.name}-${index}`}
                    fill={PIE_COLOR_MAP[entry.name] || "#ccc"}
                    />
                ))}
                </Pie>

                <Tooltip
                formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                }
                />
            </PieChart>
            </ResponsiveContainer>

            {/* CENTER TEXT */}
            {showTextAnchor && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-xl font-bold">{totalAmount}</span>
            </div>
            )}
        </div>

        {/* 🔽 LEGEND (BOTTOM) */}
        <div className="mt-4 space-y-2">
            {data.map((item, index) => (
            <div
                key={`legend-${item.name}-${index}`}
                className="flex items-center justify-between text-sm"
            >
                <div className="flex items-center gap-2">
                <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: PIE_COLOR_MAP[item.name] }}
                />
                <span className="text-gray-700">{item.name}</span>
                </div>

                <span className="font-medium">
                ₹{Number(item.value).toLocaleString("en-IN")}
                </span>
            </div>
            ))}
        </div>
        </div>
    );
};

export default CustomPieChart;
