
import React, { useState, useMemo } from 'react';
import { PlanningItem } from '../types';
import DataTable from './DataTable';
import PlanningDialog from './PlanningDialog';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from './icons';

interface PlanningTabProps {
    planningItems: PlanningItem[];
    onUpdatePlanningItems: (items: PlanningItem[]) => void;
}

const PlanningTab: React.FC<PlanningTabProps> = ({ planningItems, onUpdatePlanningItems }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PlanningItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // FIX: Added explicit type to ensure keys are typed as `keyof PlanningItem` instead of `string`.
    const planningColumns: { key: keyof PlanningItem; label: string; visible: boolean; }[] = [
        { key: 'name', label: 'Назва предмета закупівлі', visible: true },
        { key: 'classifiers', label: 'Коди класифікаторів', visible: true },
        { key: 'kekv', label: 'Код КЕКВ', visible: true },
        { key: 'budget', label: 'Розмір бюджетного призначення', visible: true },
        { key: 'procedure', label: 'Процедура закупки', visible: true },
        { key: 'start_date', label: 'Орієнтовний початок', visible: true },
        { key: 'volume', label: 'Обсяг закупки', visible: true },
        { key: 'notes', label: 'Примітки', visible: true },
    ];

    const handleAdd = () => {
        setSelectedItem(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: PlanningItem) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей план?')) {
            onUpdatePlanningItems(planningItems.filter(item => item.id !== id));
        }
    };
    
    const handleSave = (item: PlanningItem) => {
        if (item.id) {
            onUpdatePlanningItems(planningItems.map(i => i.id === item.id ? item : i));
        } else {
            onUpdatePlanningItems([...planningItems, { ...item, id: new Date().toISOString() }]);
        }
        setIsDialogOpen(false);
    };

    const filteredItems = useMemo(() => {
        return planningItems.filter(item => 
            Object.values(item).some(value => 
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [planningItems, searchTerm]);

    return (
        <div className="flex flex-col h-full">
            <header className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Планування закупівель</h2>
                <p className="text-gray-500 dark:text-gray-400">Керуйте планованими закупівлями.</p>
            </header>

            <div className="flex justify-between items-center mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                       <SearchIcon className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Пошук..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <button onClick={handleAdd} className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                    <PlusIcon className="h-5 w-5" />
                    <span>Додати план</span>
                </button>
            </div>
            
            <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <DataTable<PlanningItem>
                    columns={planningColumns}
                    data={filteredItems}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {isDialogOpen && (
                <PlanningDialog
                    item={selectedItem}
                    onSave={handleSave}
                    onClose={() => setIsDialogOpen(false)}
                />
            )}
        </div>
    );
};

export default PlanningTab;