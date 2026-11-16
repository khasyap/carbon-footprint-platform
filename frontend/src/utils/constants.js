let rawApiUrl = process.env.NEXT_PUBLIC_API_URL;

// In production, ignore any localhost / 127.0.0.1 URLs because client browsers cannot reach server localhost
if (
  process.env.NODE_ENV === 'production' &&
  rawApiUrl &&
  (rawApiUrl.includes('localhost') || rawApiUrl.includes('127.0.0.1'))
) {
  rawApiUrl = '/api';
}

if (!rawApiUrl) {
  rawApiUrl = '/api';
}

let cleanUrl = rawApiUrl.trim().replace(/\/+$/, '');
if (!cleanUrl.startsWith('/') && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
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
