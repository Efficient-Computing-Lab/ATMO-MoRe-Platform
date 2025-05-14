import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { getCSRFToken } from "../utils/CSRFToken";

function PrivateRoute({ children }) {
  useLanguage();
  const django_server = process.env.REACT_APP_DJANGO_HOST;
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkLogin = async () =>{
    const csrfToken = await getCSRFToken();
    try{
        const response = await fetch(django_server+'/security/user_info/', {
            method: "GET",
            credentials: "include", // important for session cookies
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
        });

        await response.json();

        if (!response.ok) {
            setIsAuthenticated(false);
        }else{
            setIsAuthenticated(true);
        }            
    } catch (err) {
        setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    checkLogin();        
  }, []);

  if (isAuthenticated === null) return null; // or a loading spinner
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
