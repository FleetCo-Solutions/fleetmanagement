"use server";

import { IAddUser } from "@/app/types";

export async function getUsers() {
  try {
    const response = await fetch(`${process.env.LOCAL_BACKENDBASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Your results", result)
    if (!response.ok) {
      throw new Error(`${result.message}`);
    }

    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function addUser(userData: IAddUser) {
  try {
    const response = await fetch(`${process.env.LOCAL_BACKENDBASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/user/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
  try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/user/status/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
