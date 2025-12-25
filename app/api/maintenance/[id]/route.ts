import { NextRequest } from "next/server";
import { putMaintenanceRecord } from "./put";
import { deleteMaintenanceRecord } from "./delete";
import { getMaintenanceRecordById } from "./get";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params;
  return putMaintenanceRecord(request, id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params;
  return deleteMaintenanceRecord(id);
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const {id} = await params;
    return getMaintenanceRecordById(id);
}
