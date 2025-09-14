"use server";

import { auth } from "@/app/auth";
import { IAddUser } from "@/app/types";

export async function getUsers() {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.BACKENDBASE_URL}/v1/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.userToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result.message}`);
    }

    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function addUser(userData: IAddUser) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.BACKENDBASE_URL}/v1/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.userToken}`,
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add user");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function updateUser(id: number, userData: IAddUser) {
  const session = await auth();
  try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/user/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.userToken}`,
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update user");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function toggleUserStatus(id: number,status: string) {
  const session = await auth();
  try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/user/status/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.userToken}`,
        },
        body: JSON.stringify({status: status}),
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to toggle user status");
    }
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
