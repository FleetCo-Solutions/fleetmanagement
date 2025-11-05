'use server'


export async function getDepartments() {
    try {
    const response = await fetch(
      `${process.env.BACKENDBASE_URL}/v1/department`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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