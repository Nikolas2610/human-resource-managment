export type CRUDOperation = 'store' | 'update' | 'delete';

/**
 * Helper function to generate success and error messages for CRUD operations
 * @param {string} modelName - The name of the model/item being processed (e.g., "Employee", "Product")
 * @param {CRUDOperation} operation - The operation being performed: "store", "update", or "delete"
 * @param {boolean} isError - Indicates if the message should be for a successful operation or an error
 * @returns {string} - The generated message
 */
function generateResponseMessage(modelName: string, operation: CRUDOperation, isError: boolean = false): string {
    let baseMessage: string;

    switch (operation) {
        case 'store':
            baseMessage = isError ? `Failed to create ${modelName}.` : `${modelName} created successfully.`;
            break;
        case 'update':
            baseMessage = isError ? `Failed to update ${modelName}.` : `${modelName} updated successfully.`;
            break;
        case 'delete':
            baseMessage = isError ? `Failed to delete ${modelName}.` : `${modelName} deleted successfully.`;
            break;
        default:
            throw new Error('Invalid CRUD operation provided.');
    }

    return baseMessage;
}

export default generateResponseMessage;

// Example Usage:
// const successMsg = generateMessage('Employee', 'store');         // "Employee created successfully."
// const errorMsg = generateMessage('Employee', 'store', true);      // "Failed to create Employee."
