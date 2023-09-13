<?php

namespace App\Http\Requests\Document;

use App\Http\Requests\Request;

class StoreDocumentRequest extends Request
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
            'employee_id' => 'required|exists:employees,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'file_path' => 'required|file',
        ];
    }
}
