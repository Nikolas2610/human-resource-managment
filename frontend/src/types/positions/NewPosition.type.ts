export interface NewPosition {
    companyId: number;
    position: Omit<
        {
            title: string;
            department_id: number | string;
        },
        "id"
    >;
}
