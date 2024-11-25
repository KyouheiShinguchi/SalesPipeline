import React from 'react';

export function DiscoveryCalculator({ summary }) {
  const cellStyle = {
    width: '16.66%', // 6列なので100%を6で割る
    border: '2px solid #ccc',
    fontSize: '50px',
    textAlign: 'center',
    verticalAlign: 'middle'
  };
  const trStyle = {
    width: '16.66%', // 6列なので100%を6で割る
    border: '2px solid #ccc',
    fontSize: '16px',
    textAlign: 'center',
    verticalAlign: 'middle'
  };

  return (
    <table className="w-full border-collapse" style={{ tableLayout: 'fixed', border: '2px solid #ccc' }}>
      <thead>
        <tr>
          <th className="border p-2" style={trStyle}>売上不足額</th>
          <th className="border p-2" style={trStyle}>着地見込</th>
          <th className="border p-2" style={trStyle}>差分</th>
          <th className="border p-2" style={trStyle}>平均受注額</th>
          <th className="border p-2" style={trStyle}>受注確率</th>
          <th className="border p-2" style={trStyle}>必要発掘数</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ height: '100px' }}>
          <td className="border p-2 text-center" style={cellStyle}>{summary.targetGap}</td>
          <td className="border p-2 text-center" style={cellStyle}>{summary.expectedRevenue}</td>
          <td className="border p-2 text-center" style={cellStyle}>{summary.difference}</td>
          <td className="border p-2 text-center" style={cellStyle}>{summary.averageDealSize}</td>
          <td className="border p-2 text-center" style={cellStyle}>{`${summary.winRate * 100}%`}</td>
          <td className="border p-2 text-center" style={cellStyle}>{summary.requiredDeals}</td>
        </tr>
      </tbody>
    </table>
  );
}
