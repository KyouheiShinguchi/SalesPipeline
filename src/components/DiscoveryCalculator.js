import React, { useEffect } from 'react';

export function DiscoveryCalculator({ summary, totalExpectedRevenue, targetGap }) {
  const cellStyle = {
    width: '14.28%', // 7列なので100%を7で割る
    border: '2px solid #ccc',
    fontSize: '50px',
    textAlign: 'center',
    verticalAlign: 'middle'
  };
  const trStyle = {
    width: '14.28%', // 7列なので100%を7で割る
    border: '2px solid #ccc',
    fontSize: '16px',
    textAlign: 'center',
    verticalAlign: 'middle'
  };

  useEffect(() => {
    console.log('targetGap:', targetGap); // デバッグログを追加
    console.log('totalExpectedRevenue:', totalExpectedRevenue); // デバッグログを追加
    console.log('summary:', summary); // デバッグログを追加
  }, [targetGap, totalExpectedRevenue, summary]);

  const formatCurrency = (value) => {
    return (value / 1000000).toFixed(1); // 百万円単位に変換し、小数点第一位で四捨五入
  };

  const formatPercentage = (value) => {
    return (value * 100).toFixed(0); // 小数点第一位で四捨五入
  };

  const calculateDealValuePerDiscovery = (averageDealSize, winRate) => {
    return (averageDealSize * winRate).toFixed(1); // 小数点第一位で四捨五入
  };

  return (
    <>
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>
      必要発掘数
      </h2>
    </div>
    <table className="w-full border-collapse" style={{ tableLayout: 'fixed', border: '2px solid #ccc' }}>
      <thead>
        <tr>
          <th className="border p-2" style={trStyle}>売上不足額 (百万円)</th>
          <th className="border p-2" style={trStyle}>着地見込 (百万円)</th>
          <th className="border p-2" style={trStyle}>差分 (百万円)</th>
          <th className="border p-2" style={trStyle}>＠売上額 (百万円)</th>
          <th className="border p-2" style={trStyle}>受注率 (%)</th>
          <th className="border p-2" style={trStyle}>発掘期待額 (百万円)</th>
          <th className="border p-2" style={trStyle}>必要発掘数</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ height: '100px' }}>
          <td className="border p-2 text-center" style={cellStyle}>{formatCurrency(targetGap)}</td>
          <td className="border p-2 text-center" style={cellStyle}>{formatCurrency(totalExpectedRevenue)}</td>
          <td className="border p-2 text-center" style={cellStyle}>{formatCurrency(summary.difference)}</td>
          <td className="border p-2 text-center" style={cellStyle}>{formatCurrency(summary.averageDealSize)}</td>
          <td className="border p-2 text-center" style={cellStyle}>{formatPercentage(summary.winRate)}%</td>
          <td className="border p-2 text-center" style={cellStyle}>{formatCurrency(calculateDealValuePerDiscovery(summary.averageDealSize, summary.winRate))}</td>
          <td className="border p-2 text-center" style={cellStyle}>{summary.requiredDeals}</td>
        </tr>
      </tbody>
    </table>
    </>
  );
}