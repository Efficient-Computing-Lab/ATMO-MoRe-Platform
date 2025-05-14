import { useState } from "react";
import { getCSRFToken } from "../utils/CSRFToken";
import { useLanguage } from "../context/LanguageContext";
import security_strings from "../localizations/Security";

export function LogoutProducer() {
    useLanguage();
    const django_server = process.env.REACT_APP_DJANGO_HOST;
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);

    const logoutExecute = async () => {
        setResponseData(null);
        setError(null);

        const csrfToken = await getCSRFToken();

        fetch(django_server + "/security/logout/", {
            method: "POST",
            credentials: "include",
            headers: { 
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            }
        })
            .then((response) => response.json().then((data) => {
                if (!response.ok) {  
                    return Promise.reject(`${security_strings.error_server}${response.status} - ${data.error ? data.error : data.detail}`);
                }
                setResponseData(data);
            }))
            .catch((error) => {
                console.error("Error refreshing data:", error);
                setError(error);
            });
    };

    return { responseData, error, logoutExecute };
}