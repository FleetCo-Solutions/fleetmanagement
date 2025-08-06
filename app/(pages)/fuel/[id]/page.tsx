'use client'
import { useParams } from 'next/navigation'
import { fuelData } from '../components/fuelList'
import OverviewRealTime from '@/app/components/cards/overviewRealTime'
import React from 'react'

// Mock fuel history data
const getFuelHistory = (vehicleId: string) => {
  return [
    {
      date: '2024-06-01',
      amount: 45,
      cost: 135000,
      station: 'Shell - Dar es Salaam',
      odometer: 12500,
      efficiency: 8.5,
    },
    {
      date: '2024-05-25',
      amount: 50,
      cost: 150000,
      station: 'Total - Arusha',
      odometer: 12000,
      efficiency: 8.2,
    },
    {
      date: '2024-05-18',
      amount: 42,
      cost: 126000,
      station: 'Puma - Mwanza',
      odometer: 11500,
      efficiency: 8.8,
    },
    {
      date: '2024-05-11',
      amount: 48,
      cost: 144000,
      station: 'Shell - Dodoma',
      odometer: 11000,
      efficiency: 7.9,
    },
    {
      date: '2024-05-04',
      amount: 55,
      cost: 165000,
      station: 'Total - Morogoro',
      odometer: 10500,
      efficiency: 7.5,
    },
  ]
}

// Mock efficiency trends data
const getEfficiencyTrends = () => {
  return [
    { month: 'Jan', efficiency: 7.8 },
    { month: 'Feb', efficiency: 8.1 },
    { month: 'Mar', efficiency: 8.3 },
    { month: 'Apr', efficiency: 8.0 },
    { month: 'May', efficiency: 8.5 },
    { month: 'Jun', efficiency: 8.2 },
  ]
}

export default function FuelDetail() {
  const params = useParams()
  const vehicleId = params.id as string
  
  const vehicle = fuelData.find(v => v.vehicleId === vehicleId)
  
  if (!vehicle) {
    return (
      <div className="bg-white w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Vehicle Not Found</h1>
          <p className="text-black/70">The requested vehicle could not be found.</p>
        </div>
      </div>
    )
  }

  const fuelHistory = getFuelHistory(vehicleId)
  const efficiencyTrends = getEfficiencyTrends()
  
  // Calculate performance metrics
  const avgEfficiency = fuelHistory.reduce((sum, record) => sum + record.efficiency, 0) / fuelHistory.length
  const totalFuelCost = fuelHistory.reduce((sum, record) => sum + record.cost, 0)
  const totalFuelUsed = fuelHistory.reduce((sum, record) => sum + record.amount, 0)
  const avgCostPerLiter = totalFuelCost / totalFuelUsed

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Fuel Details</h1>
            <p className="text-black/70">{vehicle.vehicleRegNo} • {vehicle.driver}</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors">
              Add Refuel Record
            </button>
            <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <OverviewRealTime
            title="Current Fuel Level"
            quantity={`${vehicle.currentLevel}%`}
            description={`Next refuel: ${new Date(vehicle.nextRefuelDate).toLocaleDateString()}`}
          />
          <OverviewRealTime
            title="Average Efficiency"
            quantity={`${avgEfficiency.toFixed(1)} km/L`}
            description="Last 5 refuels"
          />
          <OverviewRealTime
            title="Monthly Fuel Cost"
            quantity={`TZS ${vehicle.monthlyCost.toLocaleString()}`}
            description={`${vehicle.monthlyConsumption}L consumed`}
          />
          <OverviewRealTime
            title="Fuel Wastage"
            quantity={`${vehicle.fuelWastage}L`}
            description="This month"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fuel Information - 40% */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-full">
              <h2 className="text-xl font-bold text-black mb-4">Fuel Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Fuel Type:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    vehicle.fuelType === 'diesel' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {vehicle.fuelType.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Current Level:</span>
                  <span className={`font-semibold ${
                    vehicle.currentLevel <= 20 ? 'text-red-600' : 
                    vehicle.currentLevel <= 40 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {vehicle.currentLevel}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Efficiency:</span>
                  <span className={`font-semibold ${
                    vehicle.efficiency >= 8.5 ? 'text-green-600' : 
                    vehicle.efficiency >= 7.0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {vehicle.efficiency} km/L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Last Refuel:</span>
                  <span className="text-black/70">{new Date(vehicle.lastRefuelDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Last Amount:</span>
                  <span className="text-black/70">{vehicle.lastRefuelAmount}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Last Cost:</span>
                  <span className="text-black/70">TZS {vehicle.lastRefuelCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Fuel Station:</span>
                  <span className="text-black/70">{vehicle.fuelStation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70">Next Refuel:</span>
                  <span className="text-black/70">{new Date(vehicle.nextRefuelDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fuel History - 60% */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-full">
              <h2 className="text-xl font-bold text-black mb-4">Fuel History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/20">
                      <th className="text-left py-2 font-semibold text-black/70">Date</th>
                      <th className="text-left py-2 font-semibold text-black/70">Amount (L)</th>
                      <th className="text-left py-2 font-semibold text-black/70">Cost (TZS)</th>
                      <th className="text-left py-2 font-semibold text-black/70">Efficiency</th>
                      <th className="text-left py-2 font-semibold text-black/70">Station</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fuelHistory.map((record, index) => (
                      <tr key={index} className="border-b border-black/10">
                        <td className="py-2 text-black/70">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="py-2 font-semibold text-black/70">{record.amount}L</td>
                        <td className="py-2 text-black/70">TZS {record.cost.toLocaleString()}</td>
                        <td className="py-2">
                          <span className={`font-semibold ${
                            record.efficiency >= 8.5 ? 'text-green-600' : 
                            record.efficiency >= 7.0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {record.efficiency} km/L
                          </span>
                        </td>
                        <td className="py-2 text-black/70">{record.station}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Analysis & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Analysis */}
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Cost Analysis</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">Total Fuel Cost:</span>
                <span className="text-black/70">TZS {totalFuelCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">Total Fuel Used:</span>
                <span className="text-black/70">{totalFuelUsed}L</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">Average Cost per Liter:</span>
                <span className="text-black/70">TZS {avgCostPerLiter.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">Monthly Average:</span>
                <span className="text-black/70">TZS {vehicle.monthlyCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70">Wastage Cost:</span>
                <span className="text-red-600">TZS {(vehicle.fuelWastage * 3000).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Efficiency Trends */}
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Efficiency Trends</h2>
            <div className="space-y-3">
              {efficiencyTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-semibold text-black/70">{trend.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(trend.efficiency / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`font-semibold ${
                      trend.efficiency >= 8.5 ? 'text-green-600' : 
                      trend.efficiency >= 7.0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {trend.efficiency} km/L
                    </span>
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