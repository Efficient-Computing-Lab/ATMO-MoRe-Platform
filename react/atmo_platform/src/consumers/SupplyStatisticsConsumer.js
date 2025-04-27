import { useEffect, useState } from 'react';
import analytics_strings from "../localizations/Analytics";
import { useLanguage } from "../context/LanguageContext";

function SupplyStatisticsConsumer({ children }) {
    useLanguage();

    const django_server = process.env.REACT_APP_DJANGO_HOST;

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
        fetch(django_server+'/data_handler/statistics/supply_types')
            .then((response) => response.json())
            .then((data) => {
                const labels = data.map((item) => item.atm);
                const values = data.map((item) => item.supply);

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
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return children(chartData);
}

export default SupplyStatisticsConsumer;
