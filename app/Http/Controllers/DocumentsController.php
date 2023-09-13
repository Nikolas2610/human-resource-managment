<?php

namespace App\Http\Controllers;

use App\Http\Requests\Document\StoreDocumentRequest;
use App\Http\Requests\Document\UpdateDocumentRequest;
use App\Models\Company;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;

class DocumentsController extends Controller
{
    public function index(Company $company)
    {
        // Retrieve all documents
        $documents = Document::all();
        return response()->json($documents);
    }

    public function show(Company $company, Document $document)
    {
        // Retrieve a specific document
        return response()->json($document);
    }

    public function store(Company $company, StoreDocumentRequest $request)
    {
        // Validate the incoming request
        $validatedData = $request->validated();

        // Handle file upload
        $path = $request->file('file_path')->store('employee_documents', 'public');

        // return response()->json($validatedData, 404);

        // Store the document
        $document = new Document();
        $document->employee_id = $validatedData['employee_id'];
        $document->title = $validatedData['title'];
        $document->file_path = $path;
        $document->save();

        return response()->json(['message' => 'Document successfully uploaded']);
    }

    public function update(Company $company, UpdateDocumentRequest $request, Document $document)
    {
        // Validate request
        $validatedData = $request->validated();

        // Optionally handle a new file upload
        if ($request->hasFile('file_path')) {
            // Delete the old file
            Storage::disk('public')->delete($document->file_path);

            // Upload the new file
            $path = $request->file('file_path')->store('employee_documents', 'public');
            $document->file_path = $path;
        }

        // Update fields
        $document->fill($validatedData);
        $document->save();

        return response()->json(['message' => 'Document successfully updated']);
    }

    public function destroy(Company $company, Document $document)
    {
        // Delete the file
        Storage::disk('public')->delete($document->file_path);

        // Delete the record
        $document->delete();

        return response()->json(['message' => 'Document successfully deleted']);
    }
}
