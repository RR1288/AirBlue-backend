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

exports.fetchFlight = async (offer_id) => {
    try {
        // Fetch flight details from Duffel API
        const response = await fetch(
            `https://api.duffel.com/air/offers/${offer_id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${DUFFEL_API_KEY}`,
                    Accept: "application/json",
                    "Duffel-Version": "v1",
                },
            }
        );

        if (response.ok) {
            const offer = await response.json();
            // Check expires_at
            // Check live_mode
            // Check total_amount unchanged
            // Check available_services
            // const now = new Date();
            // const expiresAt = new Date(offer.expires_at);
            // if (
            //     offer.live_mode === true &&
            //     expiresAt > now &&
            //     offer.available_services.length > 0
            // ) {
            //     return offer.data;
            // }
            return offer.data;
            // throw new Error("Flight no longer available");
        } else {
            throw new Error("Error fetching offer. Response not OK");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching offer");
    }
};

exports.bookOfferOrHold = async (offer_id, passengers, payments) => {
    try {
        let body = {
            data: {
                selected_offers: [offer_id],
                passengers: passengers,
                payments: payments,
            },
        };
        body = JSON.stringify(body);
        console.log(body);

        // Fetch flight details from Duffel API
        const response = await fetch("https://api.duffel.com/air/orders", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${DUFFEL_API_KEY}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "Duffel-Version": "v1",
            },
            body: body,
        });
        console.log(response);

        if (response.ok) {
            const order = await response.json();
            console.log(order);
            return order.data;
        } else {
            throw new Error("Error booking flight. Response not OK");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error booking flight");
    }
};
