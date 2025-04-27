import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import prediction_strings from "../localizations/Prediction";

export function PredictionCSVProducer() {
    useLanguage();
    const django_server = process.env.REACT_APP_DJANGO_HOST;
    const [predictionCSVProducerResponse, setPredictionCSVProducerResponse] = useState(null);
    const [predictionCSVProducerError, setPredictionCSVProducerError] = useState(null);

    const predictionCSVProducerExecute = (formData) => {
        setPredictionCSVProducerResponse(null);
        setPredictionCSVProducerError(null);

        fetch(django_server + "/cash_predictor/apply_models_csv", {
            method: "POST",
            body: formData,
        })
        .then((response) => response.json().then((data) => {
            if (!response.ok) {  
                return Promise.reject(`${prediction_strings.error_server}${response.status} - ${data.error}`);
            }
            setPredictionCSVProducerResponse(data);
        }))
        .catch((error) => {
            console.error(prediction_strings.error_server, error);
            setPredictionCSVProducerError(error);
        });
    };

    return { predictionCSVProducerResponse, predictionCSVProducerError, predictionCSVProducerExecute };
}