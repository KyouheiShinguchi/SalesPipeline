import React, { useState } from 'react';
import { EmployeeSelector } from './components/EmployeeSelector';
import { PipelineChart } from './components/PipelineChart';
import { PhaseSummary } from './components/PhaseSummary';
import { DiscoveryCalculator } from './components/DiscoveryCalculator';
import { deals, salesSummary } from './mock-data';

export default function Dashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState("A");

  // 実際のアプリケーションでは、selectedEmployeeに基づいてdealsをフィルタリングします
  const filteredDeals = deals;

  return (
    <div className="p-6 space-y-6">
      <EmployeeSelector
        value={selectedEmployee}
        onChange={setSelectedEmployee}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <PipelineChart deals={filteredDeals} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <PhaseSummary deals={filteredDeals} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <DiscoveryCalculator summary={salesSummary} />
      </div>
    </div>
  );
}

