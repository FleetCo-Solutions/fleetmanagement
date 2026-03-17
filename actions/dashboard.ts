"use server";

import { mockDashboardData } from "@/data/mockData";

export async function getDashboardSummary() {
  // Return mock data for development
  return mockDashboardData;
}
