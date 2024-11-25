import React from 'react';

export function PhaseSummary({ deals }) {
  const phaseTotals = {
    discovery: deals
      .filter(d => d.phase === 'discovery')
      .reduce((acc, deal) => acc + deal.amount * deal.probability, 0),
    proposal: deals
      .filter(d => d.phase === 'proposal')
      .reduce((acc, deal) => acc + deal.amount * deal.probability, 0),
    won: deals
      .filter(d => d.phase === 'won')
      .reduce((acc, deal) => acc + deal.amount * deal.probability, 0),
    lost: deals
      .filter(d => d.phase === 'lost')
      .reduce((acc, deal) => acc + deal.amount * deal.probability, 0),
  };

  const activeTotal = phaseTotals.discovery + phaseTotals.proposal + phaseTotals.won;

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2">フェーズ別金額</th>
          <th className="border p-2 text-right">{phaseTotals.discovery.toFixed(2)}</th>
          <th className="border p-2 text-right">{phaseTotals.proposal.toFixed(2)}</th>
          <th className="border p-2 text-right">{phaseTotals.won.toFixed(2)}</th>
          <th className="border p-2 text-right">{phaseTotals.lost.toFixed(2)}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2">合計金額</td>
          <td className="border p-2 text-right" colSpan={3}>{activeTotal.toFixed(2)}</td>
          <td className="border p-2 text-right">{phaseTotals.lost.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );
}

