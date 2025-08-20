'use client'
import { useParams } from 'next/navigation'
import { ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'
import VehicleInfoCard from './components/VehicleInfoCard'
// import KeyIndicatorsCard from './components/KeyIndicatorsCard' // Unused import removed
import RealTimeMonitoringCard from './components/RealTimeMonitoringCard'
import TripHistoryCard from './components/TripHistoryCard'
import { vehicleData } from './components/vehicleData'


export default function VehicleDetails() {
  // const params = useParams() // Unused variable removed
  // const vehicleId = params.id // Unused variable removed

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
          <div className="lg:col-span-2">
          <TripHistoryCard vehicleData={vehicleData} />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <VehicleInfoCard vehicleData={vehicleData} />
            <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-full">
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
              <div className="h-56">
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
        </div>

        {/* Second Row - Trip History & Financial */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Maintenance Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vehicleData.maintenance.map((item, index) => (
                <div key={index} className={`border rounded-lg p-3 bg-green-100 text-green-800 border-green-200`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-semibold text-black text-sm">{item.item}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
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
          {/* <KeyIndicatorsCard vehicleData={vehicleData} />   */}
          {/* Financial Tracking (leave as is for now) */}
          
          <div className="lg:col-span-1 h-full">
            <RealTimeMonitoringCard vehicleData={vehicleData} />
          </div>
        </div>
      </div>
    </div>
  )
}    