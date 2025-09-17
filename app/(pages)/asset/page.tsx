import React from 'react'
import VehicleTableExample from './components/vehicleTableExample'
import AddVehicleButton from './components/AddVehicleButton'

const Assets = () => {
  return (
    <div className="bg-white w-full h-full flex items-center justify-center">
      <div className="w-[96%] h-[96%] flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Fleet Assets</h1>
          <div className="flex gap-3">
            <AddVehicleButton />
            <button className="border border-[#004953] text-[#004953] px-4 py-2 rounded-lg hover:bg-[#004953] hover:text-white transition-colors">
              Export Data
            </button>
          </div>
        </div>
          <VehicleTableExample />
      </div>
    </div>
  )
}

export default Assets