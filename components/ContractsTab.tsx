import React, { useState, useMemo } from 'react';
import { Contract, AppSettings } from '../types';
import DataTable from './DataTable';
import ContractDialog from './ContractDialog';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, DownloadIcon } from './icons';

interface ContractsTabProps {
    contracts: Contract[];
    onUpdateContracts: (contracts: Contract[]) => void;
    settings: AppSettings;
    onUpdateSettings: (settings: AppSettings) => void;
}

const ContractsTab: React.FC<ContractsTabProps> = ({ contracts, onUpdateContracts, settings, onUpdateSettings }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [contractToEdit, setContractToEdit] = useState<Contract | null>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterYear, setFilterYear] = useState('');
    
    const visibleColumns = useMemo(() => settings.columnVisibility.filter(c => c.visible), [settings.columnVisibility]);

    const handleAdd = () => {
        setContractToEdit(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (contract: Contract) => {
        setContractToEdit(contract);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей договір?')) {
            onUpdateContracts(contracts.filter(c => c.id !== id));
            if (selectedRowId === id) {
                setSelectedRowId(null);
            }
        }
    };

    const handleSave = (contract: Contract) => {
        if (contract.id) {
            onUpdateContracts(contracts.map(c => c.id === contract.id ? contract : c));
        } else {
            const newContract = { ...contract, id: new Date().toISOString() };
            onUpdateContracts([...contracts, newContract]);
        }
        setIsDialogOpen(false);
    };

    const handleColumnResize = (key: keyof Contract, newWidth: number) => {
        const newColumnVisibility = settings.columnVisibility.map(col => 
            col.key === key ? { ...col, width: Math.round(newWidth) } : col
        );
        onUpdateSettings({ ...settings, columnVisibility: newColumnVisibility });
    };

    const handleExport = () => {
        const headers = visibleColumns.map(c => c.label).join(',');
        const rows = filteredContracts.map(contract => 
            visibleColumns.map(col => {
                const value = contract[col.key];
                if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
                if (typeof value === 'boolean') return value ? 'Так' : 'Ні';
                return value;
            }).join(',')
        ).join('\n');

        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "contracts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const { filteredContracts, totalCost } = useMemo(() => {
        const filtered = contracts.filter(contract => {
            const yearMatch = filterYear ? contract.year.toString() === filterYear : true;
            const searchMatch = Object.values(contract).some(value => 
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
            return yearMatch && searchMatch;
        });
        const cost = filtered.reduce((sum, contract) => sum + contract.expected_cost, 0);
        return { filteredContracts: filtered, totalCost: cost };
    }, [contracts, searchTerm, filterYear]);
    
    const years = useMemo(() => [...new Set(contracts.map(c => c.year))].sort((a: number, b: number) => b - a), [contracts]);

    return (
        <div className="flex flex-col h-full">
            <header className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Управління договорами</h2>
                <p className="text-gray-500 dark:text-gray-400">Додавайте, редагуйте та переглядайте договори.</p>
            </header>
            
            <div className="flex flex-wrap justify-between items-center gap-y-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                           <SearchIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Пошук..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg bg-gray-50 text-gray-900 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Всі роки</option>
                        {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <DownloadIcon className="h-5 w-5"/>
                        <span>Експорт в CSV</span>
                    </button>
                    <button onClick={handleAdd} className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                        <PlusIcon className="h-5 w-5" />
                        <span>Додати договір</span>
                    </button>
                </div>
            </div>

            <div className="flex justify-end items-center mb-4 px-4">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Відфільтровано записів: {filteredContracts.length}, Загальна вартість: 
                    <span className="font-bold text-red-600 dark:text-red-400 ml-1">
                        {totalCost.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴
                    </span>
                </span>
            </div>

            <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                 <DataTable<Contract>
                    columns={visibleColumns}
                    data={filteredContracts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRowClick={(contract) => setSelectedRowId(contract.id)}
                    onRowDoubleClick={handleEdit}
                    selectedId={selectedRowId}
                    onColumnResize={handleColumnResize}
                />
            </div>

            {isDialogOpen && (
                <ContractDialog
                    contract={contractToEdit}
                    onSave={handleSave}
                    onClose={() => setIsDialogOpen(false)}
                />
            )}
        </div>
    );
};

export default ContractsTab;