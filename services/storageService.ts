
import { Contract, PlanningItem, AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { MOCK_CONTRACTS, MOCK_PLANNING_ITEMS } from './mockData';

const CONTRACTS_KEY = 'contracts_data';
const PLANNING_KEY = 'planning_data';
const SETTINGS_KEY = 'app_settings';

// Contracts
export const getContracts = (): Contract[] => {
    try {
        const data = localStorage.getItem(CONTRACTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error fetching contracts from localStorage:", error);
        return [];
    }
};

export const saveContracts = (contracts: Contract[]): void => {
    try {
        localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
    } catch (error) {
        console.error("Error saving contracts to localStorage:", error);
    }
};

// Planning Items
export const getPlanningItems = (): PlanningItem[] => {
    try {
        const data = localStorage.getItem(PLANNING_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error fetching planning items from localStorage:", error);
        return [];
    }
};

export const savePlanningItems = (items: PlanningItem[]): void => {
    try {
        localStorage.setItem(PLANNING_KEY, JSON.stringify(items));
    } catch (error) {
        console.error("Error saving planning items to localStorage:", error);
    }
};

// Settings
export const getSettings = (): AppSettings => {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            // Merge with defaults to ensure all keys are present
            return { ...DEFAULT_SETTINGS, ...parsed };
        }
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.error("Error fetching settings from localStorage:", error);
        return DEFAULT_SETTINGS;
    }
};

export const saveSettings = (settings: AppSettings): void => {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error("Error saving settings to localStorage:", error);
    }
};

// Function to initialize data if it doesn't exist
const initializeData = () => {
    if (localStorage.getItem(CONTRACTS_KEY) === null) {
        saveContracts(MOCK_CONTRACTS);
    }
    if (localStorage.getItem(PLANNING_KEY) === null) {
        savePlanningItems(MOCK_PLANNING_ITEMS);
    }
};

// Call initialization once when the module is imported
initializeData();
