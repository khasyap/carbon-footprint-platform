export const EMISSION_FACTORS = {
  transport: {
    'Car': 0.20,
    'Public Transport': 0.05,
    'Motorcycle': 0.10,
    'Bike': 0,
    'Walk': 0,
    'None': 0
  },
  electricity: 0.85,
  water: 0.15,
  food: {
    'Meat Heavy': 3.0,
    'Balanced': 1.5,
    'Vegetarian': 0.7,
    'Vegan': 0.4,
    'None': 0
  },
  waste: 0.50
};

export const calculateCarbonEstimate = ({ transportType, distance, electricityUnits, waterUsage, foodType, wasteGenerated }) => {
  const tDist = parseFloat(distance) || 0;
  const eUnits = parseFloat(electricityUnits) || 0;
  const wUsage = parseFloat(waterUsage) || 0;
  const wGen = parseFloat(wasteGenerated) || 0;

  const transport = tDist * (EMISSION_FACTORS.transport[transportType] || 0);
  const electricity = eUnits * EMISSION_FACTORS.electricity;
  const water = wUsage * EMISSION_FACTORS.water;
  const food = EMISSION_FACTORS.food[foodType] || 0;
  const waste = wGen * EMISSION_FACTORS.waste;

  return {
    transport: parseFloat(transport.toFixed(1)),
    electricity: parseFloat(electricity.toFixed(1)),
    water: parseFloat(water.toFixed(1)),
    food: parseFloat(food.toFixed(1)),
    waste: parseFloat(waste.toFixed(1)),
    total: parseFloat((transport + electricity + water + food + waste).toFixed(1))
  };
};

