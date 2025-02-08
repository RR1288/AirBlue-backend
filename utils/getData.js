async function getData(endpoint, token) {
    const res = await fetch(endpoint, {
        headers: {
            'Authorization': `Bearer ${token}`, // Attach token to request
        },
    });

    const result = await res.json();
    if (!result.success) {
        throw new Error(`Error in response: ${result.message}`);
    }
    
    return result.data;
}


export default getData;
