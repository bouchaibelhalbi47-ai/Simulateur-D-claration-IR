import React from 'react';
import { Declaration, Language } from '../types';

interface PaymentProps {
  declaration: Declaration;
  onConfirm: () => void;
  onBack: () => void;
  lang: Language;
  translations: any;
}

const FormRow: React.FC<{ label: string; children: React.ReactNode; isAr: boolean; }> = ({ label, children, isAr }) => (
    <div className={`grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-3 border-b border-gray-200`}>
        <label className={`text-gray-700 ${isAr ? 'md:text-right' : 'md:text-left'}`}>{label}:</label>
        <div className="md:col-span-2">{children}</div>
    </div>
);

export const Payment: React.FC<PaymentProps> = ({ declaration, onConfirm, onBack, lang, translations }) => {
    const isAr = lang === 'ar';
    return (
        <div className="max-w-4xl mx-auto">
            <div className="border border-dgi-border rounded-md bg-white shadow-sm">
                <div className={`w-full p-3 bg-gray-100 rounded-t-md ${isAr ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-lg font-semibold text-dgi-blue">{translations.paymentDetails}</h3>
                </div>
                <div className="p-6 space-y-4">
                    <FormRow label={translations.paymentMode} isAr={isAr}>
                        <select className="p-2 border border-dgi-border rounded-md w-full bg-white">
                            <option>{translations.bankTransfer}</option>
                        </select>
                    </FormRow>
                    <FormRow label={translations.bankAccount} isAr={isAr}>
                        <select className="p-2 border border-dgi-border rounded-md w-full bg-white">
                            <option>BMCE - 0117800000802100095567</option>
                            <option>CIH - 2307805454122100014500</option>
                            <option>ATTIJARIWAFA BANK - 0077800012548000000125</option>
                        </select>
                    </FormRow>
                    <FormRow label={translations.amountToDebit} isAr={isAr}>
                        <input 
                            type="text" 
                            readOnly 
                            value={`${declaration.totalAmount.toFixed(2)} MAD`}
                            className={`p-2 border border-dgi-border rounded-md w-full bg-gray-100 font-mono ${isAr ? 'text-right' : 'text-left'}`}
                         />
                    </FormRow>
                </div>
            </div>

            <div className={`mt-6 p-3 bg-gray-200 border-t rounded-b-md flex flex-wrap items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                 <button onClick={onConfirm} className="px-4 py-2 bg-dgi-action-blue text-white font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center gap-2 uppercase">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    {translations.validatePayment}
                </button>
                 <button onClick={onBack} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2 uppercase">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {translations.back}
                </button>
            </div>
        </div>
    );
};