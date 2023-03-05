function subtractYears(date, years) {
    const dateCopy = new Date(date);
    dateCopy.setFullYear(date.getFullYear() - years);
    return dateCopy;
}

function calculateAverageAnnualGrowth(dividendData) {
    const firstYear = new Date(dividendData[0].date).getFullYear();
    const lastYear = new Date(dividendData[dividendData.length - 1].date).getFullYear();
    const numYears = lastYear - firstYear + 1;
  
    const totalGrowthPercentage = (dividendData[dividendData.length - 1].dividends / dividendData[0].dividends) ** (1 / numYears) - 1;
    const averageGrowthPercentage = totalGrowthPercentage / numYears;
  
    return averageGrowthPercentage * 100; // Convert to percentage
}

exports.calculateAverageAnnualGrowth = calculateAverageAnnualGrowth;
exports.subtractYears = subtractYears;