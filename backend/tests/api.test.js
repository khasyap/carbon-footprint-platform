const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

// Mock all Mongoose models
const User = require('../src/models/User');
const OtpCode = require('../src/models/OtpCode');
const CarbonRecord = require('../src/models/CarbonRecord');
const Activity = require('../src/models/Activity');
const Goal = require('../src/models/Goal');
const Challenge = require('../src/models/Challenge');

jest.mock('../src/models/User');
jest.mock('../src/models/OtpCode');
jest.mock('../src/models/CarbonRecord');
jest.mock('../src/models/Activity');
jest.mock('../src/models/Goal');
jest.mock('../src/models/Challenge');

// Mock Nodemailer email service
jest.mock('../src/services/emailService', () => ({
  sendOtpEmail: jest.fn().mockResolvedValue({ messageId: 'mock-email-id' }),
}));

// Mock Gemini AI config/service
jest.mock('../src/config/gemini', () => ({
  getGenerativeModel: jest.fn().mockReturnValue({
    generateContent: jest.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          recommendations: [
            { category: 'Transport', suggestion: 'Ride a bike', impact: 20, difficulty: 'Easy' }
          ],
          estimatedTotalReduction: 20,
          coachingTip: 'Keep it up!'
        })
      }
    })
  })
}));

describe('EcoCarbon Backend API Integration Tests', () => {
  let mockToken;
  const mockUserId = '60d5ec49f3e4b3e8c8f5f4b0';
  
  const mockUser = {
    _id: mockUserId,
    name: 'Ava Sterling',
    email: 'ava@example.com',
    password: 'hashedpassword123',
    role: 'USER',
    greenPoints: 150,
    badges: ['Green Beginner'],
    matchPassword: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true),
  };

  // Helper thenable query object to support both .findById(id) and .findById(id).select(...)
  const mockQuery = {
    select: jest.fn().mockReturnThis(),
    then: jest.fn().mockImplementation(function (callback) {
      return Promise.resolve(mockUser).then(callback);
    })
  };

  beforeAll(() => {
    // Generate a valid mock JWT token
    mockToken = jwt.sign(
      { id: mockUserId },
      process.env.JWT_SECRET || 'supersecret_carbon_key_123456',
      { expiresIn: '1h' }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementation for findById to return the thenable query
    User.findById.mockReturnValue(mockQuery);
  });

  // Test 1: Base route
  test('GET / should return api status running', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Carbon Footprint Platform API is running...' });
  });

  // Test 2: User registration request (OTP generation)
  test('POST /api/auth/register should send OTP validation code', async () => {
    User.findOne.mockResolvedValue(null); // No existing user
    OtpCode.deleteMany.mockResolvedValue({});
    OtpCode.create.mockResolvedValue({});

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ava Sterling',
        email: 'ava@example.com',
        password: 'Password123!',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.otpSent).toBe(true);
    expect(res.body.message).toContain('Verification code sent');
  });

  // Test 3: Verify Registration OTP and create user
  test('POST /api/auth/register/verify should verify code and create account', async () => {
    const mockOtpRecord = {
      email: 'ava@example.com',
      otp: '123456',
      name: 'Ava Sterling',
      password: 'hashedpassword123',
      action: 'REGISTER',
      _id: 'otp_id_123',
    };
    OtpCode.findOne.mockResolvedValue(mockOtpRecord);
    User.create.mockResolvedValue(mockUser);
    OtpCode.deleteOne.mockResolvedValue({});

    const res = await request(app)
      .post('/api/auth/register/verify')
      .send({
        email: 'ava@example.com',
        otp: '123456',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('ava@example.com');
    expect(res.body.data.token).toBeDefined();
  });

  // Test 4: User login credentials verification
  test('POST /api/auth/login should request 2FA for correct credentials', async () => {
    User.findOne.mockResolvedValue(mockUser);
    OtpCode.deleteMany.mockResolvedValue({});
    OtpCode.create.mockResolvedValue({});

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ava@example.com',
        password: 'Password123!',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.otpSent).toBe(true);
    expect(res.body.message).toContain('2FA security verification code sent');
  });

  // Test 5: Verify Login OTP and sign session token
  test('POST /api/auth/login/verify should authorize login with correct 2FA code', async () => {
    const mockOtpRecord = {
      email: 'ava@example.com',
      otp: '654321',
      action: 'LOGIN',
      _id: 'otp_id_456',
    };
    OtpCode.findOne.mockResolvedValue(mockOtpRecord);
    User.findOne.mockResolvedValue(mockUser);
    OtpCode.deleteOne.mockResolvedValue({});

    const res = await request(app)
      .post('/api/auth/login/verify')
      .send({
        email: 'ava@example.com',
        otp: '654321',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  // Test 6: GET User Profile (Protected Route)
  test('GET /api/auth/profile should fetch profile details for authenticated user', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('ava@example.com');
  });

  // Test 7: Log Carbon activity & calculate emissions (Protected Route)
  test('POST /api/carbon/log should log activity and return calculations', async () => {
    // Mock Mongoose save model instances
    const saveMock = jest.fn().mockResolvedValue({
      _id: 'activity_id_789',
      transportType: 'Car',
      distance: 50,
      electricityUnits: 10,
      waterUsage: 20,
      foodType: 'Vegetarian',
      wasteGenerated: 5,
    });
    Activity.mockImplementation(() => ({
      save: saveMock,
      _id: 'activity_id_789',
      transportType: 'Car',
      distance: 50,
      electricityUnits: 10,
      waterUsage: 20,
      foodType: 'Vegetarian',
      wasteGenerated: 5,
    }));

    CarbonRecord.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
    }));

    const res = await request(app)
      .post('/api/carbon/log')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        transportType: 'Car',
        distance: 50,
        electricityUnits: 10,
        waterUsage: 20,
        foodType: 'Vegetarian',
        wasteGenerated: 5,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pointsEarned).toBeDefined();
  });

  // Test 8: GET Carbon Logs List
  test('GET /api/carbon/logs should return saved logs list', async () => {
    const mockLogs = [
      { totalEmission: 25.5, date: new Date() }
    ];
    CarbonRecord.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockLogs)
      })
    });

    const res = await request(app)
      .get('/api/carbon/logs')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  // Test 9: GET Carbon stats grouped aggregation
  test('GET /api/carbon/stats should aggregate carbon emissions data', async () => {
    const mockStats = [
      {
        totalTransport: 10.5,
        totalElectricity: 8.2,
        totalFood: 2.1,
        totalWaste: 1.5,
        totalEmissions: 22.3,
        count: 1
      }
    ];
    CarbonRecord.aggregate.mockResolvedValue(mockStats);

    const res = await request(app)
      .get('/api/carbon/stats')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalEmissions).toBe(22.3);
  });

  // Test 10: GET User active carbon budgets / goals
  test('GET /api/goals should return user active goals list', async () => {
    const mockGoals = [
      {
        _id: 'goal_111',
        targetEmission: 300,
        currentEmission: 0,
        status: 'IN_PROGRESS',
        createdAt: new Date(),
        save: jest.fn().mockResolvedValue(true),
      }
    ];
    Goal.find.mockResolvedValue(mockGoals);
    CarbonRecord.find.mockResolvedValue([]); // No records since goal created

    const res = await request(app)
      .get('/api/goals')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].targetEmission).toBe(300);
  });

  // Test 11: POST create new carbon budget goal
  test('POST /api/goals should create new budget goal', async () => {
    CarbonRecord.find.mockResolvedValue([]); // No records in current month
    Goal.create.mockResolvedValue({
      _id: 'goal_222',
      userId: mockUserId,
      targetEmission: 250,
      currentEmission: 0,
      status: 'IN_PROGRESS'
    });

    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        targetEmission: 250
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.targetEmission).toBe(250);
  });

  // Test 12: GET community challenges
  test('GET /api/challenges should list challenges and seed them if empty', async () => {
    Challenge.find.mockResolvedValue([
      { title: 'No Plastic Week', rewardPoints: 100, duration: '7 Days', participants: [] }
    ]);

    const res = await request(app)
      .get('/api/challenges')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].title).toBe('No Plastic Week');
  });
});
