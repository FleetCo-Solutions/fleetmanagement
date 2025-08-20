export const vehicleData = {
    id: '1',
    vehicleRegNo: 'T 123 ABC',
    model: 'Toyota Hiace',
    manufacturer: 'Toyota',
    vin: '1HGBH41JXMN109186',
    licensePlate: 'T 123 ABC',
    driver: 'John Doe',
    substituteDriver: 'Jane Smith',
    averageSpeed: 65,
    mileage: 45000,
    year: 2022,
    fuelType: 'Diesel',
    engineSize: '2.8L',
    transmission: 'Manual',
    color: 'White',
    status: 'en route',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    fuelEfficiency: 12.5,
    healthRate: 85,
    currentLocation: 'Dar es Salaam, Tanzania',
    currentSpeed: 45,
    fuelLevel: 75,
    engineTemp: 85,
    // Key indicators data
    keyIndicators: [
      { name: 'Engine', value: 92, color: '#10B981' },
      { name: 'Battery', value: 78, color: '#F59E0B' },
      { name: 'Oil', value: 85, color: '#3B82F6' },
      { name: 'Fuel System', value: 88, color: '#8B5CF6' },
      { name: 'Transmission', value: 90, color: '#EF4444' },
      { name: 'Cooling System', value: 82, color: '#06B6D4' },
    ],
    // Trip history data
    tripHistory: [
      { date: '2024-01-30', destination: 'Dar es Salaam', distance: 120, fuelUsed: 9.6, cost: 240, driver: 'John Doe' },
      { date: '2024-01-29', destination: 'Arusha', distance: 450, fuelUsed: 36.0, cost: 900, driver: 'John Doe' },
      { date: '2024-01-28', destination: 'Mwanza', distance: 380, fuelUsed: 30.4, cost: 760, driver: 'Jane Smith' },
      { date: '2024-01-27', destination: 'Dodoma', distance: 280, fuelUsed: 22.4, cost: 560, driver: 'John Doe' },
      { date: '2024-01-26', destination: 'Morogoro', distance: 180, fuelUsed: 14.4, cost: 360, driver: 'Jane Smith' },
    ],
    // Financial data
    financialData: {
      monthlyCosts: [
        { month: 'Jan', fuel: 2400, maintenance: 800, insurance: 500, total: 3700 },
        { month: 'Feb', fuel: 2200, maintenance: 600, insurance: 500, total: 3300 },
        { month: 'Mar', fuel: 2600, maintenance: 1200, insurance: 500, total: 4300 },
        { month: 'Apr', fuel: 2300, maintenance: 400, insurance: 500, total: 3200 },
      ],
      totalCost: 14500,
      depreciation: 8500,
      insuranceExpiry: '2024-12-31',
      registrationExpiry: '2024-06-15',
    },
    // Real-time data
    realTimeData: {
      currentSpeed: 45,
      engineRPM: 2200,
      fuelLevel: 75,
      engineTemp: 85,
      batteryVoltage: 12.6,
      oilPressure: 45,
    },
    // Maintenance data
    maintenance: [
      {
        item: 'Brakes',
        icon: '🛑',
        status: 'good',
        lastService: '2024-01-10',
        nextService: '2024-07-10',
        condition: 'Good',
        priority: 'low'
      },
      {
        item: 'Oil Filter',
        icon: '🔧',
        status: 'warning',
        lastService: '2024-01-15',
        nextService: '2024-03-15',
        condition: 'Needs Attention',
        priority: 'medium'
      },
      {
        item: 'Air Filter',
        icon: '💨',
        status: 'good',
        lastService: '2024-01-15',
        nextService: '2024-04-15',
        condition: 'Good',
        priority: 'low'
      },
      {
        item: 'Tires',
        icon: '🛞',
        status: 'overdue',
        lastService: '2023-12-01',
        nextService: '2024-02-01',
        condition: 'Critical',
        priority: 'high'
      },
      {
        item: 'Planned Inspection',
        icon: '🔍',
        status: 'upcoming',
        lastService: '2024-01-01',
        nextService: '2024-03-01',
        condition: 'Scheduled',
        priority: 'medium'
      },
      {
        item: 'Fuel Filter',
        icon: '⛽',
        status: 'good',
        lastService: '2024-01-15',
        nextService: '2024-06-15',
        condition: 'Good',
        priority: 'low'
      }
    ]
  }