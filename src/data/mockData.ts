import { Document, User, AuditLog } from '../types';

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Colonial Settlement Records - Boston 1630',
    type: 'manuscript',
    author: 'John Winthrop',
    date: '1630-06-12',
    description: 'Original handwritten records documenting the early settlement of Boston, including population counts, land grants, and governance decisions.',
    tags: ['colonial', 'boston', 'settlement', 'governance'],
    category: 'Historical Records',
    accessLevel: 'public',
    status: 'approved',
    uploadedBy: 'Dr. Sarah Wilson',
    uploadedAt: '2024-01-15',
    fileSize: 2500000,
    fileType: 'PDF',
    previewUrl: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=400',
    versionHistory: []
  },
  {
    id: '2',
    title: 'Civil War Correspondence - General Grant',
    type: 'manuscript',
    author: 'Ulysses S. Grant',
    date: '1863-07-04',
    description: 'Personal correspondence between General Grant and President Lincoln during the Civil War period.',
    tags: ['civil war', 'grant', 'lincoln', 'correspondence'],
    category: 'Military Records',
    accessLevel: 'public',
    status: 'approved',
    uploadedBy: 'Dr. Michael Chen',
    uploadedAt: '2024-01-20',
    fileSize: 1800000,
    fileType: 'PDF',
    previewUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
    versionHistory: []
  },
  {
    id: '3',
    title: 'Industrial Revolution Factory Photos',
    type: 'photograph',
    author: 'Lewis Hine',
    date: '1908-03-15',
    description: 'Documentary photographs of factory conditions during the Industrial Revolution.',
    tags: ['industrial revolution', 'factory', 'labor', 'photography'],
    category: 'Social History',
    accessLevel: 'public',
    status: 'approved',
    uploadedBy: 'Dr. Sarah Wilson',
    uploadedAt: '2024-01-25',
    fileSize: 5200000,
    fileType: 'TIFF',
    previewUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
    versionHistory: []
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@archive.gov',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face',
    createdAt: '2024-01-15',
    isActive: true,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@archive.gov',
    role: 'staff',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face',
    createdAt: '2024-01-20',
    isActive: true,
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'Document Upload',
    user: 'Dr. Sarah Wilson',
    resource: 'Colonial Settlement Records',
    timestamp: '2024-01-15T10:30:00Z',
    details: 'Uploaded new historical document'
  },
  {
    id: '2',
    action: 'User Login',
    user: 'Dr. Michael Chen',
    resource: 'System',
    timestamp: '2024-01-15T09:15:00Z',
    details: 'Successful login from IP 192.168.1.100'
  }
];