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
                'manager' => new DepartmentManagerResource($department->manager),
                'num_employees' => $department->employees->count(),
            ];
        });
    }
}
