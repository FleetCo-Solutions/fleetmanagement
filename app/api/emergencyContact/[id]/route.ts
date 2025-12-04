import { NextRequest } from "next/server";
import { putEmergencyContact } from "./put";
import { deleteEmergencyContact } from "./delete";
import { EmergencyContactPayload } from "@/app/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload: EmergencyContactPayload = await request.json();
  return putEmergencyContact(id, payload);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteEmergencyContact(id);
}
