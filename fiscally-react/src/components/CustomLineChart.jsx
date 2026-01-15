import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
    } from "recharts";

    /* ---------- Tooltip ---------- */
    const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-white p-3 rounded-xl shadow border text-sm">
        <p className="font-semibold">{label}</p>
        <p className="font-medium">
            Total: ₹{payload[0].value.toLocaleString()}
        </p>
        </div>
    );
    };

    /* ---------- Chart ---------- */
    const CustomLineChart = ({ data = [], type = "income" }) => {
    if (!Array.isArray(data) || data.length === 0) {
        return (
        <p className="text-sm text-gray-500 text-center">
            No data available
        </p>
        );
    }

    

    /* 🔥 TREND CALCULATION */
    const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
    );

    const lastIndex = sortedData.length - 1;
    const prevValue = sortedData[lastIndex - 1]?.total ?? 0;
    const lastValue = sortedData[lastIndex].total;

    const isIncreasing = lastValue > prevValue;

    let strokeColor = "#16a34a";
    let gradientId = "greenGradient";

    if (type === "income") {
    strokeColor = isIncreasing ? "#16a34a" : "#dc2626";
    gradientId = isIncreasing ? "greenGradient" : "redGradient";
    }

    if (type === "expense") {
    strokeColor = isIncreasing ? "#dc2626" : "#16a34a";
    gradientId = isIncreasing ? "redGradient" : "greenGradient";
    }

    return (
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
        <AreaChart data={sortedData}>
            {/* ---------- Gradients ---------- */}
            <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>

            <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
            </defs>

            <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            />

            <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
            type="monotone"
            dataKey="total"
            stroke={strokeColor}
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            dot={{ r: 4, fill: strokeColor }}
            activeDot={{ r: 6 }}
            />
        </AreaChart>
        </ResponsiveContainer>
    );
};

export default CustomLineChart;
