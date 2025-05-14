import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ATMStatisticsConsumer from "../../consumers/ATMStatisticsConsumer";
import ATMCodesConsumer from "../../consumers/ATMCodesConsumer";
import InfoModal from "../../utils/InfoModal";
import { Card, Form, Spinner } from "react-bootstrap";
import analytics_strings from "../../localizations/Analytics";
import info_strings from "../../localizations/InfoModals";
import { Line } from "react-chartjs-2";

function ATMAnalytics() {
    const [searchParams, setSearchParams] = useSearchParams();
    const atmParam = searchParams.get("atm");
    const [selectedATM, setSelectedATM] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isATMDataLoading, setATMDataLoading] = useState(false);

    useEffect(() => {
        if (atmParam) {
            setSelectedATM(atmParam);
            setSearchTerm(atmParam);
        }
    }, [atmParam]);

    useEffect(() => {
        if (selectedATM) {
            searchParams.set("atm", selectedATM);
            setSearchParams(searchParams);
        }
    }, [selectedATM]);

    return (
        <ATMCodesConsumer>
            {(ATMCodes) => {
                const parsedCodes = JSON.parse(ATMCodes);
                const sortedATMCodes = [...parsedCodes].sort();
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
                        dataLoading={isATMDataLoading}
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
                                <Card.Header>
                                    <h5 className="text-center">{analytics_strings.atm_statistics}</h5>
                                    <InfoModal 
                                        shortText={info_strings.atm_analytics_short}
                                        fullText={info_strings.atm_analytics_full}
                                    />
                                </Card.Header>
                                <Card.Body>
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
    );
}

export default ATMAnalytics;