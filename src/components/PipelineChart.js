import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export function PipelineChart({ deals, onTotalExpectedRevenueChange, targetGap }) {
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

    // フェーズのラベル
    const phaseLabels = ['1.案件発掘', '2.提案中', '3a.受注', '3b.失注'];

    // フェーズごとの色設定
    const phaseColors = {
      '1.案件発掘': 'rgba(255, 159, 64, 0.6)',
      '2.提案中': 'rgba(255, 205, 86, 0.6)',
      '3a.受注': 'rgba(75, 192, 192, 0.6)',
      '3b.失注': 'rgba(255, 99, 132, 0.6)',
    };

    // フェーズごとに案件を分類
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

    // フェーズごとの合計金額を計算
    const totalsPerPhase = phaseLabels.map((phase) => {
      return dealsByPhase[phase].reduce((sum, deal) => sum + deal.amount, 0);
    });

    // Calculate the total amount of the '着地見込' from each phase
    const totalExpectedRevenue = totalsPerPhase.reduce((sum, total) => sum + total, 0);

    // Pass the total amount of the '着地見込' to the Dashboard component
    if (onTotalExpectedRevenueChange) {
      onTotalExpectedRevenueChange(totalExpectedRevenue);
    }

    // データセットを準備
    const datasets = [];
    phaseLabels.forEach((phase, phaseIndex) => {
      const dealsInPhase = dealsByPhase[phase];
      dealsInPhase.sort((a, b) => b.amount - a.amount);

      dealsInPhase.forEach((deal) => {
        const dataArray = new Array(phaseLabels.length).fill(0);
        dataArray[phaseIndex] = deal.amount;

        datasets.push({
          label: deal['案件名'] || `案件`,
          data: dataArray,
          backgroundColor: phaseColors[phase],
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1,
          stack: 'stack1',
        });
      });
    });

    // 合計値を表示するカスタムプラグイン
    const totalValuePlugin = {
      id: 'totalValuePlugin',
      afterDatasetsDraw: (chart) => {
        const { ctx, data, scales: { x, y } } = chart;
        ctx.save();

        data.labels.forEach((label, index) => {
          let total = 0;
          data.datasets.forEach((dataset) => {
            const value = dataset.data[index];
            if (value !== undefined) {
              total += value;
            }
          });

          const yValue = y.getPixelForValue(total);
          const xValue = x.getPixelForTick(index);
          ctx.fillStyle = 'black';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${total.toLocaleString()}円`, xValue, yValue - 5);
        });

        ctx.restore();
      },
    };

    // 合計グラフの作成
    totalChartInstance.current = new Chart(totalCtx, {
      type: 'bar',
      data: {
        labels: ['合計'],
        datasets: [
          {
            label: '売上不足額',
            data: [targetGap],
            backgroundColor: 'rgba(127, 127, 127, 0.6)',
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
            stack: 'stack2',
          },
          ...phaseLabels.map((phase, index) => ({
            label: phase,
            data: [totalsPerPhase[index]],
            backgroundColor: phaseColors[phase],
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
            stack: 'stack1',
          })).reverse()
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true },
        },
        plugins: {
          legend: { display: false }, // 凡例を非表示に設定
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: ${context.parsed.y.toLocaleString()}円`,
            },
          },
          // totalValuePlugin, // 合算値表示プラグインを追加
        },
        // plugins: [totalValuePlugin], // 合算値表示プラグインを登録
      },
    });

    // フェーズごとのチャートを作成
    phaseChartInstance.current = new Chart(phaseCtx, {
      type: 'bar',
      data: {
        labels: phaseLabels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: ${context.parsed.y.toLocaleString()}円`,
            },
          },
          totalValuePlugin, // 合算値表示プラグインを追加
        },
      },
      plugins: [totalValuePlugin], // プラグインを登録
    });

    return () => {
      if (totalChartInstance.current) {
        totalChartInstance.current.destroy();
      }
      if (phaseChartInstance.current) {
        phaseChartInstance.current.destroy();
      }
    };
  }, [deals, targetGap]);

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