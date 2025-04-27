import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import optimization_strings from "../localizations/Optimization";

export function OptimizationJSONProducer() {
    useLanguage();
    const django_server = process.env.REACT_APP_DJANGO_HOST;
    const [optimizationJSONProducerResponse, setOptimizationJSONProducerResponse] = useState(null);
    const [optimizationJSONProducerError, setOptimizationJSONProducerError] = useState(null);

    const optimizationJSONProducerExecute = (jsonData) => {
        jsonData = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
        setOptimizationJSONProducerResponse(null);
        setOptimizationJSONProducerError(null);

        fetch(django_server + "/supply_optimizer/visualize_plans_json", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(jsonData),
        })
        .then((response) => response.json().then((data) => {
            if (!response.ok) {  
                return Promise.reject(`${optimization_strings.error_server}${response.status} - ${data.error}`);
            }
            setOptimizationJSONProducerResponse(data.html);
        }))
        .catch((error) => {
            console.error(optimization_strings.error_server, error);
            setOptimizationJSONProducerError(error);
        });
    };

    return { optimizationJSONProducerResponse, optimizationJSONProducerError, optimizationJSONProducerExecute };
}