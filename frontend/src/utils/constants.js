const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
let cleanUrl = rawApiUrl.trim().replace(/\/+$/, '');
if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
  cleanUrl = `https://${cleanUrl}`;
}
export const API_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

export const TRANSPORT_TYPES = ['Car', 'Public Transport', 'Motorcycle', 'Bike', 'Walk', 'None'];

export const FOOD_TYPES = ['Meat Heavy', 'Balanced', 'Vegetarian', 'Vegan', 'None'];

export const BADGE_ICONS = {
  'Green Beginner': '🌱',
  'Carbon Saver': '📉',
  'Eco Warrior': '🛡️',
  'Sustainability Champion': '🏆'
};
