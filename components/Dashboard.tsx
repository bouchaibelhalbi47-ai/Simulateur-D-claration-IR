import React, { useState } from 'react';
import { Declaration, DeclarationStatus, PaymentType, Language } from '../types';
import { MONTHS, YEARS } from '../constants';

interface DashboardProps {
  declarations: Declaration[];
  onCreate: (year: number, month: number) => void;
  onEdit: (declaration: Declaration) => void;
  onDelete: (id: string) => void;
  lang: Language;
  translations: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ declarations, onCreate, onEdit, onDelete, lang, translations }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const isAr = lang === 'ar';

  const handleCreate = () => {
    onCreate(year, month);
  };
  
  const getMonthName = (monthValue: number) => {
      const m = MONTHS.find(m => m.value === monthValue);
      return m ? m[lang] : '';
  }
  
  const getStatusBadge = (status: DeclarationStatus) => {
    switch(status) {
        case DeclarationStatus.DRAFT:
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800">{translations.draft}</span>;
        case DeclarationStatus.VALIDATED:
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800">{translations.validated}</span>;
        case DeclarationStatus.PAID:
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-200 text-blue-800">{translations.paid}</span>;
        default:
            return null;
    }
  }

  return (
    <div className="space-y-8">
      <div className="p-4 border border-dgi-medium-blue rounded-md bg-white">
        {/* Fix: Removed non-existent 'newPayment_ar' translation key. */}
        <h2 className={`text-lg font-semibold text-dgi-blue mb-4 ${isAr ? 'text-right' : 'text-left'}`}>{translations.newPayment}</h2>
        <div className={`flex flex-col md:flex-row items-center gap-4 ${isAr ? 'md:flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-2">
            <label htmlFor="year" className="font-medium text-gray-700">{translations.year}:</label>
            <select id="year" value={year} onChange={(e) => setYear(Number(e.target.value))} className="p-2 border border-dgi-border rounded-md bg-white">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="month" className="font-medium text-gray-700">{translations.month}:</label>
            <select id="month" value={month} onChange={(e) => setMonth(Number(e.target.value))} className="p-2 border border-dgi-border rounded-md bg-white">
              {MONTHS.map(m => <option key={m.value} value={m.value}>{m[lang]}</option>)}
            </select>
          </div>
          {/* Fix: Removed non-existent 'createPayment_ar' translation key. */}
          <button onClick={handleCreate} className="px-6 py-2 bg-dgi-action-blue text-white font-semibold rounded-md hover:opacity-90 transition-opacity">
            {translations.createPayment}
          </button>
        </div>
      </div>

      <div>
        <h2 className={`text-xl font-semibold text-dgi-blue mb-4 pb-2 border-b-2 border-dgi-border ${isAr ? 'text-right' : 'text-left'}`}>{translations.pendingItemsList}</h2>
        {declarations.length === 0 ? (
          <p className={`text-gray-600 p-4 bg-white border rounded-md ${isAr ? 'text-right' : 'text-left'}`}>{translations.noPendingItems}</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-md shadow-sm border border-dgi-border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 border-b border-dgi-border">
                <tr className={`${isAr ? 'text-right' : 'text-left'}`}>
                  <th className="p-3 font-semibold text-dgi-blue">{translations.fiscalYear}</th>
                  <th className="p-3 font-semibold text-dgi-blue">{translations.paymentMonth}</th>
                  <th className="p-3 font-semibold text-dgi-blue">{translations.paymentType}</th>
                  <th className="p-3 font-semibold text-dgi-blue">{translations.formStatus}</th>
                  <th className="p-3 font-semibold text-dgi-blue">{translations.actions}</th>
                </tr>
              </thead>
              <tbody>
                {declarations.map(dec => (
                  <tr key={dec.id} className={`border-b border-gray-200 last:border-0 hover:bg-dgi-light-blue/30 ${isAr ? 'text-right' : 'text-left'}`}>
                    <td className="p-3">{dec.year}</td>
                    <td className="p-3">{getMonthName(dec.month)}</td>
                    <td className="p-3">{dec.paymentType === PaymentType.INITIAL ? translations.initial : translations.corrective}</td>
                    <td className="p-3">
                        {getStatusBadge(dec.status)}
                    </td>
                    <td className="p-3 flex gap-4">
                      <button 
                        onClick={() => onEdit(dec)} 
                        className="text-dgi-action-blue font-semibold hover:underline disabled:text-gray-400 disabled:no-underline"
                        disabled={dec.status === DeclarationStatus.PAID}
                      >
                          {translations.edit}
                      </button>
                      <button onClick={() => onDelete(dec.id)} className="text-red-600 font-semibold hover:underline">{translations.delete}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};