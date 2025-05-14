import { useState } from "react";
import SupplyStatisticsConsumer from "../../consumers/SupplyStatisticsConsumer";
import { Line } from "react-chartjs-2";
import analytics_strings from "../../localizations/Analytics";
import info_strings from "../../localizations/InfoModals";
import InfoModal from "../../utils/InfoModal";
import { Card } from "react-bootstrap";

function SupplyAnalytics() {
    const [jsonData] = useState(sessionStorage.getItem("supplyStatisticsJSON") || "");

    if (jsonData) {
        return (
            <Card className="mt-3">
                <Card.Header>
                    <h5 className="text-center">{analytics_strings.supply_title}</h5>
                    <InfoModal 
                        shortText={info_strings.supply_analytics_short}
                        fullText={info_strings.supply_analytics_full}
                    />
                </Card.Header>
                <Card.Body>
                    <Line data={JSON.parse(jsonData)} />
                </Card.Body>
            </Card>
        );
    }

    return (
        <SupplyStatisticsConsumer>
            {(chartData) => {
                return (
                    <Card className="mt-3">
                        <Card.Header>
                            <h5 className="text-center">{analytics_strings.supply_title}</h5>
                            <InfoModal 
                                shortText={info_strings.supply_analytics_short}
                                fullText={info_strings.supply_analytics_full}
                            />
                        </Card.Header>
                        <Card.Body>
                            <Line data={JSON.parse(chartData)} />
                        </Card.Body>
                    </Card>
                );
            }}
        </SupplyStatisticsConsumer>
    );
}

export default SupplyAnalytics;
