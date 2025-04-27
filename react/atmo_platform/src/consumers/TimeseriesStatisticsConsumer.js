import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import analytics_strings from "../localizations/Analytics";

// Function to generate random RGB colors
const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return {
        borderColor: `rgb(${r}, ${g}, ${b})`,
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`, // Semi-transparent fill
    };
};

function TimeseriesStatisticsConsumer({ children }) {
    useLanguage();

    const django_server = process.env.REACT_APP_DJANGO_HOST;

    const data_labels = [
        analytics_strings.timeseries_data_avg,
        analytics_strings.timeseries_data_min,
        analytics_strings.timeseries_data_max,
        analytics_strings.timeseries_data_median,
        analytics_strings.timeseries_data_length,
        analytics_strings.timeseries_data_coverage,
    ];

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: data_labels.map((data_label, index) => {
            const colors = getRandomColor();
            return {
                label: data_label,
                data: [],
                fill: true,
                hidden: index !== 0,
                ...colors, // Apply random colors
            };
        }),
    });

    useEffect(() => {
        fetch(django_server + "/data_handler/statistics/atm_codes")
            .then((response) => response.json())
            .then((data) => {
                const labels = data.map((item) => item.atm);
                const values = [
                    data.map((item) => item.avg),
                    data.map((item) => item.min),
                    data.map((item) => item.max),
                    data.map((item) => item.median),
                    data.map((item) => item.length),
                    data.map((item) => item.coverage),
                ];

                setChartData({
                    labels: labels,
                    datasets: data_labels.map((data_label, index) => {
                        const colors = getRandomColor();
                        return {
                            label: data_label,
                            data: values[index],
                            fill: true,
                            hidden: index !== 0,
                            ...colors, // Apply random colors
                        };
                    }),
                });
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return children(chartData);
}

export default TimeseriesStatisticsConsumer;
