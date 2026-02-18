import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { vehicleDocuments } from "@/app/db/schema";
import { auth } from "@/app/auth";
import { supabase, BUCKET_NAME } from "@/lib/supabase";

export async function uploadVehicleDocument(
  request: NextRequest,
  vehicleId: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const expiryDate = formData.get("expiryDate") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // Prepare filename and path
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `vehicles/${vehicleId}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Supabase upload error: ${uploadError.message}`);
    }
    console.log("uploadData", uploadData);
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // Save to DB
    const [newDoc] = await db
      .insert(vehicleDocuments)
      .values({
        vehicleId,
        title,
        description: description || null,
        storagePath: filePath,
        storageUrl: urlData.publicUrl,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      })
      .returning();

    return NextResponse.json({ success: true, data: newDoc });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
