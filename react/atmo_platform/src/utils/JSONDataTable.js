import { useState } from "react";
import { Table } from "react-bootstrap";
import moment from "moment";
import jsondata_strings from "../localizations/JSONDataTable";
import { useLanguage } from "../context/LanguageContext";

const parseDateWithFallback = (dateString) => {
    const commonFormats = [
      'D/M/YYYY HH:mm',
      'DD/MM/YYYY HH:mm',
      'M/D/YYYY HH:mm',
      'MM/DD/YYYY HH:mm',
      'D/M/YYYY H:mm',
      'DD/MM/YYYY H:mm', 
      'M/D/YYYY H:mm',
      'MM/DD/YYYY H:mm', 
      'YYYY-MM-DD', 
      'DD/MM/YYYY', 
      'MM/DD/YYYY',
      'DD-MM-YYYY', 
      'MM-DD-YYYY', 
      'YYYY/MM/DD'
    ];
  
    let parsedDate = moment(dateString, commonFormats, true); // First try ISO 8601
    
    if (!parsedDate.isValid()) {
      // Try fallback formats
      parsedDate = moment(dateString, moment.ISO_8601, true);
    }
  
    if (parsedDate.isValid()) {
      return parsedDate.toDate();
    } else {
      throw new Error('Invalid date format: '+dateString);
    }
};

function JsonDataTable({ jsonData }) {
    useLanguage();
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    // Extract column names dynamically
    const columnNames = Object.keys(jsonData[0] || {});

    // Sorting function
    const handleSort = (column) => {
        const newOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortOrder(newOrder);
    };

    // Sort data
    const sortedData = [...jsonData].sort((a, b) => {
        if (!sortColumn) return 0;
        if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {columnNames.map((col) => (
                        <th key={col} onClick={() => handleSort(col)} style={{ cursor: "pointer" }}>
                            {jsondata_strings[col]}
                            {sortColumn === col ? (sortOrder === "asc" ? " ▲" : " ▼") : ""}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedData.map((row, index) => (
                    <tr key={index}>
                        {columnNames.map((col) => (
                            <td key={col}>
                                {
                                    col === "date" ? parseDateWithFallback(row[col]).toLocaleDateString("el-GR") : (
                                        col === "value" ? (Math.round(parseFloat(row[col]) * 10000)/100) + "%" : row[col]
                                    )
                                }
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default JsonDataTable;
