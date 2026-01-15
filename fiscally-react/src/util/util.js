export const addThousandsSeparator = (num) => {
    if(num == null || isNaN(num)) return "";

    const numStr = num.toString();
    const parts = numStr.split('.');

    let integerPart = parts[0];
    let fractionalPart = parts[1];

    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length -3);

    if(otherNumbers !== ''){
        const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
        integerPart = formattedOtherNumbers + ',' + lastThree;
    } else{
        integerPart = lastThree;
    }   

    return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
}

export const prepareIncomeLineChartData = (transactions = []) => {
    if (!Array.isArray(transactions)) return [];

    const incomeByDate = {};

    transactions.forEach(({ date, amount }) => {
        if (!date || !amount) return;

        const day = date.split('T')[0]; // normalize date

        incomeByDate[day] = (incomeByDate[day] || 0) + Number(amount);
    });

    return Object.keys(incomeByDate)
        .sort((a, b) => new Date(a) - new Date(b))
        .map(date => ({
            date,
            total: incomeByDate[date]
        }));
};

export const prepareExpenseLineChartData = (transactions = []) => {
    if (!Array.isArray(transactions)) return [];

    const expenseByDate = {};

    transactions.forEach(({ date, amount }) => {
        if (!date || !amount) return;

        const day = date.split('T')[0]; // normalize date

        expenseByDate[day] = (expenseByDate[day] || 0) + Number(amount);
    });

    return Object.keys(expenseByDate)
        .sort((a, b) => new Date(a) - new Date(b))
        .map(date => ({
            date,
            total: expenseByDate[date]
        }));
};

