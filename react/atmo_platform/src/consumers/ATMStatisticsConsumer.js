import { useEffect, useState } from 'react';
import analytics_strings from "../localizations/Analytics";
import consumer_strings from "../localizations/Consumers";
import { useLanguage } from "../context/LanguageContext";

function ATMStatisticsConsumer({ atmCode,setDataLoading,children }) {
    useLanguage();

    const django_server = process.env.REACT_APP_DJANGO_HOST;

    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: analytics_strings.supply_data,
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    });

    useEffect(() => {
        if (!atmCode) {
            console.error(`${consumer_strings.error_nodata}missing ATM code!`);
            return;
        }

        setLoading(true);
        setDataLoading(true);
        fetch(`${django_server}/data_handler/statistics/atm/${atmCode}`)
            .then((response) => response.json().then((data) => {
                if (!response.ok) {  
                    return Promise.reject(`${consumer_strings.error_server}${response.status} - ${data.error}`);
                }
                const labels = data.map((item) => (new Date(parseInt(item.timestamp))).toLocaleString().split(",")[0]);
                const values = data.map((item) => item.value);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: analytics_strings.supply_data,
                            data: values,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true,
                        },
                    ],
                });
                setLoading(false);
                setDataLoading(false);
            }))
            .catch((error) => {
                console.error(`${consumer_strings.error_nodata}${error}`);
                setLoading(false);
                setDataLoading(false);
            });
    }, [atmCode]);

    return children(chartData, loading);
}

export default ATMStatisticsConsumer;
