import { useState } from "react";

export function DatahandlerRefreshProducer() {
    const django_server = process.env.REACT_APP_DJANGO_HOST;
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);

    const datahandlerRefreshProducerExecute = () => {
        setResponseData(null);
        setError(null);

        fetch(django_server + "/data_handler/refresh_data", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => response.json())
            .then((data) => {
                setResponseData(data);
            })
            .catch((error) => {
                console.error("Error refreshing data:", error);
                setError(error);
            });
    };

    return { responseData, error, datahandlerRefreshProducerExecute };
}