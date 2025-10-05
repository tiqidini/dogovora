
import React, { useMemo } from 'react';
import { Contract } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StatisticsTabProps {
    contracts: Contract[];
}

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            {children}
        </div>
    </div>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StatisticsTab: React.FC<StatisticsTabProps> = ({ contracts }) => {
    const contractsByYear = useMemo(() => {
        const counts: { [year: number]: number } = {};
        contracts.forEach(c => {
            counts[c.year] = (counts[c.year] || 0) + 1;
        });
        return Object.entries(counts).map(([year, count]) => ({ year, count })).sort((a,b) => Number(a.year) - Number(b.year));
    }, [contracts]);
    
    const costByYear = useMemo(() => {
        const costs: { [year: number]: number } = {};
        contracts.forEach(c => {
            costs[c.year] = (costs[c.year] || 0) + c.expected_cost;
        });
        return Object.entries(costs).map(([year, total]) => ({ year, total: parseFloat(total.toFixed(2)) })).sort((a,b) => Number(a.year) - Number(b.year));
    }, [contracts]);

    const contractsByType = useMemo(() => {
        const types: { [type: string]: number } = {};
        contracts.forEach(c => {
            types[c.procurement_type] = (types[c.procurement_type] || 0) + 1;
        });
        return Object.entries(types).map(([name, value]) => ({ name, value }));
    }, [contracts]);
    
    const topContractors = useMemo(() => {
        const contractorCosts: { [name: string]: number } = {};
        contracts.forEach(c => {
            contractorCosts[c.contracting_party] = (contractorCosts[c.contracting_party] || 0) + c.expected_cost;
        });
        return Object.entries(contractorCosts)
                     .map(([name, total]) => ({ name, total: parseFloat(total.toFixed(2)) }))
                     .sort((a, b) => b.total - a.total)
                     .slice(0, 10);

    }, [contracts]);


    if (contracts.length === 0) {
        return (
            <div className="flex flex-col h-full items-center justify-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Статистика</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Немає даних для відображення. Додайте договори, щоб побачити статистику.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <header className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Статистика по договорах</h2>
                <p className="text-gray-500 dark:text-gray-400">Візуалізація даних по закупівлях.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartContainer title="Кількість договорів по роках">
                    <ResponsiveContainer>
                        <BarChart data={contractsByYear}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Кількість договорів" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                <ChartContainer title="Загальна вартість по роках">
                     <ResponsiveContainer>
                        <BarChart data={costByYear}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `${value.toLocaleString()} грн`} />
                            <Legend />
                            <Bar dataKey="total" fill="#82ca9d" name="Загальна вартість" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                <ChartContainer title="Розподіл за типом закупки">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={contractsByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                {contractsByType.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
                
                <ChartContainer title="Топ-10 постачальників за сумою договорів">
                    <ResponsiveContainer>
                        <BarChart layout="vertical" data={topContractors}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip formatter={(value: number) => `${value.toLocaleString()} грн`} />
                            <Legend />
                            <Bar dataKey="total" fill="#ffc658" name="Сума" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    );
};

export default StatisticsTab;
