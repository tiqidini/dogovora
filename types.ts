
export interface Contract {
    id: string;
    item: string;
    dk_code: string;
    kekv: string;
    quantity: number;
    unit: string;
    expected_cost: number;
    contract_number: string;
    contract_date: string;
    year: number;
    legal_date: string;
    financial_date: string;
    contracting_party: string;
    du: boolean;
    reporting: boolean;
    procurement_type: string;
    prozorro_link: string;
    contract_file_name: string;
    announced_winner: string;
    contract_file_path: string;
}

export interface PlanningItem {
    id: string;
    name: string;
    classifiers: string;
    kekv: string;
    budget: string;
    procedure: string;
    start_date: string;
    volume: string;
    notes: string;
}

export interface ColumnConfig {
    key: keyof Contract;
    label: string;
    visible: boolean;
    width?: number;
}

export interface AppSettings {
    theme: 'light' | 'dark';
    font: string;
    fontSize: number;
    columnVisibility: ColumnConfig[];
}

export enum Tab {
    Contracts = 'contracts',
    Planning = 'planning',
    Statistics = 'statistics',
}