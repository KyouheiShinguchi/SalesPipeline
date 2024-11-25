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
      discovery: deals.filter(d => d['営業フェーズ'] === '1.案件発掘')
        .reduce((acc, deal) => acc + parseFloat(deal['売上見込金額'].replace(/,/g, '')) * parseFloat(deal['受注確率'].replace('%', '')) / 100, 0),
      proposal: deals.filter(d => d['営業フェーズ'] === '2.提案中')
        .reduce((acc, deal) => acc + parseFloat(deal['売上見込金額'].replace(/,/g, '')) * parseFloat(deal['受注確率'].replace('%', '')) / 100, 0),
      won: deals.filter(d => d['営業フェーズ'] === '3a.受注')
        .reduce((acc, deal) => acc + parseFloat(deal['売上見込金額'].replace(/,/g, '')) * parseFloat(deal['受注確率'].replace('%', '')) / 100, 0),
      lost: deals.filter(d => d['営業フェーズ'] === '3b.失注')
        .reduce((acc, deal) => acc + parseFloat(deal['売上見込金額'].replace(/,/g, '')) * parseFloat(deal['受注確率'].replace('%', '')) / 100, 0),
    };

    console.log(phaseTotals);

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
      '案件発掘', '提案中', '受注', '失注'
    ].map(phase => {
      // フェーズに対応する営業フェーズのキー
      const phaseMapping = {
        '案件発掘': '1.案件発掘',
        '提案中': '2.提案中',
        '受注': '3a.受注',
        '失注': '3b.失注'
      };

      // 該当フェーズのデータをフィルタリング
      const filteredDeals = deals.filter(d => d['営業フェーズ'] === phaseMapping[phase]);

      // フィルタリング結果をログに出力
      console.log(`フェーズ: ${phase} の案件数:`, filteredDeals.length);

      // データポイントを作成
      const dataPoints = filteredDeals.map(deal => {
        // 売上見込金額と受注確率を取得・パース
        const salesAmountString = deal['売上着地見込'] || deal['売上見込金額'] || '';
        const winProbabilityString = deal['受注確率'] || '';

        // 数値に変換
        const salesAmount = parseFloat(salesAmountString.replace(/[^0-9.-]+/g, ''));
        const winProbability = parseFloat(winProbabilityString.replace(/[^0-9.-]+/g, ''));

        // パース結果をログに出力
        console.log(`案件名: ${deal['案件名']}, 売上: ${salesAmount}, 受注確率: ${winProbability}`);

        // y値を計算
        const yValue = (salesAmount * winProbability) / 100;

        return {
          x: phase,
          y: yValue,
          name: deal['案件名']
        };
      });

      return {
        label: phase,
        backgroundColor: {
          '案件発掘': 'rgba(255, 159, 64, 0.6)',
          '提案中': 'rgba(255, 205, 86, 0.6)',
          '受注': 'rgba(75, 192, 192, 0.6)',
          '失注': 'rgba(255, 99, 132, 0.6)'
        }[phase],
        data: dataPoints
      };
    });

    phaseChartInstance.current = new Chart(phaseCtx, {
      type: 'bar',
      data: {
        datasets: phaseData
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.raw.name}: ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        }
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
    <div style={{ width: '100%' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>
        提案パイプライン 着地見込状況
      </h2>
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: '20%', paddingRight: '8px', height: '400px' }}>
          <canvas ref={totalChartRef} />
        </div>
        <div style={{ width: '80%', paddingLeft: '8px', height: '400px' }}>
          <canvas ref={phaseChartRef} />
        </div>
      </div>
    </div>
  );
}
