import Papa from 'papaparse';

export function parseCSV(csvData) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      complete: (results) => {
        console.log('パース結果:', results.data);
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
