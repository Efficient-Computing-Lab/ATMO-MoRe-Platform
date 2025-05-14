import { useState } from "react";
import TimeseriesStatisticsConsumer from "../../consumers/TimeseriesStatisticsConsumer";
import { Line } from "react-chartjs-2";
import analytics_strings from "../../localizations/Analytics";
import info_strings from "../../localizations/InfoModals";
import InfoModal from "../../utils/InfoModal";
import { Card } from "react-bootstrap";

function TimeseriesAnalytics() {
    const [jsonData] = useState(sessionStorage.getItem("timeseriesStatisticsJSON") || "");

    if (jsonData) {
        return (
            <Card className="mt-3">
                <Card.Header>
                    <h5 className="text-center">{analytics_strings.timeseries_title}</h5>
                    <InfoModal 
                        shortText={info_strings.timeseries_analytics_short}
                        fullText={info_strings.timeseries_analytics_full}
                    />
                </Card.Header>
                <Card.Body>
                    <Line data={JSON.parse(jsonData)} />
                </Card.Body>
            </Card>
        );
    }

    return (
        <TimeseriesStatisticsConsumer>
            {(chartData) => {
                return (
                    <Card className="mt-3">
                        <Card.Header>
                            <h5 className="text-center">{analytics_strings.timeseries_title}</h5>
                            <InfoModal 
                                shortText={info_strings.timeseries_analytics_short}
                                fullText={info_strings.timeseries_analytics_full}
                            />
                        </Card.Header>
                        <Card.Body>
                            <Line data={JSON.parse(chartData)} />
                        </Card.Body>
                    </Card>
                );
            }}
        </TimeseriesStatisticsConsumer>
    );
}

export default TimeseriesAnalytics;