import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DeclarationForm } from './components/DeclarationForm';
import { Payment } from './components/Payment';
import { Receipt } from './components/Receipt';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Declaration, DeclarationStatus, PaymentType, Language } from './types';
import { translations } from './constants';
import { exportToCsv } from './utils/exportToCsv';

type View = 'dashboard' | 'form' | 'payment' | 'receipt';

const App: React.FC = () => {
  const [lang, setLang] = useLocalStorage<Language>('dgi-lang', Language.FR);
  const [declarations, setDeclarations] = useLocalStorage<Declaration[]>('dgi-declarations', []);
  const [view, setView] = useState<View>('dashboard');
  const [selectedDeclaration, setSelectedDeclaration] = useState<Declaration | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === Language.AR ? 'rtl' : 'ltr';
  }, [lang]);

  const t = translations[lang];
  const isAr = lang === 'ar';

  const handleCreateDeclaration = (year: number, month: number) => {
    const existing = declarations.find(d => d.year === year && d.month === month);
    if(existing) {
        alert("Une déclaration pour cette période existe déjà. Veuillez la modifier.");
        handleEditDeclaration(existing);
        return;
    }
    const newDeclaration: Declaration = {
      id: new Date().toISOString(),
      year,
      month,
      paymentType: PaymentType.INITIAL,
      status: DeclarationStatus.DRAFT,
      totalRemuneration: 0,
      withholdings: 0,
      alreadyPaid: 0,
      penaltyPercentage: 0,
      lateFee: 0,
      principalAmount: 0,
      penaltyAmount: 0,
      totalAmount: 0,
    };
    setSelectedDeclaration(newDeclaration);
    setView('form');
  };

  const handleEditDeclaration = (declaration: Declaration) => {
    setSelectedDeclaration(declaration);
    setView('form');
  };
  
  const handleDeleteDeclaration = (id: string) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette déclaration ?")) {
          setDeclarations(prev => prev.filter(d => d.id !== id));
      }
  }

  const handleSaveDeclaration = (declaration: Declaration, status: DeclarationStatus) => {
    const updatedDeclaration = { ...declaration, status };
    setDeclarations(prev => {
      const existing = prev.find(d => d.id === declaration.id);
      if (existing) {
        return prev.map(d => (d.id === declaration.id ? updatedDeclaration : d));
      } else {
        return [...prev, updatedDeclaration];
      }
    });

    // Keep the form updated with the saved data
    setSelectedDeclaration(updatedDeclaration);

    // Only proceed to payment if the declaration is submitted (validated)
    if (status === DeclarationStatus.VALIDATED) {
        setView('payment');
    }
    // If status is DRAFT, stay on the form page
  };

  const handlePaymentSuccess = () => {
      if(selectedDeclaration) {
        const paidDeclaration = {...selectedDeclaration, status: DeclarationStatus.PAID };
        setDeclarations(prev => prev.map(d => d.id === paidDeclaration.id ? paidDeclaration : d));
        setSelectedDeclaration(paidDeclaration);
        setView('receipt');
      }
  }
  
  const handleReturnToDashboard = () => {
      setView('dashboard');
      setSelectedDeclaration(null);
  }

  const handleExport = () => {
      exportToCsv(declarations, 'export_declarations_ir.csv');
  }

  const PageTitle = () => (
    <h1 className={`text-2xl font-light text-dgi-blue mb-6 ${isAr ? 'text-right' : 'text-left'}`}>
        {t.pageTitle}
    </h1>
  );

  const SideNav = () => (
    <aside className={`w-60 flex-shrink-0 ${isAr ? 'ml-6' : 'mr-6'}`}>
      <div className={`p-3 bg-dgi-medium-blue text-white font-semibold rounded-t-md ${isAr ? 'text-right' : 'text-left'}`}>{t.Teleservices}</div>
      <div className="bg-white border border-t-0 border-dgi-border rounded-b-md">
        <div className={`p-3 bg-gray-200 font-semibold text-dgi-blue ${isAr ? 'text-right' : 'text-left'}`}>{t.ProfessionalsSpace}</div>
        <ul className={`${isAr ? 'text-right' : 'text-left'}`}>
          <li className="border-b border-dgi-border"><a href="#" className="block p-3 text-sm bg-dgi-light-blue text-dgi-action-blue font-bold">{t.SimplIR}</a></li>
          <li className="border-b border-dgi-border"><a href="#" className="block p-3 text-sm text-gray-500 hover:bg-gray-100">{t.SimplIS}</a></li>
          <li className="border-b border-dgi-border"><a href="#" className="block p-3 text-sm text-gray-500 hover:bg-gray-100">{t.SimplTVA}</a></li>
          <li><a href="#" className="block p-3 text-sm text-gray-500 hover:bg-gray-100">{t.SimplAutres}</a></li>
        </ul>
      </div>
    </aside>
  );

  const InfoPanel = () => (
    <aside className="w-60 flex-shrink-0">
      <div className={`p-3 bg-red-800 text-white font-semibold rounded-t-md ${isAr ? 'text-right' : 'text-left'}`}>{t.AccessSimplIR}</div>
      <div className="bg-white border border-t-0 border-dgi-border rounded-b-md">
        <ul className={`${isAr ? 'text-right' : 'text-left'}`}>
          <li className="border-b border-dgi-border"><a href="#" className="flex justify-between items-center p-3 text-sm text-dgi-action-blue hover:bg-gray-100"><span>{t.GuideRevenuGlobal}</span> <span className="text-xl font-bold">&#x21E9;</span></a></li>
          <li className="border-b border-dgi-border"><a href="#" className="flex justify-between items-center p-3 text-sm text-dgi-action-blue hover:bg-gray-100"><span>{t.GuideDTS}</span> <span className="text-xl font-bold">&#x21E9;</span></a></li>
        </ul>
      </div>
    </aside>
  );

  const renderContent = () => {
    switch(view) {
        case 'form':
            return selectedDeclaration ? (
                <>
                  <PageTitle />
                  <DeclarationForm
                      declaration={selectedDeclaration}
                      onSave={handleSaveDeclaration}
                      onBack={handleReturnToDashboard}
                      onExport={handleExport}
                      lang={lang}
                      translations={t}
                  />
                </>
            ) : null;
        case 'payment':
            return selectedDeclaration ? (
                <>
                  <PageTitle />
                  <Payment 
                      declaration={selectedDeclaration}
                      onConfirm={handlePaymentSuccess}
                      onBack={() => setView('form')}
                      lang={lang}
                      translations={t}
                  />
                </>
            ) : null;
        case 'receipt':
             return selectedDeclaration ? (
                <Receipt 
                    declaration={selectedDeclaration}
                    onReturnToDashboard={handleReturnToDashboard}
                    lang={lang}
                    translations={t}
                />
            ) : null;
        case 'dashboard':
        default:
            return (
                 <>
                    <PageTitle />
                    <Dashboard
                    declarations={declarations}
                    onCreate={handleCreateDeclaration}
                    onEdit={handleEditDeclaration}
                    onDelete={handleDeleteDeclaration}
                    lang={lang}
                    translations={t}
                    />
                </>
            )
    }
  }

  return (
    <div className="min-h-screen font-sans">
      <Header lang={lang} setLang={setLang} translations={t} onReturnToHome={handleReturnToDashboard} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex">
          <SideNav />
          <div className="flex-grow">
            {renderContent()}
          </div>
          <InfoPanel />
        </div>
      </main>
      <footer className="text-center text-xs text-gray-500 py-4 mt-8 border-t">
        Application de simulation à but démonstratif - Inspiré par DGI Simpl-IR. 
        <br/>
        Cette application n'est pas affiliée au gouvernement du Maroc.
      </footer>
    </div>
  );
};

export default App;