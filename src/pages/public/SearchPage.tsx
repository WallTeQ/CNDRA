import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Calendar, User, Tag } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockDocuments } from '../../data/mockData';
import { Document, SearchFilters } from '../../types';
import { Link } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    type: [],
    dateRange: { start: '', end: '' },
    author: '',
    category: '',
    accessLevel: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(mockDocuments);

  const documentsPerPage = 6;
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  const documentTypes = ['manuscript', 'photograph', 'map', 'record', 'audio', 'video', 'other'];
  const accessLevels = ['public', 'internal', 'confidential'];

  const handleSearch = () => {
    let filtered = mockDocuments;

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filters.type.length > 0) {
      filtered = filtered.filter(doc => filters.type.includes(doc.type));
    }

    if (filters.author) {
      filtered = filtered.filter(doc => 
        doc.author?.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
    setCurrentPage(1);
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: 'default' | 'success' | 'warning' | 'danger' | 'info' } = {
      manuscript: 'info',
      photograph: 'warning',
      map: 'success',
      record: 'default',
      audio: 'info',
      video: 'warning',
      other: 'default'
    };
    return colors[type] || 'default';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isPublic={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Search Archives</h1>
          <p className="text-lg text-slate-600">
            Search through our collection of historical documents, photographs, and records.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              <Button onClick={handleSearch} className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
                <div className="space-y-2">
                  {documentTypes.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, type: [...prev.type, type] }));
                          } else {
                            setFilters(prev => ({ ...prev, type: prev.type.filter(t => t !== type) }));
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-600 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
                <input
                  type="text"
                  placeholder="Enter author name"
                  value={filters.author}
                  onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    placeholder="Start date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    placeholder="End date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Access Level</label>
                <div className="space-y-2">
                  {accessLevels.map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.accessLevel.includes(level)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, accessLevel: [...prev.accessLevel, level] }));
                          } else {
                            setFilters(prev => ({ ...prev, accessLevel: prev.accessLevel.filter(l => l !== level) }));
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-600 capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Results */}
        <div className="mb-6">
          <p className="text-slate-600">
            Found {filteredDocuments.length} documents
          </p>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentDocuments.map((document) => (
            <Card key={document.id} className="overflow-hidden p-0" hover>
              {document.previewUrl && (
                <img
                  src={document.previewUrl}
                  alt={document.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={getTypeColor(document.type)} className="capitalize">
                    {document.type}
                  </Badge>
                  <Badge variant="success">
                    {document.accessLevel}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                  {document.title}
                </h3>
                
                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  {document.author && (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{document.author}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(document.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {document.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="default" size="sm">
                      {tag}
                    </Badge>
                  ))}
                  {document.tags.length > 3 && (
                    <Badge variant="default" size="sm">
                      +{document.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  
                  <Link to={`/document/${document.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Button>
                  </Link>
                  {document.accessLevel === 'public' && (
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'outline'}
                onClick={() => setCurrentPage(page)}
                size="sm"
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};