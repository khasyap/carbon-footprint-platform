const { EMISSION_FACTORS } = require('./constants');

/**
 * Calculates carbon footprint based on activity logs.
 * @param {Object} activity 
 * @returns {Object} breakdown and total emissions in kg CO2
 */
const calculateCarbon = (activity) => {
  const { transportType, distance, electricityUnits, waterUsage, foodType, wasteGenerated } = activity;

  // Calculate Transport Emission
  const transportFactor = EMISSION_FACTORS.transport[transportType] || 0;
  const transportEmission = parseFloat((distance * transportFactor).toFixed(2));

  // Calculate Electricity Emission
  const electricityEmission = parseFloat((electricityUnits * EMISSION_FACTORS.electricity).toFixed(2));

  // Calculate Water Emission
  const waterEmission = parseFloat((waterUsage * EMISSION_FACTORS.water).toFixed(2));

  // Calculate Food Emission
  const foodFactor = EMISSION_FACTORS.food[foodType] || 0;
  const foodEmission = parseFloat(foodFactor.toFixed(2));

  // Calculate Waste Emission
  const wasteEmission = parseFloat((wasteGenerated * EMISSION_FACTORS.waste).toFixed(2));

  // Total
  const totalEmission = parseFloat((transportEmission + electricityEmission + waterEmission + foodEmission + wasteEmission).toFixed(2));

  return {
    transportEmission,
    electricityEmission,
    waterEmission,
    foodEmission,
    wasteEmission,
    totalEmission
  };
};

module.exports = calculateCarbon;
