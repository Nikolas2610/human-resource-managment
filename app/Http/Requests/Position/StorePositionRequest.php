<?php

namespace App\Http\Requests\Position;

use App\Http\Requests\Request;
use Illuminate\Validation\Rule;

class StorePositionRequest extends Request
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
            'title' => 'required|string',
            'department_id' => 'required|integer',
        ];
    }
}
