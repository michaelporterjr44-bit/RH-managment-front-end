// types/actionHistory.ts
export interface ActionHistory {
    id: string;
    date: string;

    userId: string;
    userEmail: string;
    userFullName: string;

    observation: string;
    type: ActionType;
}

export enum ActionType {
    READ = 'READ',
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
}

export interface ActionTypeConfig {
    label: string;
    color: string;
    icon: string;
    bgColor: string;
}

export interface FilterOptions {
    user?: string;
    type?: ActionType;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}