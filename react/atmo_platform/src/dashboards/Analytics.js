import { useEffect, useState } from "react";
import { Col, Row, Tabs, Tab, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import analytics_strings from "../localizations/Analytics";
import { useLanguage } from "../context/LanguageContext";
import SupplyAnalytics from "../dashboards/analytics/supply";
import TimeseriesAnalytics from "../dashboards/analytics/timeseries";
import ATMAnalytics from "../dashboards/analytics/atm";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Analytics() {
  useLanguage();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const validTabs = ["supply", "timeseries", "atm", "routes"];
  const defaultTab = validTabs.includes(tabParam) ? tabParam : "supply";

  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabSelect = (key) => {
    setActiveTab(key);
    setSearchParams({ tab: key });
  };

  return (
    <Col xs={9} style={{ marginLeft: "250px" }}>
      <h2 className="my-4">{analytics_strings.title}</h2>
      <Row>
        <Col className="d-flex">
          <Card className="flex-fill">
            <Card.Header className="bg-primary">
              <Tabs
                activeKey={activeTab}
                onSelect={handleTabSelect}
                className="mb-0 custom-tabs mr-2"
              >
                <Tab eventKey="supply" title={analytics_strings.supply_title} />
                <Tab eventKey="timeseries" title={analytics_strings.timeseries_title} />
                <Tab eventKey="atm" title={analytics_strings.atm_title} />
                <Tab eventKey="routes" title={analytics_strings.routes_title} />
              </Tabs>
            </Card.Header>
            <Card.Body>
              {activeTab === "supply" && <SupplyAnalytics />}
              {activeTab === "timeseries" && <TimeseriesAnalytics />}
              {activeTab === "atm" && <ATMAnalytics />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
}

export default Analytics;