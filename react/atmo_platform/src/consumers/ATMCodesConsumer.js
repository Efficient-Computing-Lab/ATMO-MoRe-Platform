import { useEffect, useState } from 'react';
import { useLanguage } from "../context/LanguageContext";
import consumer_strings from "../localizations/Consumers";

function ATMCodesConsumer({ children }) {
    useLanguage();

    const django_server = process.env.REACT_APP_DJANGO_HOST;

    const [ATMCodesData, setATMCodesData] = useState("[]");

    useEffect(() => {
        const atmCodesList = sessionStorage.getItem("atmCodesList");

        if(!atmCodesList){
            sessionStorage.setItem("atmCodesList",JSON.stringify(ATMCodesData, null, 2));

            fetch(django_server+'/data_handler/atm_codes')
                .then((response) => response.json().then((data) => {
                    if (!response.ok) {  
                        return Promise.reject(`${consumer_strings.error_server}${response.status} - ${data.error}`);
                    }
                    setATMCodesData(JSON.stringify(data));
                    sessionStorage.setItem("atmCodesList",JSON.stringify(data, null, 2));
                })
            ).catch((error) => {
                console.error(`${consumer_strings.error_nodata}${error}`);
            });
        }else{
            setATMCodesData(atmCodesList);
        }            
    }, []);

    return children(ATMCodesData);
}

export default ATMCodesConsumer;
