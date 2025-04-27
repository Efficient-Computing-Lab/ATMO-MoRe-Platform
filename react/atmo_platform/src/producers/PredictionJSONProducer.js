import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import prediction_strings from "../localizations/Prediction";

export function PredictionJSONProducer() {
    useLanguage();
    const django_server = process.env.REACT_APP_DJANGO_HOST;
    const [predictionJSONProducerResponse, setPredictionJSONProducerResponse] = useState(null);
    const [predictionJSONProducerError, setPredictionJSONProducerError] = useState(null);

    const predictionJSONProducerExecute = (jsonData) => {
        jsonData = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
        setPredictionJSONProducerResponse(null);
        setPredictionJSONProducerError(null);

        fetch(django_server + "/cash_predictor/apply_models_json", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(jsonData),
        })
        .then((response) => response.json().then((data) => {
            if (!response.ok) {  
                return Promise.reject(`${prediction_strings.error_server}${response.status} - ${data.error}`);
            }
            setPredictionJSONProducerResponse(data);
        }))
        .catch((error) => {
            console.error(prediction_strings.error_server, error);
            setPredictionJSONProducerError(error);
        });
    };

    return { predictionJSONProducerResponse, predictionJSONProducerError, predictionJSONProducerExecute };
}