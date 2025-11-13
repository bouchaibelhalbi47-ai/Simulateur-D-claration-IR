import React from 'react';

interface HeaderProps {
  lang: 'fr' | 'ar';
  setLang: React.Dispatch<React.SetStateAction<'fr' | 'ar'>>;
  translations: any;
  onReturnToHome: () => void;
}

const DGILogo = () => (
    <div className="w-20 h-20 bg-dgi-blue flex items-center justify-center" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}>
        <div className="w-[85%] h-[85%] bg-white flex items-center justify-center" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}>
            <div className="w-[70%] h-[70%] bg-dgi-blue" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
        </div>
    </div>
);


export const Header: React.FC<HeaderProps> = ({ lang, setLang, translations, onReturnToHome }) => {
  const isAr = lang === 'ar';
  
  const handleLangChange = (newLang: 'fr' | 'ar') => {
    if (lang !== newLang) {
      setLang(newLang);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <DGILogo />
            <div className={isAr ? 'text-right' : 'text-left'}>
              <h1 className="text-xl font-bold text-dgi-blue">DIRECTION GÉNÉRALE DES IMPÔTS</h1>
              <p className="text-dgi-medium-blue font-semibold">{isAr ? 'المديرية العامة للضرائب' : 'Administration Fiscale Marocaine'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm">
                <button onClick={() => handleLangChange('fr')} className={`hover:underline ${lang === 'fr' ? 'font-bold' : ''}`}>Français</button>
                <span>|</span>
                <button onClick={() => handleLangChange('ar')} className={`hover:underline ${lang === 'ar' ? 'font-bold' : ''}`}>العربية</button>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Coat_of_arms_of_Morocco.svg" alt="Royaume du Maroc" className="h-20" />
          </div>
        </div>
      </div>
      <nav className="bg-dgi-medium-blue text-white">
        <div className={`container mx-auto px-4 flex items-center h-10 gap-6 text-sm ${isAr ? 'flex-row-reverse' : ''}`}>
          <button onClick={onReturnToHome} className="flex items-center gap-2 hover:bg-dgi-action-blue h-full px-3 transition-colors font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            <span>{translations.Home}</span>
          </button>
          <a href="#" className="hover:bg-dgi-action-blue h-full px-3 flex items-center transition-colors">{translations.contact}</a>
          <div className={`flex items-center gap-4 ${isAr ? 'mr-auto' : 'ml-auto'}`}>
              <span className="font-normal">{translations.welcome}: {translations.companyName} | {translations.taxId}: {translations.fiscalIdValue}</span>
              <a href="#" className="flex items-center gap-1 hover:underline">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V5h10a1 1 0 100-2H3zm12.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L16.586 13H9a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                 <span>{translations.logout}</span>
              </a>
          </div>
        </div>
      </nav>
    </header>
  );
};