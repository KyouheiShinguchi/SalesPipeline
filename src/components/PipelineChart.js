import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export function PipelineChart({ deals }) {
  const totalChartRef = useRef(null);
  const phaseChartRef = useRef(null);
  const totalChartInstance = useRef(null);
  const phaseChartInstance = useRef(null);

  useEffect(() => {
    if (totalChartInstance.current) {
      totalChartInstance.current.destroy();
    }
    if (phaseChartInstance.current) {
      phaseChartInstance.current.destroy();
    }

    const totalCtx = totalChartRef.current.getContext('2d');
    const phaseCtx = phaseChartRef.current.getContext('2d');

    // Calculate totals for each phase
    const phaseTotals = {
      discovery: deals.filter(d => d.phase === 'discovery')
        .reduce((acc, deal) => acc + deal.amount * deal.probability, 0),
      proposal: deals.filter(d => d.phase === 'proposal')
        .reduce((acc, deal) => acc + deal.amount * deal.probability, 0),
      won: deals.filter(d => d.phase === 'won')
        .reduce((acc, deal) => acc + deal.amount * deal.probability, 0),
      lost: deals.filter(d => d.phase === 'lost')
        .reduce((acc, deal) => acc + deal.amount * deal.probability, 0),
    };

    // Total Chart
    totalChartInstance.current = new Chart(totalCtx, {
      type: 'bar',
      data: {
        labels: ['合計'],
        datasets: [
          {
            label: '案件発掘',
            data: [phaseTotals.discovery],
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
          },
          {
            label: '提案中',
            data: [phaseTotals.proposal],
            backgroundColor: 'rgba(255, 205, 86, 0.6)',
          },
          {
            label: '受注',
            data: [phaseTotals.won],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
              }
            }
          },
        },
      }
    });

    // Phase Chart
    const phaseData = [
      {
        label: '案件発掘',
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        data: deals.filter(d => d.phase === 'discovery').map(deal => deal.amount * deal.probability),
      },
      {
        label: '提案中',
        backgroundColor: 'rgba(255, 205, 86, 0.6)',
        data: deals.filter(d => d.phase === 'proposal').map(deal => deal.amount * deal.probability),
      },
      {
        label: '受注',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        data: deals.filter(d => d.phase === 'won').map(deal => deal.amount * deal.probability),
      },
      {
        label: '失注',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        data: deals.filter(d => d.phase === 'lost').map(deal => deal.amount * deal.probability),
      }
    ];

    phaseChartInstance.current = new Chart(phaseCtx, {
      type: 'bar',
      data: {
        labels: ['案件発掘', '提案中', '受注', '失注'],
        datasets: phaseData
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const dealIndex = context.dataIndex;
                const phase = context.dataset.label;
                const deal = deals.find(d => d.phase.toLowerCase() === phase.toLowerCase() && d.amount * d.probability === context.parsed.y);
                return deal ? `${deal.name}: ${context.parsed.y.toFixed(2)}` : `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
              }
            }
          },
        },
      }
    });

    return () => {
      if (totalChartInstance.current) {
        totalChartInstance.current.destroy();
      }
      if (phaseChartInstance.current) {
        phaseChartInstance.current.destroy();
      }
    };
  }, [deals]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">提案パイプライン 着地見込状況</h2>
      <div className="flex">
        <div className="w-1/5 pr-2" style={{ height: '400px' }}>
          <canvas ref={totalChartRef} />
        </div>
        <div className="w-4/5 pl-2" style={{ height: '400px' }}>
          <canvas ref={phaseChartRef} />
        </div>
      </div>
    </div>
  );
}
