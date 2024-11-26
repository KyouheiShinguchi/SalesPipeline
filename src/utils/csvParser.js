import Papa from 'papaparse';

export function parseCSV(csvData) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      complete: (results) => {
        console.log('パース結果:', results.data); // デバッグログを追加
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}