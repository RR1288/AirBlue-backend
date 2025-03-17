async function getData(endpoint, method, body) {
    const DUFFEL_API_KEY = process.env.DUFFEL_API_KEY;

    const response = await fetch(endpoint, {
        method: method,
        headers: {
            Authorization: `Bearer ${DUFFEL_API_KEY}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "Duffel-Version": "v1",
        },
        body: JSON.stringify(body)
    });

    const result = await response.json();
    if (!result.success) {
        throw new Error(`Error in response: ${result.message}`);
    }

    return result.data;
}

export default getData;
