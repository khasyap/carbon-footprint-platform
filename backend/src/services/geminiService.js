const genAI = require('../config/gemini');
const CarbonRecord = require('../models/CarbonRecord');

// Mock recommendations fallback if API Key is missing or invalid
const getMockRecommendations = (totalEmission = 120) => {
  const transportShare = Math.round(totalEmission * 0.4);
  const electricityShare = Math.round(totalEmission * 0.35);
  const foodShare = Math.round(totalEmission * 0.15);
  const wasteShare = Math.round(totalEmission * 0.1);

  return {
    recommendations: [
      {
        category: 'Transport',
        suggestion: `Carpool or use public transit twice a week to offset your ${transportShare} kg CO₂ transport footprint.`,
        impact: Math.round(transportShare * 0.25) || 15,
        difficulty: 'Easy'
      },
      {
        category: 'Electricity',
        suggestion: 'Unplug devices when not in use and switch to LED bulbs to reduce your utility consumption.',
        impact: Math.round(electricityShare * 0.15) || 12,
        difficulty: 'Medium'
      },
      {
        category: 'Food',
        suggestion: `Replace 3 beef/meat meals a week with vegetarian or plant-based options to lower your food emissions.`,
        impact: Math.round(foodShare * 0.3) || 8,
        difficulty: 'Easy'
      },
      {
        category: 'Waste',
        suggestion: 'Compost organic waste and implement strict recycling to reduce methane emissions from landfills.',
        impact: Math.round(wasteShare * 0.2) || 5,
        difficulty: 'Easy'
      }
    ],
    estimatedTotalReduction: Math.round(totalEmission * 0.2) || 40,
    coachingTip: "You're making great strides! Focus on reducing car journeys first as they make up the largest part of your footprint."
  };
};

/**
 * Generate recommendations based on user history
 */
const generateRecommendations = async (userId) => {
  // Fetch latest 10 carbon records for context
  const records = await CarbonRecord.find({ userId }).populate('activityId').sort({ date: -1 }).limit(10);

  // Compute average metrics to feed Gemini
  let totalTransport = 0, totalElectricity = 0, totalFood = 0, totalWaste = 0, totalEmission = 0;
  
  if (records.length > 0) {
    records.forEach(r => {
      totalTransport += r.transportEmission;
      totalElectricity += r.electricityEmission;
      totalFood += r.foodEmission;
      totalWaste += r.wasteEmission;
      totalEmission += r.totalEmission;
    });
  } else {
    // If no records logged, use averages for a baseline user
    totalEmission = 150;
    totalTransport = 50;
    totalElectricity = 60;
    totalFood = 25;
    totalWaste = 15;
  }

  // Check if API key is present
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not set. Using mock recommendations.");
    return getMockRecommendations(totalEmission);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert AI Sustainability Coach. Your role is to analyze a user's recent carbon footprint logs and generate structured, actionable, and hyper-personalized recommendations to help them reduce their carbon footprint.
      
      Here are the user's recent emissions totals (in kg CO2):
      - Transport: ${totalTransport.toFixed(1)} kg CO2
      - Electricity: ${totalElectricity.toFixed(1)} kg CO2
      - Food: ${totalFood.toFixed(1)} kg CO2
      - Waste: ${totalWaste.toFixed(1)} kg CO2
      - Total Recorded: ${totalEmission.toFixed(1)} kg CO2
      
      Based on this breakdown, generate exactly 3-4 recommendations. Each recommendation must belong to one of these categories: "Transport", "Electricity", "Food", "Waste".
      
      You MUST respond ONLY with a valid JSON object matching this schema (do not include any markdown formatting wrappers or other text, respond only with raw JSON):
      {
        "recommendations": [
          {
            "category": "Transport",
            "suggestion": "Detailed actionable recommendation text here...",
            "impact": 15, // estimated kg CO2 reduction per month (integer)
            "difficulty": "Easy" // "Easy", "Medium", or "Hard"
          }
        ],
        "estimatedTotalReduction": 40, // sum of impacts (integer)
        "coachingTip": "A friendly, encouraging summary coaching tip of 1-2 sentences."
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const textResponse = result.response.text();
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Gemini API call failed, falling back to mock:", error.message);
    return getMockRecommendations(totalEmission);
  }
};

module.exports = {
  generateRecommendations
};
