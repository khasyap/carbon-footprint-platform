// Emission Factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  // Transport: kg CO2 per km
  transport: {
    'Car': 0.20,
    'Public Transport': 0.05,
    'Motorcycle': 0.10,
    'Bike': 0,
    'Walk': 0,
    'None': 0
  },
  // Electricity: kg CO2 per kWh
  electricity: 0.85,
  // Water: kg CO2 per Litre
  water: 0.15,
  // Food: kg CO2 per day / log entry
  food: {
    'Meat Heavy': 3.0,
    'Balanced': 1.5,
    'Vegetarian': 0.7,
    'Vegan': 0.4,
    'None': 0
  },
  // Waste: kg CO2 per kg of waste generated
  waste: 0.50
};

module.exports = {
  EMISSION_FACTORS
};
