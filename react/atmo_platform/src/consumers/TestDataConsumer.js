import { useEffect, useState } from 'react';
import { useLanguage } from "../context/LanguageContext";
import consumer_strings from "../localizations/Consumers";

function TestDataConsumer({ children }) {
    useLanguage();

    const django_server = process.env.REACT_APP_DJANGO_HOST;

    const [testData, setTestData] = useState("");

    useEffect(() => {
        const testDataJSON = sessionStorage.getItem("testDataJSON");

        if(!testDataJSON){
            sessionStorage.setItem("testDataJSON",JSON.stringify({"model":"genetic","data":[]}, null, 2));
            fetch(django_server+'/data_handler/create_test_data')
                .then((response) => response.json().then((data) => {
                    if (!response.ok) {  
                        return Promise.reject(`${consumer_strings.error_server}${response.status} - ${data.error}`);
                    }
                    setTestData(JSON.stringify({"model":"genetic","data":data}, null, 2));
                    sessionStorage.setItem("testDataJSON",JSON.stringify({"model":"genetic","data":data}, null, 2));
                })
            ).catch((error) => {
                console.error(`${consumer_strings.error_nodata}${error}`);
            });   
        }else{
            setTestData(testDataJSON);
        }         
    }, []);

    return children(testData);
}

export default TestDataConsumer;
