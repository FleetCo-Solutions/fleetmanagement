"use server";

import { headers } from "next/headers";

const BASE_URL = process.env.LOCAL_BACKENDBASE_URL;

export async function getVehicleDocuments(vehicleId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/vehicles/${vehicleId}/documents`,
      {
        method: "GET",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to fetch documents");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getVehicleDocumentsSummary(vehicleId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/vehicles/${vehicleId}/documents/summary`,
      {
        method: "GET",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to fetch document summary");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function uploadVehicleDocument(
  vehicleId: string,
  formData: FormData,
) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/vehicles/${vehicleId}/documents`,
      {
        method: "POST",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
        body: formData,
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to upload document");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateVehicleDocument(
  vehicleId: string,
  docId: string,
  formData: FormData,
) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/vehicles/${vehicleId}/documents/${docId}`,
      {
        method: "PUT",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
        body: formData,
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to update document");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteVehicleDocument(vehicleId: string, docId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/vehicles/${vehicleId}/documents/${docId}`,
      {
        method: "DELETE",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to delete document");
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// DRIVER DOCUMENTS
export async function getDriverDocuments(driverId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(`${BASE_URL}/drivers/${driverId}/documents`, {
      method: "GET",
      headers: {
        Cookie: headersList.get("cookie") || "",
      },
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to fetch driver documents");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getDriverDocumentsSummary(driverId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/drivers/${driverId}/documents/summary`,
      {
        method: "GET",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(
        result.error || "Failed to fetch driver document summary",
      );
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function uploadDriverDocument(
  driverId: string,
  formData: FormData,
) {
  try {
    const headersList = await headers();
    const response = await fetch(`${BASE_URL}/drivers/${driverId}/documents`, {
      method: "POST",
      headers: {
        Cookie: headersList.get("cookie") || "",
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to upload driver document");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateDriverDocument(
  driverId: string,
  docId: string,
  formData: FormData,
) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/drivers/${driverId}/documents/${docId}`,
      {
        method: "PUT",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
        body: formData,
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to update driver document");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteDriverDocument(driverId: string, docId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/drivers/${driverId}/documents/${docId}`,
      {
        method: "DELETE",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to delete driver document");
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// TRIP DOCUMENTS
export async function getTripDocuments(tripId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(`${BASE_URL}/trips/${tripId}/documents`, {
      method: "GET",
      headers: {
        Cookie: headersList.get("cookie") || "",
      },
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to fetch trip documents");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getTripDocumentsSummary(tripId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/trips/${tripId}/documents/summary`,
      {
        method: "GET",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to fetch trip document summary");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function uploadTripDocument(tripId: string, formData: FormData) {
  try {
    const headersList = await headers();
    const response = await fetch(`${BASE_URL}/trips/${tripId}/documents`, {
      method: "POST",
      headers: {
        Cookie: headersList.get("cookie") || "",
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to upload trip document");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateTripDocument(
  tripId: string,
  docId: string,
  formData: FormData,
) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/trips/${tripId}/documents/${docId}`,
      {
        method: "PUT",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
        body: formData,
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to update trip document");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteTripDocument(tripId: string, docId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/trips/${tripId}/documents/${docId}`,
      {
        method: "DELETE",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to delete trip document");
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// USER DOCUMENTS
export async function getUserDocuments(userId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(`${BASE_URL}/users/${userId}/documents`, {
      method: "GET",
      headers: {
        Cookie: headersList.get("cookie") || "",
      },
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to fetch user documents");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getUserDocumentsSummary(userId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/users/${userId}/documents/summary`,
      {
        method: "GET",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to fetch user document summary");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function uploadUserDocument(userId: string, formData: FormData) {
  try {
    const headersList = await headers();
    const response = await fetch(`${BASE_URL}/users/${userId}/documents`, {
      method: "POST",
      headers: {
        Cookie: headersList.get("cookie") || "",
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to upload user document");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateUserDocument(
  userId: string,
  docId: string,
  formData: FormData,
) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/users/${userId}/documents/${docId}`,
      {
        method: "PUT",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
        body: formData,
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to update user document");
    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteUserDocument(userId: string, docId: string) {
  try {
    const headersList = await headers();
    const response = await fetch(
      `${BASE_URL}/users/${userId}/documents/${docId}`,
      {
        method: "DELETE",
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to delete user document");
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
