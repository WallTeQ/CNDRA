import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, User, Tag, FileText, Eye, Share2, Clock, MapPin, Archive, Shield, ExternalLink, Bookmark, Printer as Print, ZoomIn as Zoom, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { mockDocuments } from '../../data/mockData';

export const DocumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const document = mockDocuments.find(doc => doc.id === id);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isPublic={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Archive className="mx-auto h-16 w-16 text-slate-400 mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Document Not Found</h1>
          <p className="text-lg text-slate-600 mb-8">
            The document you're looking for could not be found in our archives.
          </p>
          <Link to="/search">
            <Button size="lg">Search Our Archives</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAccessLevelInfo = (level: string) => {
    switch (level) {
      case 'public':
        return { color: 'success', description: 'Freely accessible to all users' };
      case 'internal':
        return { color: 'warning', description: 'Restricted to registered users' };
      case 'confidential':
        return { color: 'danger', description: 'Limited access - special permission required' };
      default:
        return { color: 'default', description: 'Access level not specified' };
    }
  };

  const accessInfo = getAccessLevelInfo(document.accessLevel);

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const relatedDocuments = mockDocuments
    .filter(doc => 
      doc.id !== document.id && 
      (doc.author === document.author || 
       doc.category === document.category ||
       doc.tags.some(tag => document.tags.includes(tag)))
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isPublic={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link to="/search" className="hover:text-slate-900">Search</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Document Details</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link to="/search" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Search Results</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Header */}
            <Card>
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="info" className="capitalize">
                    {document.type}
                  </Badge>
                  <Badge variant={accessInfo.color as any}>
                    {document.accessLevel}
                  </Badge>
                  <Badge variant="default" className="capitalize">
                    {document.status}
                  </Badge>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  {document.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-6">
                  {document.author && (
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span className="font-medium">{document.author}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDate(document.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Archive className="h-5 w-5" />
                    <span>{document.category}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Document</span>
                  </Button>
                  
                  {document.accessLevel === 'public' && (
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download ({formatFileSize(document.fileSize)})</span>
                    </Button>
                  )}
                  
                  <Button variant="outline" onClick={handleShare} className="flex items-center space-x-2">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Bookmark className="h-4 w-4" />
                    <span>Save</span>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Print className="h-4 w-4" />
                    <span>Print</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Document Description */}
            <Card>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">About This Document</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed text-lg">
                  {document.description}
                </p>
              </div>
            </Card>

            {/* Historical Context */}
            <Card>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Historical Context</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed">
                  This document represents a significant piece of our historical record, providing insights into 
                  the social, political, and cultural landscape of its time. The preservation and digitization 
                  of such materials ensures that future generations can access and learn from these important 
                  historical artifacts.
                </p>
                <p className="text-slate-700 leading-relaxed mt-4">
                  Documents of this type and era are particularly valuable for researchers studying the period's 
                  governance structures, social movements, and daily life. The metadata and contextual information 
                  provided help scholars understand the document's significance within the broader historical narrative.
                </p>
              </div>
            </Card>

            {/* Tags and Keywords */}
            <Card>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Tags and Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, index) => (
                  <Link 
                    key={index} 
                    to={`/search?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm transition-colors"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Citation Information */}
            <Card>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">How to Cite This Document</h2>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-700 font-mono leading-relaxed">
                  {document.author && `${document.author}. `}
                  "{document.title}." National Archive, {formatDate(document.uploadedAt)}. 
                  Web. {formatDate(new Date().toISOString())}.
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyToClipboard(`${document.author && `${document.author}. `}"${document.title}." National Archive, ${formatDate(document.uploadedAt)}. Web. ${formatDate(new Date().toISOString())}.`)}
                >
                  Copy Citation
                </Button>
              </div>
            </Card>

            {/* Related Documents */}
            {relatedDocuments.length > 0 && (
              <Card>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Related Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedDocuments.map((relatedDoc) => (
                    <Link 
                      key={relatedDoc.id} 
                      to={`/document/${relatedDoc.id}`}
                      className="block p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
                    >
                      {relatedDoc.previewUrl && (
                        <img 
                          src={relatedDoc.previewUrl} 
                          alt={relatedDoc.title}
                          className="w-full h-24 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="font-medium text-slate-900 text-sm line-clamp-2 mb-2">
                        {relatedDoc.title}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {relatedDoc.author && `by ${relatedDoc.author} • `}
                        {formatDate(relatedDoc.date)}
                      </p>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Thumbnail */}
            {document.previewUrl && (
              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Document Preview</h3>
                <div className="relative group cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
                  <img
                    src={document.previewUrl}
                    alt={document.title}
                    className="w-full rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <Eye className="h-6 w-6 text-slate-700" />
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <Zoom className="h-4 w-4 mr-2" />
                  View Full Size
                </Button>
              </Card>
            )}

            {/* Document Metadata */}
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Document Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Document ID</p>
                  <p className="text-sm text-slate-900 font-mono">{document.id}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">File Type</p>
                  <p className="text-sm text-slate-900">{document.fileType}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">File Size</p>
                  <p className="text-sm text-slate-900">{formatFileSize(document.fileSize)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Original Date</p>
                  <p className="text-sm text-slate-900">{formatDate(document.date)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Digitized Date</p>
                  <p className="text-sm text-slate-900">{formatDate(document.uploadedAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Digitized By</p>
                  <p className="text-sm text-slate-900">{document.uploadedBy}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Access Level</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={accessInfo.color as any} size="sm" className="capitalize">
                      <Shield className="h-3 w-3 mr-1" />
                      {document.accessLevel}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{accessInfo.description}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Status</p>
                  <Badge variant="default" size="sm" className="capitalize">
                    {document.status}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Usage Rights */}
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Usage Rights</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Public Domain</p>
                    <p className="text-xs text-slate-600">Free to use for any purpose</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Research Permitted</p>
                    <p className="text-xs text-slate-600">Academic and scholarly use allowed</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Attribution Required</p>
                    <p className="text-xs text-slate-600">Please cite the National Archive</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <p className="text-sm text-slate-600">
                  Have questions about this document or need assistance with your research?
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Contact Research Services
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Visit Reading Room
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={document.title}
        size="xl"
      >
        <div className="space-y-4">
          {/* Preview Controls */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-600 min-w-[60px] text-center">{zoomLevel}%</span>
              <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRotation((rotation + 90) % 360)}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-600">Page {currentPage} of 1</span>
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview Image */}
          <div className="flex justify-center bg-slate-100 p-4 rounded-lg min-h-[400px]">
            {document.previewUrl && (
              <img
                src={document.previewUrl}
                alt={document.title}
                className="max-w-full max-h-[600px] object-contain shadow-lg"
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease'
                }}
              />
            )}
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share Document"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Document URL
            </label>
            <div className="flex">
              <input
                type="text"
                value={`${window.location.origin}/document/${document.id}`}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-l-md bg-slate-50 text-sm"
              />
              <Button
                variant="outline"
                className="rounded-l-none border-l-0"
                onClick={() => copyToClipboard(`${window.location.origin}/document/${document.id}`)}
              >
                Copy
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Citation
            </label>
            <div className="flex">
              <textarea
                value={`${document.author && `${document.author}. `}"${document.title}." National Archive, ${formatDate(document.uploadedAt)}. Web. ${formatDate(new Date().toISOString())}.`}
                readOnly
                rows={3}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-l-md bg-slate-50 text-sm resize-none"
              />
              <Button
                variant="outline"
                className="rounded-l-none border-l-0 self-start"
                onClick={() => copyToClipboard(`${document.author && `${document.author}. `}"${document.title}." National Archive, ${formatDate(document.uploadedAt)}. Web. ${formatDate(new Date().toISOString())}.`)}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};