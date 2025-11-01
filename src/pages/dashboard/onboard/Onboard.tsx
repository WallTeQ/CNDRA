import React, { useState } from "react";
import {
  Upload,
  Plus,
  Save,
  AlertCircle,
  CheckCircle,
  FileJson,
  Edit2,
  Trash2,
  Clock,
  AlertTriangle,
  X,
  Building2,
  Users,
  Workflow,
  Database,
} from "lucide-react";

const Onboarding = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [createdResources, setCreatedResources] = useState(null);
  const [schemas, setSchemas] = useState([
    {
      id: 1,
      name: "Personnel Records",
      version: "1.2",
      fields: 5,
      lastModified: "2025-10-15",
      status: "active",
    },
    {
      id: 2,
      name: "Financial Documents",
      version: "2.0",
      fields: 8,
      lastModified: "2025-10-10",
      status: "active",
    },
  ]);
  const [editingSchema, setEditingSchema] = useState(null);
  const [schemaFields, setSchemaFields] = useState([
    {
      id: 1,
      name: "Document Title",
      type: "text",
      required: true,
      searchable: true,
    },
    {
      id: 2,
      name: "Classification Level",
      type: "dropdown",
      required: true,
      searchable: true,
    },
    {
      id: 3,
      name: "Date Created",
      type: "date",
      required: true,
      searchable: true,
    },
  ]);
  const [changeLog, setChangeLog] = useState([]);
  const [showValidation, setShowValidation] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus("processing");
    setValidationErrors([]);
    setCreatedResources(null);

    // Simulate template processing
    setTimeout(() => {
      const errors = [
        {
          line: 12,
          message: "Missing required field: retention_period",
          severity: "error",
        },
        {
          line: 45,
          message:
            "ISO 16175 compliance warning: metadata_schema.access_rights format",
          severity: "warning",
        },
      ];

      if (Math.random() > 0.3) {
        setValidationErrors(errors);
        setUploadStatus("error");
        setCreatedResources(null);
      } else {
        // Simulate created resources from template
        setCreatedResources({
          ministry: {
            name: "Ministry of Health",
            code: "MOH",
            departments: 3,
          },
          departments: [
            { name: "Public Health Services", code: "PHS", roles: 2 },
            { name: "Medical Records Administration", code: "MRA", roles: 3 },
            { name: "Pharmaceutical Services", code: "PS", roles: 2 },
          ],
          roles: [
            { name: "System Administrator", permissions: 7 },
            { name: "Records Officer", permissions: 7 },
            { name: "Records Viewer", permissions: 3 },
            { name: "Compliance Officer", permissions: 5 },
          ],
          workflows: [
            { name: "Document Approval Workflow", steps: 3 },
            { name: "Records Retention Workflow", steps: 3 },
          ],
          schemas: [
            { name: "Personnel Records Schema", fields: 7 },
            { name: "Medical Records Schema", fields: 7 },
          ],
        });
        setUploadStatus("success");
      }
    }, 2000);
  };

  const addSchemaField = () => {
    const newField = {
      id: Date.now(),
      name: "New Field",
      type: "text",
      required: false,
      searchable: true,
    };
    setSchemaFields([...schemaFields, newField]);
    logChange("Added new field: New Field");
  };

  const removeSchemaField = (id) => {
    const field = schemaFields.find((f) => f.id === id);
    setSchemaFields(schemaFields.filter((f) => f.id !== id));
    logChange(`Removed field: ${field.name}`);
  };

  const updateSchemaField = (id, key, value) => {
    setSchemaFields(
      schemaFields.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const logChange = (description) => {
    setChangeLog([
      {
        id: Date.now(),
        description,
        timestamp: new Date().toISOString(),
        user: "Current User",
      },
      ...changeLog,
    ]);
  };

  const validateSchema = () => {
    setShowValidation(true);
    setTimeout(() => setShowValidation(false), 3000);
  };

  const saveSchema = () => {
    validateSchema();
    logChange("Schema saved successfully");
    alert("Schema changes saved and versioned!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Ministry Administration System
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            ISO 16175 Compliant Records Management
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("templates")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "templates"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Template Upload
            </button>
            <button
              onClick={() => setActiveTab("schemas")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "schemas"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Metadata Schemas
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "templates" && (
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Ministry Template
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Upload JSON or YAML templates to automatically create
                ministries, departments, roles, and workflows.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".json,.yaml,.yml"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileJson className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    JSON or YAML templates (max 5MB)
                  </p>
                </label>
              </div>

              {/* Upload Status */}
              {uploadStatus && (
                <div className="mt-6">
                  {uploadStatus === "processing" && (
                    <div className="flex items-center space-x-3 text-blue-600">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-sm font-medium">
                        Processing template and validating against ISO 16175...
                      </span>
                    </div>
                  )}

                  {uploadStatus === "success" && createdResources && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-green-900">
                            Template Validated Successfully
                          </h3>
                          <p className="text-sm text-green-700 mt-1">
                            Ministry structure, roles, and workflows have been
                            created. ISO 16175 compliance verified.
                          </p>
                        </div>
                      </div>

                      {/* Created Resources Summary */}
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <h4 className="text-sm font-semibold text-green-900 mb-3">
                          Resources Created:
                        </h4>

                        {/* Ministry */}
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <div className="flex items-start space-x-3">
                            <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {createdResources.ministry.name} (
                                {createdResources.ministry.code})
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {createdResources.ministry.departments}{" "}
                                departments created
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Departments */}
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <div className="flex items-start space-x-3">
                            <Building2 className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-2">
                                Departments (
                                {createdResources.departments.length})
                              </p>
                              <div className="space-y-1">
                                {createdResources.departments.map(
                                  (dept, idx) => (
                                    <div
                                      key={idx}
                                      className="text-xs text-gray-700 flex items-center justify-between bg-gray-50 px-2 py-1 rounded"
                                    >
                                      <span>
                                        {dept.name} ({dept.code})
                                      </span>
                                      <span className="text-gray-500">
                                        {dept.roles} roles assigned
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Roles */}
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <div className="flex items-start space-x-3">
                            <Users className="h-5 w-5 text-orange-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-2">
                                Roles ({createdResources.roles.length})
                              </p>
                              <div className="space-y-1">
                                {createdResources.roles.map((role, idx) => (
                                  <div
                                    key={idx}
                                    className="text-xs text-gray-700 flex items-center justify-between bg-gray-50 px-2 py-1 rounded"
                                  >
                                    <span>{role.name}</span>
                                    <span className="text-gray-500">
                                      {role.permissions} permissions
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Workflows */}
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <div className="flex items-start space-x-3">
                            <Workflow className="h-5 w-5 text-teal-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-2">
                                Workflows ({createdResources.workflows.length})
                              </p>
                              <div className="space-y-1">
                                {createdResources.workflows.map(
                                  (workflow, idx) => (
                                    <div
                                      key={idx}
                                      className="text-xs text-gray-700 flex items-center justify-between bg-gray-50 px-2 py-1 rounded"
                                    >
                                      <span>{workflow.name}</span>
                                      <span className="text-gray-500">
                                        {workflow.steps} steps
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Metadata Schemas */}
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-start space-x-3">
                            <Database className="h-5 w-5 text-indigo-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-2">
                                Metadata Schemas (
                                {createdResources.schemas.length})
                              </p>
                              <div className="space-y-1">
                                {createdResources.schemas.map((schema, idx) => (
                                  <div
                                    key={idx}
                                    className="text-xs text-gray-700 flex items-center justify-between bg-gray-50 px-2 py-1 rounded"
                                  >
                                    <span>{schema.name}</span>
                                    <span className="text-gray-500">
                                      {schema.fields} fields
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {uploadStatus === "error" && validationErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-red-900">
                            Validation Errors Detected
                          </h3>
                          <div className="mt-3 space-y-2">
                            {validationErrors.map((error, idx) => (
                              <div
                                key={idx}
                                className="flex items-start space-x-2 text-sm"
                              >
                                {error.severity === "error" ? (
                                  <X className="h-4 w-4 text-red-600 mt-0.5" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                )}
                                <span
                                  className={
                                    error.severity === "error"
                                      ? "text-red-700"
                                      : "text-yellow-700"
                                  }
                                >
                                  Line {error.line}: {error.message}
                                </span>
                              </div>
                            ))}
                          </div>
                          <button className="mt-3 text-sm font-medium text-red-700 hover:text-red-800">
                            Download Error Log
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Template Requirements
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Must include ministry/department structure definitions
                </li>
                <li>• Role definitions with permission mappings required</li>
                <li>
                  • Workflow definitions must conform to ISO 16175 standards
                </li>
                <li>• All metadata schemas must include retention policies</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "schemas" && (
          <div className="space-y-6">
            {/* Schema List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Metadata Schemas
                </h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">New Schema</span>
                </button>
              </div>

              <div className="space-y-3">
                {schemas.map((schema) => (
                  <div
                    key={schema.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {schema.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>Version {schema.version}</span>
                          <span>•</span>
                          <span>{schema.fields} fields</span>
                          <span>•</span>
                          <span>Modified {schema.lastModified}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingSchema(schema)}
                        className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schema Editor */}
            {editingSchema && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Edit Schema: {editingSchema.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Customize metadata fields for your department
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingSchema(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Validation Alert */}
                {showValidation && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">
                        Schema validated successfully against ISO 16175
                      </span>
                    </div>
                  </div>
                )}

                {/* Fields */}
                <div className="space-y-4 mb-6">
                  {schemaFields.map((field) => (
                    <div
                      key={field.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Field Name
                          </label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) =>
                              updateSchemaField(
                                field.id,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) =>
                              updateSchemaField(
                                field.id,
                                "type",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="dropdown">Dropdown</option>
                            <option value="boolean">Boolean</option>
                          </select>
                        </div>
                        <div className="col-span-2 flex items-end space-x-3">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) =>
                                updateSchemaField(
                                  field.id,
                                  "required",
                                  e.target.checked
                                )
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-700">
                              Required
                            </span>
                          </label>
                        </div>
                        <div className="col-span-2 flex items-end space-x-3">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.searchable}
                              onChange={(e) =>
                                updateSchemaField(
                                  field.id,
                                  "searchable",
                                  e.target.checked
                                )
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-700">
                              Searchable
                            </span>
                          </label>
                        </div>
                        <div className="col-span-1 flex items-end justify-end">
                          <button
                            onClick={() => removeSchemaField(field.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={addSchemaField}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">Add Field</span>
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={validateSchema}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Validate
                    </button>
                    <button
                      onClick={saveSchema}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span className="text-sm font-medium">Save Schema</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Change Log */}
            {editingSchema && changeLog.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Change Log
                  </h3>
                </div>
                <div className="space-y-3">
                  {changeLog.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start space-x-3 text-sm"
                    >
                      <div className="h-2 w-2 bg-blue-600 rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <p className="text-gray-900">{log.description}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(log.timestamp).toLocaleString()} by{" "}
                          {log.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
