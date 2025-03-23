export interface BaseResponse{
    valid: boolean;
}

export async function fetchMoloniAPI<T>(url: string, payload: any = {}, method = 'POST'): Promise<T> {
    const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    };

    const response = await fetch(url, options);
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}
