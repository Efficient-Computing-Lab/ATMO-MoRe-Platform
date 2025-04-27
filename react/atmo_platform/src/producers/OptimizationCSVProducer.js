import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import optimization_strings from "../localizations/Optimization";

export function OptimizationCSVProducer() {
    useLanguage();
    const django_server = process.env.REACT_APP_DJANGO_HOST;
    const [optimizationCSVProducerResponse, setOptimizationCSVProducerResponse] = useState(null);
    const [optimizationCSVProducerError, setOptimizationCSVProducerError] = useState(null);

    const optimizationCSVProducerExecute = (formData) => {
        setOptimizationCSVProducerResponse(null);
        setOptimizationCSVProducerError(null);

        fetch(django_server + "/supply_optimizer/visualize_plans_csv", {
            method: "POST",
            body: formData,
        })
        .then((response) => response.json().then((data) => {
            if (!response.ok) {  
                return Promise.reject(`${optimization_strings.error_server}${response.status} - ${data.error}`);
            }
            setOptimizationCSVProducerResponse(data.html);
        }))
        .catch((error) => {
            console.error(optimization_strings.error_server, error);
            setOptimizationCSVProducerError(error);
        });
    };

    return { optimizationCSVProducerResponse, optimizationCSVProducerError, optimizationCSVProducerExecute };
}