'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DocumentTextIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

// Mock sticker templates data
const MOCK_STICKER_TEMPLATES = [
  {
    id: '1',
    name: 'COC WS',
    type: 'window_sticker',
    description: 'Standard Cox Automotive Window Sticker',
    vehiclesBatched: 0,
    totalPublished: 2764,
    lastPublished: '2025-08-26',
    dateModified: '2019-01-09',
    modifiedBy: 'aaClay Schwartz',
    dateCreated: '2019-01-09',
    createdBy: 'aaClay Schwartz'
  },
  {
    id: '2',
    name: 'COC Certified WS',
    type: 'window_sticker',
    description: 'Certified Pre-Owned Window Sticker',
    vehiclesBatched: 0,
    totalPublished: 52,
    lastPublished: '2025-07-07',
    dateModified: '2019-11-21',
    modifiedBy: 'aaClay Schwartz',
    dateCreated: '2019-11-21',
    createdBy: 'aaClay Schwartz'
  },
  {
    id: '3',
    name: 'FTC Buyers Guide - Standard',
    type: 'buyers_guide',
    description: 'Federal Trade Commission Buyers Guide',
    vehiclesBatched: 0,
    totalPublished: 1532,
    lastPublished: '2025-08-25',
    dateModified: '2019-01-09',
    modifiedBy: 'aaClay Schwartz',
    dateCreated: '2019-01-09',
    createdBy: 'aaClay Schwartz'
  },
  {
    id: '4',
    name: 'FTC Buyers Guide - As Is',
    type: 'buyers_guide',
    description: 'Federal Trade Commission Buyers Guide - As Is / No Warranty',
    vehiclesBatched: 0,
    totalPublished: 245,
    lastPublished: '2025-08-24',
    dateModified: '2019-01-09',
    modifiedBy: 'aaClay Schwartz',
    dateCreated: '2019-01-09',
    createdBy: 'aaClay Schwartz'
  }
];

export default function StickersPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'window_stickers' | 'buyers_guides'>('window_stickers');
  const [stickerTemplates, setStickerTemplates] = useState(MOCK_STICKER_TEMPLATES);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('autolens-user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('autolens-user');
    router.push('/login');
  };

  const handleCreateNew = () => {
    router.push('/stickers/create');
  };

  const handleEditSticker = (id: string) => {
    router.push(`/stickers/edit/${id}`);
  };

  const filteredTemplates = stickerTemplates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = activeTab === 'window_stickers' 
      ? template.type === 'window_sticker'
      : template.type === 'buyers_guide';
    
    return matchesSearch && matchesType;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">AL</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">AutoLens</h1>
                  <p className="text-sm text-gray-600">Sticker Management</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <nav className="flex space-x-1">
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm"
                  >
                    Inventory
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded text-sm">
                    Stickers
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">
                    Reports
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">
                    Settings
                  </button>
                </nav>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user.name}</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Stickers Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">
              Use this page to Edit existing Window Stickers and Buyer's Guides, or Create New ones.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b mb-6">
            <button
              onClick={() => setActiveTab('window_stickers')}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === 'window_stickers'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Window Stickers
            </button>
            <button
              onClick={() => setActiveTab('buyers_guides')}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === 'buyers_guides'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Buyer's Guides
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {filteredTemplates.length} of {filteredTemplates.length} Stickers Displayed
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create New {activeTab === 'window_stickers' ? 'Window Sticker' : "Buyer's Guide"}
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900"># Vehicles<br />Batched</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Total PDFs<br />Published</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Last<br />Published</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Date<br />Modified</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Modified By</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Date<br />Created</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Created By</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          <button onClick={() => handleEditSticker(template.id)}>
                            {template.name}
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">
                      {template.vehiclesBatched}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-blue-600">
                        {template.totalPublished.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">
                      {template.lastPublished}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">
                      {template.dateModified}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">
                      {template.modifiedBy}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">
                      {template.dateCreated}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">
                      {template.createdBy}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleEditSticker(template.id)}
                        className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-sm mx-auto"
                      >
                        <PencilIcon className="w-3 h-3 mr-1" />
                        Edit Sticker
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}