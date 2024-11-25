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
  const [totalExpectedRevenue, setTotalExpectedRevenue] = useState(0);
  const [targetGap, setTargetGap] = useState(0);

  useEffect(() => {
    fetch('/data/data.csv')
      .then(response => response.text())
      .then(csvData => parseCSV(csvData))
      .then(parsedData => setDeals(parsedData))
      .catch(error => console.error('Error loading CSV data:', error));
  }, []);

  useEffect(() => {
    const calculateTotalExpectedRevenue = () => {
      const phaseLabels = ['1.案件発掘', '2.提案中', '3a.受注', '3b.失注'];
      const dealsByPhase = {};
      phaseLabels.forEach((phase) => {
        dealsByPhase[phase] = [];
      });

      deals.forEach((deal) => {
        const phase = deal['営業フェーズ'];
        const amount =
          parseFloat((deal['売上見込金額'] || '0').replace(/,/g, '')) *
          (parseFloat((deal['受注確率'] || '0').replace('%', '')) / 100);

        if (dealsByPhase[phase]) {
          dealsByPhase[phase].push({ ...deal, amount });
        }
      });

      const totalsPerPhase = phaseLabels.map((phase) => {
        return dealsByPhase[phase].reduce((sum, deal) => sum + deal.amount, 0);
      });

      const totalExpectedRevenue = totalsPerPhase.reduce((sum, total) => sum + total, 0);
      setTotalExpectedRevenue(totalExpectedRevenue);
    };

    calculateTotalExpectedRevenue();
  }, [deals]);

  useEffect(() => {
    const targetGaps = {
      A: 3000000000,
      B: 2000000000,
      C: 1500000000,
      all: 6500000000,
    };
    setTargetGap(targetGaps[selectedEmployee]);
  }, [selectedEmployee]);

  const filteredDeals = deals;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <PipelineChart deals={filteredDeals} onTotalExpectedRevenueChange={setTotalExpectedRevenue} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <DiscoveryCalculator summary={salesSummary} totalExpectedRevenue={totalExpectedRevenue} targetGap={targetGap} />
      </div>
    </div>
  );
}
