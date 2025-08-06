import React from 'react'
import DriversTable from './components/driversTable'
import OverviewRealTime from '@/app/components/cards/overviewRealTime'
import { drivers } from './components/driversList'

const Drivers = () => {
  // Calculate metrics from drivers data
  const totalDrivers = drivers.length
  const activeDrivers = drivers.filter(d => d.status === 'active').length
  const driversOnLeave = drivers.filter(d => d.status === 'on_leave').length
  const suspendedDrivers = drivers.filter(d => d.status === 'suspended').length
  const inactiveDrivers = drivers.filter(d => d.status === 'inactive').length
  
  // Calculate average safety score
  const averageSafetyScore = Math.round(
    drivers.reduce((sum, driver) => sum + driver.safetyScore, 0) / totalDrivers
  )
  
  // Calculate drivers with violations
  const driversWithViolations = drivers.filter(d => d.violations > 0).length
  
  // Calculate drivers with expiring licenses (within 30 days)
  const today = new Date()
  const driversWithExpiringLicenses = drivers.filter(d => {
    const expiryDate = new Date(d.licenseExpiry)
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }).length
  
  // Calculate unassigned drivers
  const unassignedDrivers = drivers.filter(d => !d.assignedVehicle).length

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Driver Management</h1>
        </div>
        
        {/* Driver Summary Cards */}
        <div className="flex justify-between gap-6">
          <OverviewRealTime
            title="Total Drivers"
            quantity={totalDrivers}
            description={`Active: ${activeDrivers}`}
          />
          <OverviewRealTime
            title="Active Drivers"
            quantity={activeDrivers}
            description={`On Leave: ${driversOnLeave}`}
          />
          <OverviewRealTime
            title="Drivers on Leave"
            quantity={driversOnLeave + suspendedDrivers + inactiveDrivers}
            description={`Suspended: ${suspendedDrivers}`}
          />
          <OverviewRealTime
            title="Average Safety Score"
            quantity={`${averageSafetyScore}%`}
            description={`With Violations: ${driversWithViolations}`}
          />
        </div>
        
        {/* Additional Driver Metrics */}
        <div className="flex justify-between gap-6">
          <OverviewRealTime
            title="Drivers with Violations"
            quantity={driversWithViolations}
            description="Need attention"
          />
          <OverviewRealTime
            title="Expiring Licenses"
            quantity={driversWithExpiringLicenses}
            description="Within 30 days"
          />
          <OverviewRealTime
            title="Unassigned Drivers"
            quantity={unassignedDrivers}
            description="Available for assignment"
          />
          <OverviewRealTime
            title="High-Risk Drivers"
            quantity={drivers.filter(d => d.safetyScore < 80 || d.violations > 5).length}
            description="Safety score < 80%"
          />
        </div>
        
        <DriversTable />
      </div>
    </div>
  )
}

export default Drivers
