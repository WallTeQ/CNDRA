import React, { useState } from 'react';
import { Upload, X, FileText, Image, Map, Music, Video, File } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const UploadDocument: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    type: 'manuscript',
    author: '',
    date: '',
    description: '',
    tags: '',
    category: '',
    accessLevel: 'public'
  });

  const documentTypes = [
    { value: 'manuscript', label: 'Manuscript', icon: FileText },
    { value: 'photograph', label: 'Photograph', icon: Image },
    { value: 'map', label: 'Map', icon: Map },
    { value: 'record', label: 'Record', icon: FileText },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'other', label: 'Other', icon: File }
  ];

  const categories = [
    'Historical Records',
    'Military Records',
    'Social History',
    'Political Documents',
    'Legal Documents',
    'Cultural Archives',
    'Scientific Records',
    'Other'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('audio/')) return Music;
    if (type.startsWith('video/')) return Video;
    return FileText;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting document:', { formData, files });
    // Here you would typically send the data to your backend
    alert('Document uploaded successfully!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Upload Document</h1>
          <p className="mt-1 text-sm text-gray-600">
            Add a new document to the archive system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Document Files</h3>
            
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Drop files here or click to browse
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    PDF, images, audio, video files up to 50MB each
                  </p>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Selected Files</h4>
                {files.map((file, index) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Document Metadata */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Document Information</h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter document title"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Document Type *
                </label>
                <select
                  id="type"
                  required
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter a detailed description of the document"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter tags separated by commas"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate multiple tags with commas (e.g., colonial, history, boston)
                </p>
              </div>
            </div>
          </Card>

          {/* Access Control */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Access Control</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Access Level *
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accessLevel"
                    value="public"
                    checked={formData.accessLevel === 'public'}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Public</span>
                    <span className="block text-xs text-gray-500">
                      Accessible to all users and searchable
                    </span>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accessLevel"
                    value="internal"
                    checked={formData.accessLevel === 'internal'}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Internal</span>
                    <span className="block text-xs text-gray-500">
                      Only accessible to staff and authorized users
                    </span>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accessLevel"
                    value="confidential"
                    checked={formData.accessLevel === 'confidential'}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Confidential</span>
                    <span className="block text-xs text-gray-500">
                      Restricted access - admin approval required
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit">
              Upload Document
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};