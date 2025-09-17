import React from 'react'
import DriversTable from './components/driversTable'
import DriversDashboard from './components/driversDashboard'

const Drivers = () => {

  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Driver Management</h1>
        </div>
        <DriversDashboard/>
        <DriversTable />
      </div>
    </div>
  )        

}

export default Drivers
