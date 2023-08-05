export interface ExistingPosition {
    companyId: number;
    position: {
        id?: number;
        title: string;
        department_id: number | string;
    }
}