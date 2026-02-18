import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { userDocuments } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/app/auth";
import { supabase, BUCKET_NAME } from "@/lib/supabase";

export async function deleteUserDocument(
  request: NextRequest,
  userId: string,
  docId: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Get document to find storage path
    const doc = await db.query.userDocuments.findFirst({
      where: and(eq(userDocuments.id, docId), eq(userDocuments.userId, userId)),
    });

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 },
      );
    }

    // 2. Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([doc.storagePath]);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
    }

    // 3. Delete from DB
    await db.delete(userDocuments).where(eq(userDocuments.id, docId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
