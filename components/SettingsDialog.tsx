
import React, { useState } from 'react';
import { AppSettings, ColumnConfig } from '../types';
import Modal from './common/Modal';

interface SettingsDialogProps {
    settings: AppSettings;
    onSave: (settings: AppSettings) => void;
    onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ settings, onSave, onClose }) => {
    const [currentSettings, setCurrentSettings] = useState<AppSettings>(settings);

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentSettings({ ...currentSettings, theme: e.target.value as 'light' | 'dark' });
    };
    
    const handleColumnVisibilityChange = (key: keyof import('../types').Contract) => {
        const updatedColumns = currentSettings.columnVisibility.map(col =>
            col.key === key ? { ...col, visible: !col.visible } : col
        );
        setCurrentSettings({ ...currentSettings, columnVisibility: updatedColumns });
    };

    const handleSave = () => {
        onSave(currentSettings);
        onClose();
    };

    return (
        <Modal title="Налаштування" onClose={onClose}>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Зовнішній вигляд</h3>
                    <div className="mt-2">
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Тема</label>
                        <select
                            id="theme"
                            value={currentSettings.theme}
                            onChange={handleThemeChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="light">Світла</option>
                            <option value="dark">Темна</option>
                        </select>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Видимість колонок в таблиці договорів</h3>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                        {currentSettings.columnVisibility.map((col) => (
                            <div key={col.key} className="flex items-center">
                                <input
                                    id={`col-${col.key}`}
                                    type="checkbox"
                                    checked={col.visible}
                                    onChange={() => handleColumnVisibilityChange(col.key)}
                                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <label htmlFor={`col-${col.key}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{col.label}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <div className="mt-6 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Скасувати</button>
                <button type="button" onClick={handleSave} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">Зберегти</button>
            </div>
        </Modal>
    );
};

export default SettingsDialog;
