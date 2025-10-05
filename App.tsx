import React, { useState, useEffect } from 'react';
import { Contract, PlanningItem, AppSettings, Tab } from './types';
import { getContracts, saveContracts, getPlanningItems, savePlanningItems, getSettings, saveSettings } from './services/storageService';
import { DEFAULT_SETTINGS } from './constants';
import ContractsTab from './components/ContractsTab';
import PlanningTab from './components/PlanningTab';
import StatisticsTab from './components/StatisticsTab';
import { LogoIcon, SettingsIcon, SunIcon, MoonIcon } from './components/icons';
import SettingsDialog from './components/SettingsDialog';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Contracts);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [planningItems, setPlanningItems] = useState<PlanningItem[]>([]);
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        setContracts(getContracts());
        setPlanningItems(getPlanningItems());
        const savedSettings = getSettings();
        setSettings(savedSettings);
        applyTheme(savedSettings.theme);
    }, []);

    const applyTheme = (theme: 'light' | 'dark') => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleUpdateContracts = (updatedContracts: Contract[]) => {
        setContracts(updatedContracts);
        saveContracts(updatedContracts);
    };

    const handleUpdatePlanningItems = (updatedItems: PlanningItem[]) => {
        setPlanningItems(updatedItems);
        savePlanningItems(updatedItems);
    };

    const handleUpdateSettings = (newSettings: AppSettings) => {
        setSettings(newSettings);
        saveSettings(newSettings);
        applyTheme(newSettings.theme);
    };
    
    const toggleTheme = () => {
        const newTheme = settings.theme === 'light' ? 'dark' : 'light';
        handleUpdateSettings({ ...settings, theme: newTheme });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case Tab.Contracts:
                return <ContractsTab 
                            contracts={contracts} 
                            onUpdateContracts={handleUpdateContracts}
                            settings={settings}
                            onUpdateSettings={handleUpdateSettings}
                        />;
            case Tab.Planning:
                return <PlanningTab planningItems={planningItems} onUpdatePlanningItems={handleUpdatePlanningItems} />;
            case Tab.Statistics:
                return <StatisticsTab contracts={contracts} />;
            default:
                return null;
        }
    };

    const NavButton = ({ tab, label }: { tab: Tab, label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === tab 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-100' 
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex flex-col h-screen font-sans bg-gray-100 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm flex-shrink-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left side: Logo and Title */}
                        <div className="flex items-center space-x-3">
                            <LogoIcon className="h-8 w-8 text-primary-500" />
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Облік договорів</h1>
                        </div>

                        {/* Center: Navigation */}
                        <nav className="hidden md:flex items-center space-x-4">
                           <NavButton tab={Tab.Contracts} label="Договори"/>
                           <NavButton tab={Tab.Planning} label="Планування"/>
                           <NavButton tab={Tab.Statistics} label="Статистика"/>
                        </nav>

                        {/* Right side: Actions */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleTheme}
                                title={settings.theme === 'light' ? 'Перейти на темну тему' : 'Перейти на світлу тему'}
                                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {settings.theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                            </button>
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                title="Налаштування"
                                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <SettingsIcon className="h-6 w-6"/>
                            </button>
                        </div>
                    </div>
                </div>
                 {/* Mobile Navigation */}
                <nav className="md:hidden flex justify-around p-2 border-t dark:border-gray-700">
                    <NavButton tab={Tab.Contracts} label="Договори"/>
                    <NavButton tab={Tab.Planning} label="Планування"/>
                    <NavButton tab={Tab.Statistics} label="Статистика"/>
                </nav>
            </header>
            
            <main className="flex-1 p-6 overflow-auto">
                {renderTabContent()}
            </main>
            
            {isSettingsOpen && (
                <SettingsDialog
                    settings={settings}
                    onSave={handleUpdateSettings}
                    onClose={() => setIsSettingsOpen(false)}
                />
            )}
        </div>
    );
};

export default App;