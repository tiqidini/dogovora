import { AppSettings, ColumnConfig } from './types';

export const CONTRACT_COLUMNS: ColumnConfig[] = [
    { key: 'item', label: 'Предмет закупівлі', visible: true, width: 300 },
    { key: 'dk_code', label: 'ДК 021:2015', visible: true, width: 120 },
    { key: 'quantity', label: 'К-ть', visible: true, width: 60 },
    { key: 'unit', label: 'Одиниця виміру', visible: true, width: 100 },
    { key: 'expected_cost', label: 'Ціна, ₴', visible: true, width: 120 },
    { key: 'contract_number', label: 'Номер договору', visible: true, width: 120 },
    { key: 'contract_date', label: 'Дата договору', visible: true, width: 120 },
    { key: 'year', label: 'Рік', visible: true, width: 70 },
    { key: 'contracting_party', label: 'Постачальник або Виконавець', visible: true, width: 250 },
    { key: 'du', label: 'ДУ', visible: true, width: 50 },
    { key: 'reporting', label: 'Звіт', visible: true, width: 50 },
    { key: 'procurement_type', label: 'Прямий/Процедура', visible: true, width: 120 },
    { key: 'prozorro_link', label: 'Prozorro', visible: true, width: 80 },
    { key: 'contract_file_name', label: 'Файл договору', visible: true, width: 80 },
    // Hidden by default
    { key: 'kekv', label: 'Код КЕКВ', visible: false, width: 100 },
    { key: 'legal_date', label: 'Юридична дата', visible: false, width: 120 },
    { key: 'financial_date', label: 'Фінансова дата', visible: false, width: 120 },
    { key: 'announced_winner', label: 'Оголошено переможця', visible: false, width: 120 },
    { key: 'contract_file_path', label: 'Шлях до файлу', visible: false, width: 200 },
];


export const DEFAULT_SETTINGS: AppSettings = {
    theme: 'light',
    font: 'sans-serif',
    fontSize: 14,
    columnVisibility: CONTRACT_COLUMNS,
};