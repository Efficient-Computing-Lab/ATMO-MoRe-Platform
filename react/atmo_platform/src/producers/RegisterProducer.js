import { useState } from "react";
import { getCSRFToken } from "../utils/CSRFToken";
import { useLanguage } from "../context/LanguageContext";
import security_strings from "../localizations/Security";

export function RegisterProducer() {
  useLanguage();
  const django_server = process.env.REACT_APP_DJANGO_HOST;
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const RegisterProducerExecute = async (username, password, confirmPassword) => {
    setLoading(true);
    setResponseData(null);
    setError(null);

    const csrfToken = await getCSRFToken();

    if (password !== confirmPassword) {
      setError("passwords_mismatch");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${django_server}/security/register/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken
        },
        credentials: "include", // Needed to maintain session
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseData(data);
      } else {
        setError(`${security_strings.error_server}${response.status} - ${data.error ? data.error : data.detail}`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("network_error");
    }

    setLoading(false);
  };

  return {
    responseData,
    error,
    loading,
    RegisterProducerExecute,
  };
}
