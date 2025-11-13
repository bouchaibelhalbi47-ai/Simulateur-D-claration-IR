import React from 'react';
import { Declaration, Language } from '../types';
import { MONTHS } from '../constants';

interface ReceiptProps {
  declaration: Declaration;
  onReturnToDashboard: () => void;
  lang: Language;
  translations: any;
}

export const Receipt: React.FC<ReceiptProps> = ({ declaration, onReturnToDashboard, lang, translations }) => {
    const isAr = lang === 'ar';
    const getMonthName = (monthValue: number) => {
        const m = MONTHS.find(m => m.value === monthValue);
        return m ? m[lang] : '';
    }

    const handleDownload = (type: 'declaration' | 'receipt') => {
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();
        
        // Note: Full Arabic support requires a specific font to be loaded into jsPDF.
        // This is a simplified implementation.
        doc.setFont('Helvetica');

        if (type === 'declaration') {
            doc.text(translations.declarationSummary, 10, 10);
            doc.text(`--------------------------------`, 10, 15);
            doc.text(`${translations.fiscalYear}: ${declaration.year}`, 10, 25);
            doc.text(`${translations.paymentMonth}: ${getMonthName(declaration.month)}`, 10, 35);
            doc.text(`${translations.paymentType}: ${declaration.paymentType}`, 10, 45);
            doc.text(`${translations.totalRemuneration}: ${declaration.totalRemuneration.toFixed(2)}`, 10, 55);
            doc.text(`${translations.correspondingWithholdings}: ${declaration.withholdings.toFixed(2)}`, 10, 65);
            doc.text(`${translations.totalAmountToPay}: ${declaration.totalAmount.toFixed(2)}`, 10, 75);
            doc.save('declaration.pdf');
        } else {
            doc.text(translations.paymentReceipt, 10, 10);
            doc.text(`--------------------------------`, 10, 15);
            doc.text(`${translations.formStatus}: ${translations.paid}`, 10, 25);
            doc.text(`${translations.declarationDetails} - ${declaration.year}/${getMonthName(declaration.month)}`, 10, 35);
            doc.text(`ID: ${declaration.id}`, 10, 45);
            doc.text(`${translations.totalAmountToPay}: ${declaration.totalAmount.toFixed(2)} MAD`, 10, 60);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 70);
            doc.save('receipt.pdf');
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-dgi-border">
            <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h2 className="text-2xl font-semibold text-dgi-blue mt-4">{translations.paymentSuccess}</h2>
                <p className="text-gray-600 mt-2">{translations.declarationSummary}</p>
            </div>

            <div className={`mt-8 p-4 bg-gray-50 rounded-md border text-sm ${isAr ? 'text-right' : 'text-left'}`}>
                <div className="grid grid-cols-2 gap-4">
                    <p><strong>{translations.fiscalYear}:</strong> {declaration.year}</p>
                    <p><strong>{translations.paymentMonth}:</strong> {getMonthName(declaration.month)}</p>
                    <p><strong>{translations.paymentType}:</strong> {declaration.paymentType}</p>
                    <p><strong>{translations.formStatus}:</strong> <span className="font-semibold text-blue-800">{translations.paid}</span></p>
                    <p className="col-span-2"><strong>{translations.totalAmountToPay}:</strong> <span className="font-mono text-lg">{declaration.totalAmount.toFixed(2)} MAD</span></p>
                </div>
            </div>
            
            <div className={`mt-8 flex flex-wrap gap-4 ${isAr ? 'flex-row-reverse' : 'justify-center'}`}>
                <button onClick={() => handleDownload('declaration')} className="px-4 py-2 bg-dgi-action-blue text-white font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" /></svg>
                    {translations.downloadDeclaration}
                </button>
                 <button onClick={() => handleDownload('receipt')} className="px-4 py-2 bg-dgi-action-blue text-white font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" /></svg>
                    {translations.downloadReceipt}
                </button>
            </div>
             <div className="mt-8 text-center">
                <button onClick={onReturnToDashboard} className="text-dgi-medium-blue hover:underline font-semibold">
                    {translations.backToDashboard}
                </button>
            </div>
        </div>
    );
}