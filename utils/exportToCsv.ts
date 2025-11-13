
import { Declaration } from '../types';

export function exportToCsv(data: Declaration[], filename: string = 'declarations.csv') {
  if (data.length === 0) {
    alert('No data to export.');
    return;
  }

  const headers = [
    'Annee', 'Mois', 'Type de versement', 'Montant global verse', 
    'Montant retenu', 'Montant deja verse', 'Montant total a verser'
  ];
  
  const rows = data.map(d => [
    d.year,
    d.month,
    d.paymentType,
    d.totalRemuneration,
    d.withholdings,
    d.alreadyPaid,
    d.totalAmount
  ]);

  let csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n" 
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
}
