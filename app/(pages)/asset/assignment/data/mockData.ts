export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  year: number;
  status: 'active' | 'inactive' | 'maintenance';
  group: string;
}

export interface Assignment {
  id: string;
  driverName: string;
  startTime: string;
  endTime: string;
  vehicleId: string;
  date: string; // YYYY-MM-DD format
  status: 'active' | 'completed' | 'scheduled';
}

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    registrationNumber: "T 213 DFE",
    model: "Toyota Prius",
    year: 2018,
    status: "active",
    group: "Management"
  },
  {
    id: "2", 
    registrationNumber: "T 456 ABC",
    model: "Ford Transit",
    year: 2020,
    status: "active",
    group: "Logistics"
  },
  {
    id: "3",
    registrationNumber: "T 789 XYZ",
    model: "Mercedes Sprinter",
    year: 2019,
    status: "maintenance",
    group: "Transport"
  },
  {
    id: "4",
    registrationNumber: "T 321 GHI",
    model: "Nissan NV200",
    year: 2021,
    status: "active",
    group: "Emergency"
  },
  {
    id: "5",
    registrationNumber: "T 654 JKL",
    model: "Toyota Hiace",
    year: 2017,
    status: "inactive",
    group: "Management"
  },
  {
    id: "6",
    registrationNumber: "T 987 MNO",
    model: "Ford Ranger",
    year: 2022,
    status: "active",
    group: "Logistics"
  },
  {
    id: "7",
    registrationNumber: "T 147 PQR",
    model: "Isuzu D-Max",
    year: 2020,
    status: "active",
    group: "Transport"
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: "1",
    driverName: "Jacob Silva",
    startTime: "08:00 AM",
    endTime: "05:00 PM",
    vehicleId: "1",
    date: "2024-12-20",
    status: "active"
  },
  {
    id: "2",
    driverName: "Carlos Garcia",
    startTime: "06:00 AM",
    endTime: "02:00 PM",
    vehicleId: "2",
    date: "2024-12-20",
    status: "completed"
  },
  {
    id: "3",
    driverName: "Maria Rodriguez",
    startTime: "10:00 AM",
    endTime: "06:00 PM",
    vehicleId: "4",
    date: "2024-12-20",
    status: "scheduled"
  },
  {
    id: "4",
    driverName: "Ahmed Hassan",
    startTime: "12:00 PM",
    endTime: "08:00 PM",
    vehicleId: "6",
    date: "2024-12-20",
    status: "active"
  },
  {
    id: "5",
    driverName: "Sarah Johnson",
    startTime: "09:00 AM",
    endTime: "03:00 PM",
    vehicleId: "7",
    date: "2024-12-20",
    status: "completed"
  },
  // Assignments for different dates
  {
    id: "6",
    driverName: "Michael Brown",
    startTime: "07:00 AM",
    endTime: "04:00 PM",
    vehicleId: "1",
    date: "2024-12-21",
    status: "scheduled"
  },
  {
    id: "7",
    driverName: "Lisa Wang",
    startTime: "11:00 AM",
    endTime: "07:00 PM",
    vehicleId: "2",
    date: "2024-12-21",
    status: "scheduled"
  },
  {
    id: "8",
    driverName: "David Kim",
    startTime: "08:30 AM",
    endTime: "05:30 PM",
    vehicleId: "4",
    date: "2024-12-21",
    status: "scheduled"
  },
  // Today's assignments
  {
    id: "9",
    driverName: "Emma Wilson",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    vehicleId: "1",
    date: new Date().toISOString().split('T')[0],
    status: "active"
  },
  {
    id: "10",
    driverName: "James Taylor",
    startTime: "06:30 AM",
    endTime: "02:30 PM",
    vehicleId: "2",
    date: new Date().toISOString().split('T')[0],
    status: "completed"
  }
];

// Helper function to get assignments for a specific date
export const getAssignmentsForDate = (date: Date): Assignment[] => {
  const dateString = date.toISOString().split('T')[0];
  return mockAssignments.filter(assignment => assignment.date === dateString);
};

// Helper function to get vehicle by ID
export const getVehicleById = (id: string): Vehicle | undefined => {
  return mockVehicles.find(vehicle => vehicle.id === id);
};

