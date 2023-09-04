<?php

namespace App\Http\Requests\Company;

use App\Http\Requests\Request;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomizationRequest extends Request
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
            'logo' => 'nullable|image|mimes:jpeg,png,gif,svg|max:1024',
            'primary_color' => 'nullable|string',
            'secondary_color' => 'nullable|string',
        ];
    }
}
