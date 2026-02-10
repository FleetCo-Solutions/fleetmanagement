import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { driverDocuments } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/app/auth";
import { supabase, BUCKET_NAME } from "@/lib/supabase";

export async function updateDriverDocument(
  request: NextRequest,
  driverId: string,
  docId: string,
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

    // 1. Get existing document
    const oldDoc = await db.query.driverDocuments.findFirst({
      where: and(
        eq(driverDocuments.id, docId),
        eq(driverDocuments.driverId, driverId),
      ),
    });

    if (!oldDoc) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 },
      );
    }

    let updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description || null;
    if (expiryDate !== undefined)
      updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;

    // 2. If new file provided, replace in Supabase Storage
    if (file) {
      // Delete old file
      await supabase.storage.from(BUCKET_NAME).remove([oldDoc.storagePath]);

      // Upload new file
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `drivers/${driverId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Supabase upload error: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      updateData.storagePath = filePath;
      updateData.storageUrl = urlData.publicUrl;
    }

    // 3. Update DB
    const [updatedDoc] = await db
      .update(driverDocuments)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(driverDocuments.id, docId))
      .returning();

    return NextResponse.json({ success: true, data: updatedDoc });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
