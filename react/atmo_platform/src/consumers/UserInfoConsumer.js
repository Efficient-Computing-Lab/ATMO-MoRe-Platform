import { useEffect, useState } from 'react';
import { useLanguage } from "../context/LanguageContext";
import consumer_strings from "../localizations/Consumers";

function UserInfoConsumer({ children }) {
    useLanguage();

    const django_server = process.env.REACT_APP_DJANGO_HOST;

    const [UserInfoData, setUserInfoData] = useState("[]");

    useEffect(() => {
        fetch(django_server+'/security/user_info/', {
            method: "GET",
            credentials: "include", // important for session cookies
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
        }).then((response) => response.json().then((data) => {
                if (!response.ok) {  
                    return Promise.reject(`${consumer_strings.error_server}${response.status} - ${data.error}`);
                }
                setUserInfoData(JSON.stringify(data));
            })
        ).catch((error) => {
            console.error(`${consumer_strings.error_nodata}${error}`);
        });           
    }, []);

    return children(UserInfoData);
}

export default UserInfoConsumer;
