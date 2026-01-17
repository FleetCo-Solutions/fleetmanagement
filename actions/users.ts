"use server";

import { IAddUser, IEditUser, IUsers, UserDetails } from "@/app/types";
import { headers } from "next/headers";

export async function getUsers(): Promise<IUsers> {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/users/usersByCompanyId`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch users");
    }

    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getUserDetails(id: string): Promise<UserDetails> {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/users/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch user details");
    }

    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function addUser(userData: IAddUser) {
  const headersList = await headers();
  const response = await fetch(`${process.env.LOCAL_BACKENDBASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: headersList.get("cookie") || "",
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create user");
  }

  return {
    timestamp: new Date(),
    statusCode: "201",
    message: result.message,
    dto: result.dto,
  };
}

export async function updateUser(id: string, userData: IEditUser) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/users/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update user");
    }

    return {
      timestamp: new Date(),
      statusCode: "200",
      message: result.message,
      dto: result.dto,
    };
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function toggleUserStatus(id: number, status: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/user/status/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify({ status: status }),
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

export async function changePassword({
  userId,
  password,
  oldPassword,
}: {
  userId: string;
  password: string;
  oldPassword: string;
}) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${process.env.LOCAL_BACKENDBASE_URL}/auth/resetPassword`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: headersList.get("cookie") || "",
        },
        body: JSON.stringify({
          userId: userId,
          password: password,
          oldPassword: oldPassword,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to change password");
    }
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
