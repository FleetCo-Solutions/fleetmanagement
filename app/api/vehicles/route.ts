import { NextRequest, NextResponse } from "next/server";
import { VehicleFormData } from "@/app/types";

export async function POST(request: NextRequest) {
  try {
    const body: VehicleFormData = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'vehicleRegNo',
      'group', 
      'model',
      'manufacturer',
      'year',
      'healthRate',
      'costPerMonth',
      'lastMaintenanceDate',
      'fuelEfficiency',
      'mileage',
      'driverId',
      'status'
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof VehicleFormData]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate data types and ranges
    if (body.year < 1900 || body.year > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { message: "Invalid year" },
        { status: 400 }
      );
    }

    if (body.healthRate < 0 || body.healthRate > 100) {
      return NextResponse.json(
        { message: "Health rate must be between 0 and 100" },
        { status: 400 }
      );
    }

    if (body.costPerMonth < 0) {
      return NextResponse.json(
        { message: "Cost per month must be positive" },
        { status: 400 }
      );
    }

    if (body.fuelEfficiency < 0) {
      return NextResponse.json(
        { message: "Fuel efficiency must be positive" },
        { status: 400 }
      );
    }

    if (body.mileage < 0) {
      return NextResponse.json(
        { message: "Mileage must be positive" },
        { status: 400 }
      );
    }

    if (body.driverId < 1) {
      return NextResponse.json(
        { message: "Driver ID must be valid" },
        { status: 400 }
      );
    }

    // TODO: Add database insertion logic here
    // For now, we'll just return a success response
    console.log("Vehicle data to be saved:", body);

    // Simulate database operation
    const vehicleId = Math.floor(Math.random() * 1000000);
    
    return NextResponse.json(
      {
        message: "Vehicle created successfully",
        data: {
          id: vehicleId,
          ...body
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement vehicle listing logic
    // For now, return empty array
    return NextResponse.json({
      message: "Vehicles retrieved successfully",
      data: []
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


