
import React, { useState } from 'react';
import { Contract } from '../types';
import Modal from './common/Modal';

interface ContractDialogProps {
    contract: Contract | null;
    onSave: (contract: Contract) => void;
    onClose: () => void;
}

const initialContractState: Omit<Contract, 'id'> = {
    item: '',
    dk_code: '',
    kekv: '',
    quantity: 0,
    unit: '',
    expected_cost: 0,
    contract_number: '',
    contract_date: '',
    year: new Date().getFullYear(),
    legal_date: '',
    financial_date: '',
    contracting_party: '',
    du: false,
    reporting: false,
    procurement_type: 'Прямий',
    prozorro_link: '',
    contract_file_name: '',
    announced_winner: '',
    contract_file_path: '',
};

const ContractDialog: React.FC<ContractDialogProps> = ({ contract, onSave, onClose }) => {
    const [formData, setFormData] = useState<Contract | Omit<Contract, 'id'>>(contract || initialContractState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
             const { checked } = e.target as HTMLInputElement;
             setFormData({ ...formData, [name]: checked });
        } else if (type === 'number') {
            setFormData({ ...formData, [name]: parseFloat(value) || 0 });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Contract);
    };

    const renderField = (name: keyof typeof initialContractState, label: string, type: string = 'text', options?: string[]) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            {type === 'checkbox' ? (
                <input
                    id={name}
                    name={name}
                    type="checkbox"
                    checked={!!formData[name as keyof typeof formData]}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
            ) : type === 'select' ? (
                <select 
                    id={name} 
                    name={name} 
                    value={String(formData[name as keyof typeof formData])}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                >
                    {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={String(formData[name as keyof typeof formData])}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                />
            )}
        </div>
    );
    

    return (
        <Modal title={contract ? 'Редагувати договір' : 'Додати договір'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[65vh] overflow-y-auto p-1">
                    {renderField('item', 'Предмет закупівлі')}
                    {renderField('dk_code', 'Код ДК 021:2015')}
                    {renderField('kekv', 'Код КЕКВ')}
                    {renderField('quantity', 'Кількість', 'number')}
                    {renderField('unit', 'Одиниця виміру')}
                    {renderField('expected_cost', 'Очікувана вартість', 'number')}
                    {renderField('contract_number', 'Номер договору')}
                    {renderField('contract_date', 'Дата договору', 'date')}
                    {renderField('year', 'Рік', 'number')}
                    {renderField('legal_date', 'Юридична дата', 'date')}
                    {renderField('financial_date', 'Фінансова дата', 'date')}
                    {renderField('contracting_party', 'Постачальник')}
                    {renderField('procurement_type', 'Тип закупки', 'select', ['Прямий', 'Процедура'])}
                    {renderField('prozorro_link', 'Посилання на Prozorro')}
                    {renderField('contract_file_name', 'Ім\'я файлу договору')}
                    {renderField('announced_winner', 'Дата оголошення переможця', 'date')}
                    <div className="flex items-center space-x-4 col-span-1 md:col-span-2 lg:col-span-3">
                        {renderField('du', 'Додаткове соглашення (ДУ)', 'checkbox')}
                        {renderField('reporting', 'Звітність', 'checkbox')}
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Скасувати</button>
                    <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">Зберегти</button>
                </div>
            </form>
        </Modal>
    );
};

export default ContractDialog;