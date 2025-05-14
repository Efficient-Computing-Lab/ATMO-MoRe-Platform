import { useState } from "react";
import { getCSRFToken } from "../utils/CSRFToken";
import { useLanguage } from "../context/LanguageContext";
import security_strings from "../localizations/Security";

export function LoginProducer() {
    useLanguage();
    const django_server = process.env.REACT_APP_DJANGO_HOST;
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const loginExecute = async (username, password) => {
        setLoading(true);
        setError(null);
        setResponseData(null);

        const csrfToken = await getCSRFToken();

        try {
            const response = await fetch(`${django_server}/security/login/`, {
                method: "POST",
                credentials: "include", // important for session cookies
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`${security_strings.error_server}${response.status} - ${data.error ? data.error : data.detail}`);
            }            
            setResponseData(data);
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return { responseData, error, loading, loginExecute };
}
