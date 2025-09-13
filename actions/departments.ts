'use server'

import { auth } from "@/app/auth";

export async function getDepartments() {
    const session = await auth();
    try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/department`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.userToken}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result.message}`);
    }

    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
    
}