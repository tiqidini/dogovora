
import React, { useState } from 'react';
import { PlanningItem } from '../types';
import Modal from './common/Modal';

interface PlanningDialogProps {
    item: PlanningItem | null;
    onSave: (item: PlanningItem) => void;
    onClose: () => void;
}

const initialItemState: Omit<PlanningItem, 'id'> = {
    name: '',
    classifiers: '',
    kekv: '',
    budget: '',
    procedure: '',
    start_date: '',
    volume: '',
    notes: '',
};

const PlanningDialog: React.FC<PlanningDialogProps> = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState<PlanningItem | Omit<PlanningItem, 'id'>>(item || initialItemState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as PlanningItem);
    };

    const renderField = (name: keyof typeof initialItemState, label: string, type: string = 'text') => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={String(formData[name as keyof typeof formData])}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
            />
        </div>
    );
    
    return (
        <Modal title={item ? 'Редагувати план' : 'Додати план'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto p-1">
                    {renderField('name', 'Назва предмета закупівлі')}
                    {renderField('classifiers', 'Коди класифікаторів')}
                    {renderField('kekv', 'Код КЕКВ')}
                    {renderField('budget', 'Розмір бюджетного призначення')}
                    {renderField('procedure', 'Процедура закупки')}
                    {renderField('start_date', 'Орієнтовний початок', 'date')}
                    {renderField('volume', 'Обсяг закупки')}
                    {renderField('notes', 'Примітки')}
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Скасувати</button>
                    <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">Зберегти</button>
                </div>
            </form>
        </Modal>
    );
};

export default PlanningDialog;