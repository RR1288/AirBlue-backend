const DUFFEL_API_KEY = process.env.DUFFEL_API_KEY;

exports.createOfferRequest = async ({
    origin,
    destination,
    departureDate,
    cabinClass,
}) => {
    try {
        const response = await fetch(
            // set return_offers to false
            "https://api.duffel.com/air/offer_requests?return_offers=false",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${DUFFEL_API_KEY}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Duffel-Version": "v1",
                },
                body: JSON.stringify({
                    data: {
                        slices: [
                            {
                                origin,
                                destination,
                                departure_date: departureDate,
                            },
                        ],
                        passengers: [{type: "adult"}],
                        cabin_class: cabinClass || "economy",
                    },
                }),
            }
        );

        if (response.ok) {
            const data = await response.json();
            // return offer request id
            return data.data.id;
        } else {
            throw new Error("Error creating an offer request");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error creating an offer request");
    }
};

exports.fetchOffers = async ({offerRequestId, limit, after, before}) => {
    try {
        let url = `https://api.duffel.com/air/offers?offer_request_id=${offerRequestId}&limit=${limit}`;

        if (after) url += `&after=${after}`;
        if (before) url += `&before=${before}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${DUFFEL_API_KEY}`,
                Accept: "application/json",
                "Duffel-Version": "v1",
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error("Error fetching offers");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching offers");
    }
};
