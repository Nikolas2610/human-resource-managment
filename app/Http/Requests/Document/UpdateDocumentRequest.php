<?php

namespace App\Http\Requests\Document;

use App\Http\Requests\Request;

class UpdateDocumentRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'employee_id' => 'sometimes|exists:employees,id',
            'title' => 'sometimes|string',
            'description' => 'sometimes|nullable|string',
            'file_path' => 'sometimes|file',
        ];
    }
}
