import React, { useState, useMemo, useRef, useCallback } from 'react';
import { 
    PencilIcon, 
    TrashIcon, 
    ChevronUpIcon, 
    ChevronDownIcon,
    GlobeIcon,
    FolderIcon,
    CheckboxCheckedIcon,
    CheckboxUncheckedIcon
} from './icons';

// FIX: Сделал конфигурацию столбцов универсальной для поддержки различных типов данных.
// Это позволяет DataTable работать как с Contract, так и с PlanningItem.
interface GenericColumnConfig<T> {
    key: keyof T;
    label: string;
    width?: number;
}

interface DataTableProps<T extends { id: string }> {
    columns: ReadonlyArray<GenericColumnConfig<T>>;
    data: T[];
    onEdit: (item: T) => void;
    onDelete: (id: string) => void;
    onRowClick?: (item: T) => void;
    onRowDoubleClick?: (item: T) => void;
    selectedId?: string | null;
    onColumnResize?: (key: keyof T, newWidth: number) => void;
}

const DataTable = <T extends { id: string },>(props: DataTableProps<T>) => {
    const { columns, data, onEdit, onDelete, onRowClick, onRowDoubleClick, selectedId, onColumnResize } = props;
    const [sortConfig, setSortConfig] = useState<{ key: keyof T, direction: 'ascending' | 'descending' } | null>(null);
    const resizingColumnRef = useRef<{key: keyof T, startX: number, startWidth: number} | null>(null);

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const requestSort = (key: keyof T) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof T) => {
        if (!sortConfig || sortConfig.key !== key) {
            return null;
        }
        if (sortConfig.direction === 'ascending') {
            return <ChevronUpIcon className="h-4 w-4 inline ml-1" />;
        }
        return <ChevronDownIcon className="h-4 w-4 inline ml-1" />;
    };

    const handleResizeStart = (e: React.MouseEvent, key: keyof T) => {
        e.preventDefault();
        const thElement = (e.target as HTMLElement).closest('th');
        if (!thElement) return;

        resizingColumnRef.current = {
            key,
            startX: e.clientX,
            startWidth: thElement.offsetWidth,
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!resizingColumnRef.current || !onColumnResize) return;
        const { key, startX, startWidth } = resizingColumnRef.current;
        const newWidth = startWidth + (e.clientX - startX);
        if (newWidth > 50) { // Minimum width
             onColumnResize(key, newWidth);
        }
    }, [onColumnResize]);

    const handleMouseUp = useCallback(() => {
        resizingColumnRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);


    const renderCellContent = (item: T, columnKey: keyof T): React.ReactNode => {
        const value = item[columnKey];

        switch (columnKey) {
            case 'du':
            case 'reporting':
                return (
                    <div className="flex justify-center">
                        {value ? <CheckboxCheckedIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" /> : <CheckboxUncheckedIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
                    </div>
                );
            
            case 'prozorro_link':
                const link = value as string;
                return link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex justify-center">
                        <GlobeIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                    </a>
                ) : <span className="flex justify-center">-</span>;

            case 'contract_file_name':
                 return value ? (
                    <div className="flex justify-center">
                        <FolderIcon className="h-5 w-5 text-blue-500" />
                    </div>
                ) : <span className="flex justify-center">-</span>;

            case 'expected_cost':
                return typeof value === 'number' 
                    ? value.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : String(value);

            case 'contract_date':
            case 'legal_date':
            case 'financial_date':
            case 'announced_winner':
                try {
                    if (value && typeof value === 'string') {
                        return new Date(value + 'T00:00:00').toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
                    }
                } catch (e) {
                    return String(value); 
                }
                return String(value);
            
            default:
                return String(value);
        }
    };


    return (
        <div className="w-full h-full overflow-auto">
            <table className="min-w-full border-collapse" style={{ tableLayout: 'fixed' }}>
                 <colgroup>
                    <col style={{ width: 40 }} />
                    {columns.map(col => (
                        <col key={String(col.key)} style={{ width: col.width || 150 }} />
                    ))}
                    <col style={{ width: 100 }} />
                </colgroup>
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                    <tr>
                         <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border border-gray-200 dark:border-gray-600">#</th>
                        {columns.map((col) => (
                            <th 
                                key={String(col.key)} 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border border-gray-200 dark:border-gray-600 relative group"
                            >
                                <div onClick={() => requestSort(col.key)} className="cursor-pointer">
                                    {col.label}
                                    {getSortIcon(col.key)}
                                </div>
                                 <div
                                    className="absolute top-0 right-0 w-2 h-full cursor-col-resize group-hover:bg-primary-200 dark:group-hover:bg-primary-800"
                                    onMouseDown={(e) => handleResizeStart(e, col.key)}
                                />
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border border-gray-200 dark:border-gray-600">
                            Дії
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                    {sortedData.length > 0 ? sortedData.map((item, index) => (
                        <tr 
                            key={item.id} 
                            onClick={() => onRowClick?.(item)}
                            onDoubleClick={() => onRowDoubleClick?.(item)}
                            className={`cursor-pointer transition-colors duration-150 ${
                                selectedId === item.id 
                                ? 'bg-primary-100 dark:bg-primary-900/50' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 text-center">{index + 1}</td>
                            {columns.map((col) => (
                                <td key={`${item.id}-${String(col.key)}`} className="px-6 py-4 whitespace-normal break-words text-sm text-gray-800 dark:text-gray-200 max-w-xs border border-gray-200 dark:border-gray-600">
                                    {renderCellContent(item, col.key)}
                                </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border border-gray-200 dark:border-gray-600">
                                <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 mr-4">
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    )) : (
                         <tr>
                            <td colSpan={columns.length + 2} className="text-center py-10 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                Немає даних для відображення
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;