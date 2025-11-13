import React, { useState, useEffect } from 'react';
import { Declaration, DeclarationStatus, PaymentType, Language } from '../types';
import { MONTHS } from '../constants';

interface DeclarationFormProps {
  declaration: Declaration;
  onSave: (declaration: Declaration, status: DeclarationStatus) => void;
  onBack: () => void;
  onExport: () => void;
  lang: Language;
  translations: any;
}

const InfoRow: React.FC<{ label: string; value: string | number; isAr: boolean; children?: React.ReactNode }> = ({ label, value, isAr, children }) => (
    <div className={isAr ? 'text-right' : 'text-left'}>
        <span className="font-semibold text-dgi-blue">{label}:</span> 
        {children ? children : <span className="ml-2">{value}</span>}
    </div>
);

const FormRow: React.FC<{ label: string; children: React.ReactNode; isAr: boolean; info?: string; isCalculated?: boolean; isTotal?: boolean }> = ({ label, children, isAr, info, isCalculated, isTotal }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 items-center gap-4 py-2 ${isTotal ? 'pt-3 border-t-2 border-dgi-blue' : 'border-b border-gray-200'}`}>
        <div className={`flex items-center gap-2 ${isAr ? 'md:justify-end' : 'md:justify-start'}`}>
            <label className={` ${isTotal ? 'font-bold text-dgi-blue text-lg' : 'text-gray-700'}`}>{label}</label>
            {info && <span className="text-dgi-medium-blue cursor-pointer" title={info}>ⓘ</span>}
        </div>
        <div className="w-full md:w-3/4">{children}</div>
    </div>
);

export const DeclarationForm: React.FC<DeclarationFormProps> = ({ declaration, onSave, onBack, onExport, lang, translations }) => {
  const [formData, setFormData] = useState<Declaration>(declaration);
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const isAr = lang === 'ar';

  useEffect(() => {
    setFormData(declaration);
  }, [declaration]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: Number(value) || 0 }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value as PaymentType}));
  };

  const handleCalculate = () => {
    const { year, month, withholdings, alreadyPaid } = formData;

    // Deadline is the last day of the month *following* the declaration month.
    // The declaration for month M is due by the last day of month M+1.
    const deadline = new Date(year, month, 0); // last day of declaration month
    deadline.setMonth(deadline.getMonth() + 1); // last day of the following month

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only, not time.

    const isLate = today > deadline;

    const principalAmount = Math.max(0, withholdings - alreadyPaid);
    let penaltyAmount = 0;
    let lateFeeAmount = 0;
    let finalPenaltyPercentage = 0;

    if (isLate) {
        // As per user request: 20% penalty + 5% late fee
        finalPenaltyPercentage = 20;
        penaltyAmount = principalAmount * (finalPenaltyPercentage / 100);
        lateFeeAmount = principalAmount * 0.05; // 5% late fee
    }

    const totalAmount = Math.ceil(principalAmount + penaltyAmount + lateFeeAmount);

    setFormData(prev => ({
      ...prev,
      principalAmount,
      penaltyPercentage: finalPenaltyPercentage,
      penaltyAmount,
      lateFee: lateFeeAmount,
      totalAmount,
    }));
  };

  const handleSave = (status: DeclarationStatus) => {
    if (status === DeclarationStatus.DRAFT) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    }
    // Recalculate before saving to ensure data is consistent
    handleCalculate(); 
    // Use a timeout to allow state to update before saving
    setTimeout(() => {
        onSave({ ...formData, status }, status);
    }, 0);
  };
  
  const getMonthName = (monthValue: number) => {
      const m = MONTHS.find(m => m.value === monthValue);
      return m ? m[lang] : '';
  }

  const handlePrint = () => {
      window.print();
  }

  return (
    <div className="space-y-6">
      <div className={`p-4 bg-dgi-light-blue/50 border border-dgi-border rounded-md grid grid-cols-2 md:grid-cols-4 gap-4`}>
          <InfoRow label={translations.year} value={formData.year} isAr={isAr} />
          <InfoRow label={translations.month} value={getMonthName(formData.month)} isAr={isAr} />
          <InfoRow label={translations.paymentType} value={formData.paymentType} isAr={isAr}>
             <select name="paymentType" value={formData.paymentType} onChange={handleSelectChange} className="ml-2 bg-transparent border-none focus:ring-0">
                <option value={PaymentType.INITIAL}>{translations.initial}</option>
                <option value={PaymentType.CORRECTIVE}>{translations.corrective}</option>
            </select>
          </InfoRow>
          <InfoRow label={translations.formStatus} value={formData.status === DeclarationStatus.DRAFT ? translations.draft : translations.validated} isAr={isAr} />
      </div>
      
      <div className="border border-dgi-border rounded-md bg-white shadow-sm">
        <button onClick={() => setIsSectionOpen(!isSectionOpen)} className={`w-full p-3 flex justify-between items-center bg-gray-100 rounded-t-md ${isAr ? 'flex-row-reverse' : ''}`}>
            <h3 className="text-lg font-semibold text-dgi-blue">{translations.calculateAmountToPay}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${isSectionOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        
        {isSectionOpen && <div className="p-6 space-y-2">
            <FormRow label={translations.totalRemuneration} isAr={isAr}>
                <input type="number" id="totalRemuneration" value={formData.totalRemuneration} onChange={handleChange} className={`p-2 border border-dgi-border rounded-md w-full ${isAr ? 'text-right' : 'text-left'}`} />
            </FormRow>
            <FormRow label={translations.correspondingWithholdings} isAr={isAr}>
                 <input type="number" id="withholdings" value={formData.withholdings} onChange={handleChange} className={`p-2 border border-dgi-border rounded-md w-full ${isAr ? 'text-right' : 'text-left'}`} />
            </FormRow>
            <FormRow label={translations.alreadyPaid} isAr={isAr}>
                 <input type="number" id="alreadyPaid" value={formData.alreadyPaid} onChange={handleChange} className={`p-2 border border-dgi-border rounded-md w-full ${isAr ? 'text-right' : 'text-left'}`} />
            </FormRow>

            <div className={`pt-4 flex ${isAr ? 'justify-start' : 'justify-end'}`}>
              <button onClick={handleCalculate} className="px-8 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors uppercase">{translations.calculate}</button>
            </div>

            <div className="mt-6 space-y-3">
                <FormRow label={translations.principalAmountToPay} isAr={isAr} isCalculated>
                    <p className={`font-mono p-2 bg-gray-100 rounded-md w-full ${isAr ? 'text-right' : 'text-left'}`}>{formData.principalAmount.toFixed(2)}</p>
                </FormRow>
                <FormRow label={translations.penalty} isAr={isAr} isCalculated>
                    <p className={`font-mono p-2 bg-gray-100 rounded-md w-full ${isAr ? 'text-right' : 'text-left'}`}>{formData.penaltyAmount.toFixed(2)}</p>
                </FormRow>
                <FormRow label={translations.lateFees} isAr={isAr} isCalculated>
                    <p className={`font-mono p-2 bg-gray-100 rounded-md w-full ${isAr ? 'text-right' : 'text-left'}`}>{formData.lateFee.toFixed(2)}</p>
                </FormRow>

                <FormRow label={translations.totalAmountToPay} isAr={isAr} isTotal>
                    <p className={`font-mono p-2 bg-blue-100 text-dgi-blue font-bold text-lg rounded-md w-full ${isAr ? 'text-right' : 'text-left'}`}>{formData.totalAmount.toFixed(2)}</p>
                </FormRow>
            </div>
        </div>}
      </div>

      <div className={`p-3 bg-gray-200 border-t rounded-b-md flex flex-wrap items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
        <button 
            onClick={() => handleSave(DeclarationStatus.DRAFT)} 
            className={`px-4 py-2 text-white font-semibold rounded-md transition-all flex items-center gap-2 uppercase ${saveSuccess ? 'bg-green-500' : 'bg-dgi-action-blue hover:opacity-90'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" /></svg>
            {translations.saveDraft}
        </button>
        <button onClick={() => handleSave(DeclarationStatus.VALIDATED)} className="px-4 py-2 bg-dgi-action-blue text-white font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center gap-2 uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            {translations.submitDeclaration}
        </button>
        <button onClick={handlePrint} className="px-4 py-2 bg-dgi-action-blue text-white font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center gap-2 uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2v-3a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v3h6v-3z" clipRule="evenodd" /></svg>
            {translations.print}
        </button>
        <button onClick={onExport} className="px-4 py-2 bg-dgi-action-blue text-white font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center gap-2 uppercase">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            {translations.exportExcel}
        </button>
        <button onClick={onBack} className="px-4 py-2 bg-dgi-action-blue text-white font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center gap-2 uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            {translations.abandon}
        </button>
      </div>
    </div>
  );
};