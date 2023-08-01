<?php

namespace App\Http\Resources\Department;

use Illuminate\Http\Resources\Json\ResourceCollection;

class DepartmentCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return $this->collection->transform(function ($department) {
            return [
                'id' => $department->id,
                'company_id' => $department->company_id,
                'name' => $department->name,
                'manager_id' => $department->manager_id,
                'num_employees' => $department->employees->count(),
            ];
        });
    }
}
