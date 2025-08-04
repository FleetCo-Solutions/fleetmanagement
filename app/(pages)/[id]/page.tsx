'use client'
import { useParams } from 'next/navigation'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'

// Mock vehicle data - in real app this would come from API
const vehicleData = {
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'en route':
      return 'bg-blue-100 text-blue-800'
    case 'available':
      return 'bg-green-100 text-green-800'
    case 'out of service':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getMaintenanceStatusColor = (status: string) => {
  switch (status) {
    case 'good':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500'
    case 'medium':
      return 'bg-yellow-500'
    case 'low':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

export default function VehicleDetails() {
  const params = useParams()
  const vehicleId = params.id

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#004953] p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
                <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
                <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">{vehicleData.vehicleRegNo}</h1>
              <p className="text-black/60">{vehicleData.model} • {vehicleData.manufacturer}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#004953] text-white px-6 py-2 rounded-lg hover:bg-[#014852] transition-colors">
              Edit Vehicle
            </button>
            <button className="border border-[#004953] text-[#004953] px-6 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
              Print Report
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Vehicle Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">VIN Number</span>
                    <span className="font-semibold text-black">{vehicleData.vin}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">License Plate</span>
                    <span className="font-semibold text-black">{vehicleData.licensePlate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Year</span>
                    <span className="font-semibold text-black">{vehicleData.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Engine</span>
                    <span className="font-semibold text-black">{vehicleData.engineSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Transmission</span>
                    <span className="font-semibold text-black">{vehicleData.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Fuel Type</span>
                    <span className="font-semibold text-black">{vehicleData.fuelType}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Primary Driver</span>
                    <span className="font-semibold text-black">{vehicleData.driver}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Substitute Driver</span>
                    <span className="font-semibold text-black border border-[#004953] px-2 py-1 rounded text-[#004953] text-sm">
                      {vehicleData.substituteDriver}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Average Speed</span>
                    <span className="font-semibold text-black">{vehicleData.averageSpeed} km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Mileage</span>
                    <span className="font-semibold text-black">{vehicleData.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Fuel Efficiency</span>
                    <span className="font-semibold text-black">{vehicleData.fuelEfficiency} km/L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicleData.status)}`}>
                      {vehicleData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Indicators Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-fit">
              <h2 className="text-xl font-bold text-black mb-4">Key Indicators</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vehicleData.keyIndicators}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {vehicleData.keyIndicators.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {vehicleData.keyIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: indicator.color }}></div>
                      <span className="text-sm text-black/70">{indicator.name}</span>
                    </div>
                    <span className="font-semibold text-black">{indicator.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Monitoring Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-fit">
              <h2 className="text-xl font-bold text-black mb-4">Real-time Monitoring</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Current Speed</span>
                  <span className="font-bold text-blue-600">{vehicleData.realTimeData.currentSpeed} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Engine RPM</span>
                  <span className="font-bold text-green-600">{vehicleData.realTimeData.engineRPM}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Fuel Level</span>
                  <span className="font-bold text-orange-600">{vehicleData.realTimeData.fuelLevel}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Engine Temp</span>
                  <span className="font-bold text-red-600">{vehicleData.realTimeData.engineTemp}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Battery</span>
                  <span className="font-bold text-purple-600">{vehicleData.realTimeData.batteryVoltage}V</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Oil Pressure</span>
                  <span className="font-bold text-indigo-600">{vehicleData.realTimeData.oilPressure} PSI</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800 font-semibold">Current Location</div>
                  <div className="text-sm text-blue-600">{vehicleData.currentLocation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Trip History & Financial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trip History */}
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Recent Trip History</h2>
            <div className="space-y-3">
              {vehicleData.tripHistory.map((trip, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-black">{trip.destination}</div>
                      <div className="text-sm text-black/60">{new Date(trip.date).toLocaleDateString()} • {trip.driver}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-black">{trip.distance} km</div>
                    <div className="text-sm text-black/60">${trip.cost}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Tracking */}
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Financial Overview</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">Total Cost (4 months)</div>
                  <div className="text-xl font-bold text-green-800">${vehicleData.financialData.totalCost.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">Depreciation</div>
                  <div className="text-xl font-bold text-blue-800">${vehicleData.financialData.depreciation.toLocaleString()}</div>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vehicleData.financialData.monthlyCosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fuel" fill="#F59E0B" />
                    <Bar dataKey="maintenance" fill="#EF4444" />
                    <Bar dataKey="insurance" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Third Row - Compliance & Maintenance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance & Documentation */}
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Compliance & Documentation</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <div>
                  <div className="font-semibold text-black">Insurance Expiry</div>
                  <div className="text-sm text-black/60">{new Date(vehicleData.financialData.insuranceExpiry).toLocaleDateString()}</div>
                </div>
                <span className="text-yellow-600 font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <div>
                  <div className="font-semibold text-black">Registration Expiry</div>
                  <div className="text-sm text-black/60">{new Date(vehicleData.financialData.registrationExpiry).toLocaleDateString()}</div>
                </div>
                <span className="text-red-600 font-semibold">Expiring Soon</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-black/60">Safety Certificate</div>
                  <div className="font-semibold text-black">Valid</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-black/60">Emission Test</div>
                  <div className="font-semibold text-black">Passed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Breakdown */}
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Maintenance Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vehicleData.maintenance.map((item, index) => (
                <div key={index} className={`border rounded-lg p-3 ${getMaintenanceStatusColor(item.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-semibold text-black text-sm">{item.item}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)}`}></div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-black/60">Condition:</span>
                      <span className="font-semibold">{item.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Next:</span>
                      <span className="font-semibold">{new Date(item.nextService).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}    