import { useState } from "react";
import { Col, Row, Tabs, Tab, Card, Form, Spinner } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import SupplyStatisticsConsumer from "../consumers/SupplyStatisticsConsumer";
import TimeseriesStatisticsConsumer from "../consumers/TimeseriesStatisticsConsumer";
import ATMStatisticsConsumer from "../consumers/ATMStatisticsConsumer";
import ATMCodesConsumer from "../consumers/ATMCodesConsumer";
import analytics_strings from "../localizations/Analytics";
import { useLanguage } from "../context/LanguageContext";

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
  const [activeTab, setActiveTab] = useState("supply");
  const [selectedATM, setSelectedATM] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isATMDataLoading, setATMDataLoading] = useState(false);
  const [lastATMData, setLastATMData] = useState();

  return (
    <Col xs={9} style={{ marginLeft: "250px" }}>
      <h2 className="my-4">{analytics_strings.title}</h2>
      <Row>
        <Col className="d-flex">
          <Card className="flex-fill">
            <Card.Header className="bg-primary">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-0 custom-tabs mr-2"
              >
                <Tab eventKey="supply" title={analytics_strings.supply_title} />
                <Tab eventKey="timeseries" title={analytics_strings.timeseries_title} />
                <Tab eventKey="atm" title={analytics_strings.atm_title} />
                <Tab eventKey="routes" title={analytics_strings.routes_title} />
              </Tabs>
            </Card.Header>
            <Card.Body>
              {activeTab === "supply" && (
                <SupplyStatisticsConsumer>
                  {(chartData) => <Line data={chartData} />}
                </SupplyStatisticsConsumer>
              )}
              {activeTab === "timeseries" && (
                <TimeseriesStatisticsConsumer>
                  {(chartData) => <Line data={chartData} />}
                </TimeseriesStatisticsConsumer>
              )}
              {activeTab === "atm" && (
                <ATMCodesConsumer>
                  {(ATMCodes) => {
                    const sortedATMCodes = [...ATMCodes].sort();
                    const filteredATMCodes = sortedATMCodes.filter((code) =>
                      code.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    return (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">{analytics_strings.select_atm}</Form.Label>
                          
                          <div
                            className="dropdown w-100"
                            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                          >
                            <Form.Control
                              type="text"
                              placeholder={analytics_strings.search_placeholder}
                              value={searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setDropdownOpen(true);
                              }}
                              onFocus={() => setDropdownOpen(true)}
                              className="mb-2"
                              disabled={selectedATM && isATMDataLoading}
                            />

                            {isDropdownOpen && (
                              <div className="dropdown-menu show w-100">
                                {filteredATMCodes.length > 0 ? (
                                  filteredATMCodes.map((code) => (
                                    <div
                                      key={code}
                                      className="dropdown-item"
                                      onMouseDown={() => {
                                        setSelectedATM(code);
                                        setSearchTerm(code);
                                        setDropdownOpen(false);
                                      }}
                                    >
                                      {code}
                                    </div>
                                  ))
                                ) : (
                                  <div className="dropdown-item disabled">
                                    {analytics_strings.no_atm_available}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Form.Group>

                        {/* Show Line Chart when ATM is selected */}
                        {selectedATM && (
                          <ATMStatisticsConsumer 
                            atmCode={selectedATM} 
                            setDataLoading={setATMDataLoading}
                          >
                            {(chartData, loading) => 
                              loading ? 
                              (
                                  <div className="text-center my-4">
                                      <Spinner animation="border" />
                                      <p>{analytics_strings.loading}</p>
                                  </div>
                              ) : (
                                chartData && (
                                  <Card className="mt-3">
                                    <Card.Body>
                                      <h5 className="text-center">{analytics_strings.atm_statistics}</h5>
                                      <Line 
                                        data={chartData} 
                                        options={
                                          {
                                            responsive: true,
                                            maintainAspectRatio: true,
                                          }
                                        }
                                      />
                                    </Card.Body>
                                  </Card>
                                )
                              )
                            }
                          </ATMStatisticsConsumer>
                        )}
                      </>
                    );
                  }}
                </ATMCodesConsumer>
              )}
              {activeTab === "routes" && (
                "Routes Analysis... Under construction."
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
}

export default Analytics;