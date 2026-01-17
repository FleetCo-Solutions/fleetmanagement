"use server";
import { headers } from "next/headers";

const getBaseUrl = () =>
  process.env.LOCAL_BACKENDBASE_URL || "http://localhost:3000/api";

export async function getRoles() {
  try {
    const headersList = await headers();
    const response = await fetch(`${getBaseUrl()}/roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: headersList.get("cookie") || "",
      },
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to fetch roles");
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function addRole(roleData: {
  name: string;
  description?: string;
  permissionIds: string[];
}) {
  try {
    const headersList = await headers();
    const response = await fetch(`${getBaseUrl()}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: headersList.get("cookie") || "",
      },
      body: JSON.stringify(roleData),
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to create role");
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function updateRole(
  id: string,
  roleData: { name?: string; description?: string; permissionIds?: string[] }
) {
  try {
    const headersList = await headers();
    const response = await fetch(`${getBaseUrl()}/roles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: headersList.get("cookie") || "",
      },
      body: JSON.stringify(roleData),
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to update role");
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function deleteRole(id: string) {
  try {
    const headersList = await headers();
    const response = await fetch(`${getBaseUrl()}/roles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: headersList.get("cookie") || "",
      },
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to delete role");
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function getPermissions() {
  try {
    const headersList = await headers();
    const response = await fetch(`${getBaseUrl()}/permissions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: headersList.get("cookie") || "",
      },
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to fetch permissions");
    return result;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
