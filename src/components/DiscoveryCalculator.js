import React from 'react';

export function DiscoveryCalculator({ summary }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2">売上不足額</th>
          <th className="border p-2">着地見込</th>
          <th className="border p-2">差分</th>
          <th className="border p-2">平均受注額</th>
          <th className="border p-2">受注確率</th>
          <th className="border p-2">必要発掘数</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2 text-center">{summary.targetGap}</td>
          <td className="border p-2 text-center">{summary.expectedRevenue}</td>
          <td className="border p-2 text-center">{summary.difference}</td>
          <td className="border p-2 text-center">{summary.averageDealSize}</td>
          <td className="border p-2 text-center">{`${summary.winRate * 100}%`}</td>
          <td className="border p-2 text-center">{summary.requiredDeals}</td>
        </tr>
      </tbody>
    </table>
  );
}

