import { useEffect, useState } from 'react';
import { useLanguage } from "../context/LanguageContext";
import consumer_strings from "../localizations/Consumers";

function ATMCodesConsumer({ children }) {
    useLanguage();

    const django_server = process.env.REACT_APP_DJANGO_HOST;

    const [ATMCodesData, setATMCodesData] = useState([]);

    useEffect(() => {
        fetch(django_server+'/data_handler/atm_codes')
            .then((response) => response.json().then((data) => {
                if (!response.ok) {  
                    return Promise.reject(`${consumer_strings.error_server}${response.status} - ${data.error}`);
                }
                setATMCodesData(data);
            })
        ).catch((error) => {
            console.error(`${consumer_strings.error_nodata}${error}`);
        });            
    }, []);

    return children(ATMCodesData);
}

export default ATMCodesConsumer;
