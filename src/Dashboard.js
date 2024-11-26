import React, { useState, useEffect } from 'react';
import { EmployeeSelector } from './components/EmployeeSelector';
import { PipelineChart } from './components/PipelineChart';
import { PhaseSummary } from './components/PhaseSummary';
import { DiscoveryCalculator } from './components/DiscoveryCalculator';
import { parseCSV } from './utils/csvParser';
import { targetGaps, salesSummary, averageDealSize, winRate } from './mock-data';

export default function Dashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState("A君");
  const [deals, setDeals] = useState([]);
  const [totalExpectedRevenue, setTotalExpectedRevenue] = useState(0);
  const [targetGap, setTargetGap] = useState(0);
  const [summary, setSummary] = useState(salesSummary);

  useEffect(() => {
    fetch('/data/data.csv')
      .then(response => response.text())
      .then(csvData => parseCSV(csvData))
      .then(parsedData => {
        console.log('Parsed Deals:', parsedData); // デバッグログを追加
        setDeals(parsedData);
      })
      .catch(error => console.error('Error loading CSV data:', error));
  }, []);

  useEffect(() => {
    const calculateTotalExpectedRevenue = () => {
      const phaseLabels = ['1.案件発掘', '2.提案中', '3a.受注', '3b.失注'];
      const dealsByPhase = {};
      phaseLabels.forEach((phase) => {
        dealsByPhase[phase] = [];
      });

      const filteredDeals = selectedEmployee === 'all'
        ? deals
        : deals.filter(deal => deal['営業担当者名'] === selectedEmployee);

      console.log('Filtered Deals:', filteredDeals);

      filteredDeals.forEach((deal) => {
        const phase = deal['営業フェーズ'];
        const amount =
          parseFloat((deal['売上見込金額'] || '0').replace(/,/g, '')) *
          (parseFloat((deal['受注確率'] || '0').replace('%', '')) / 100);

        if (dealsByPhase[phase]) {
          dealsByPhase[phase].push({ ...deal, amount });
        }
      });

      console.log('Deals by Phase:', dealsByPhase);

      const totalsPerPhase = phaseLabels.map((phase) => {
        return dealsByPhase[phase].reduce((sum, deal) => sum + deal.amount, 0);
      });

      console.log('Totals per Phase:', totalsPerPhase);

      const totalExpectedRevenue = totalsPerPhase.reduce((sum, total) => sum + total, 0);
      console.log('Total Expected Revenue:', totalExpectedRevenue);

      setTotalExpectedRevenue(totalExpectedRevenue);
    };

    calculateTotalExpectedRevenue();
  }, [deals, selectedEmployee]);

  useEffect(() => {
    setTargetGap(targetGaps[selectedEmployee]);

    const avgDealSize = averageDealSize[selectedEmployee];
    const winRateValue = winRate[selectedEmployee];

    const difference = targetGaps[selectedEmployee] - totalExpectedRevenue;
    const requiredDeals = Math.round((difference / (avgDealSize * winRateValue)) * 100) / 100;

    setSummary({
      difference,
      averageDealSize: avgDealSize,
      winRate: winRateValue,
      requiredDeals
    });
  }, [selectedEmployee, totalExpectedRevenue]);

  const filteredDeals = selectedEmployee === 'all'
    ? deals
    : deals.filter(deal => deal['営業担当者名'] === selectedEmployee);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <EmployeeSelector value={selectedEmployee} onChange={setSelectedEmployee} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <PipelineChart deals={filteredDeals} onTotalExpectedRevenueChange={setTotalExpectedRevenue} targetGap={targetGap} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <DiscoveryCalculator summary={summary} totalExpectedRevenue={totalExpectedRevenue} targetGap={targetGap} />
      </div>
    </div>
  );
}