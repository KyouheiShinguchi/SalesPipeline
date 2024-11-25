import React, { useState, useEffect } from 'react';
import { EmployeeSelector } from './components/EmployeeSelector';
import { PipelineChart } from './components/PipelineChart';
import { PhaseSummary } from './components/PhaseSummary';
import { DiscoveryCalculator } from './components/DiscoveryCalculator';
import { salesSummary } from './mock-data';
import { parseCSV } from './utils/csvParser';

export default function Dashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState("A");
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetch('/data/data.csv')
      .then(response => response.text())
      .then(csvData => parseCSV(csvData))
      .then(parsedData => setDeals(parsedData))
      .catch(error => console.error('Error loading CSV data:', error));
  }, []);

  // 実際のアプリケーションでは、selectedEmployeeに基づいてdealsをフィルタリングします
  const filteredDeals = deals;

  return (
    <div className="p-6 space-y-6">
      {/* <EmployeeSelector
        value={selectedEmployee}
        onChange={setSelectedEmployee}
      /> */}
      <div className="bg-white p-4 rounded-lg shadow">
        <PipelineChart deals={filteredDeals} />
      </div>
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <PhaseSummary deals={filteredDeals} />
      </div> */}
      <div className="bg-white p-4 rounded-lg shadow">
        <DiscoveryCalculator summary={salesSummary} />
      </div>
    </div>
  );
}
