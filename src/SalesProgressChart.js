import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesProgressChart = ({ data }) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: '営業フェーズの進捗',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const chartData = {
    labels: ['案件発掘', '提案', 'クローズ'],
    datasets: [
      {
        label: '進行中',
        data: [data.discovery, data.proposal, 0],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: '受注',
        data: [0, 0, data.won],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: '失注',
        data: [0, 0, data.lost],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div>
      <Bar options={options} data={chartData} />
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <svg width="400" height="100">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
            refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" />
            </marker>
          </defs>
          <line x1="50" y1="50" x2="150" y2="50" stroke="#000" strokeWidth="2" 
          markerEnd="url(#arrowhead)" />
          <line x1="200" y1="50" x2="300" y2="25" stroke="#000" strokeWidth="2" 
          markerEnd="url(#arrowhead)" />
          <line x1="200" y1="50" x2="300" y2="75" stroke="#000" strokeWidth="2" 
          markerEnd="url(#arrowhead)" />
          <text x="85" y="40" textAnchor="middle">提案へ</text>
          <text x="250" y="15" textAnchor="middle">受注</text>
          <text x="250" y="95" textAnchor="middle">失注</text>
        </svg>
      </div>
    </div>
  );
};

export default SalesProgressChart;

