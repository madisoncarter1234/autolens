'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

// Sticker template designs
const TEMPLATE_DESIGNS = [
  { id: 'blank', name: 'Blank Sticker', icon: '📄', description: 'Start from scratch' },
  { id: 'kbb', name: 'KBB® Sticker', icon: '🏆', description: 'Kelley Blue Book template' },
  { id: '3box', name: '3-Box', icon: '📊', description: 'Three section layout' },
  { id: 'rightbox', name: 'Right Box', icon: '📋', description: 'Information on right side' },
  { id: 'centered', name: 'Centered Box', icon: '📑', description: 'Centered content layout' },
  { id: 'letter', name: 'Existing Letter Portrait', icon: '📜', description: 'Traditional letter format' }
];

export default function CreateStickerPage() {
  const [user, setUser] = useState<any>(null);
  const [stickerType, setStickerType] = useState<'window_sticker' | 'buyers_guide'>('window_sticker');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    printerInstructions: '',
    orientation: 'portrait',
    pageSize: 'letter',
    selectedDesign: 'blank'
  });
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

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    // Here we would save the sticker template
    console.log('Saving sticker template:', {
      type: stickerType,
      ...formData
    });
    
    // Redirect to editor (in real app, would pass the template ID)
    router.push('/stickers/editor/new');
  };

  const handleCancel = () => {
    router.push('/stickers');
  };

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
                  <p className="text-sm text-gray-600">Create New Sticker</p>
                </div>
              </div>
              
              <nav className="flex space-x-1">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm"
                >
                  Inventory
                </button>
                <button 
                  onClick={() => router.push('/stickers')}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded text-sm"
                >
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
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/stickers')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Stickers
        </button>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-900">Create New Sticker</h2>
          </div>

          <div className="p-6 space-y-8">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                {/* Sticker Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sticker Type:
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="window_sticker"
                        checked={stickerType === 'window_sticker'}
                        onChange={(e) => setStickerType(e.target.value as 'window_sticker')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-900">Window Sticker</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="buyers_guide"
                        checked={stickerType === 'buyers_guide'}
                        onChange={(e) => setStickerType(e.target.value as 'buyers_guide')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-900">Buyer's Guide</span>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name:
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter sticker template name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description:
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of this template"
                  />
                </div>

                {/* Printer Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Printer Instructions:
                  </label>
                  <textarea
                    value={formData.printerInstructions}
                    onChange={(e) => handleInputChange('printerInstructions', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional instructions for printing"
                  />
                </div>

                {/* Orientation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orientation:
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="portrait"
                        checked={formData.orientation === 'portrait'}
                        onChange={(e) => handleInputChange('orientation', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-900">Portrait</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="landscape"
                        checked={formData.orientation === 'landscape'}
                        onChange={(e) => handleInputChange('orientation', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-900">Landscape</span>
                    </label>
                  </div>
                </div>

                {/* Page Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Size:
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="letter"
                        checked={formData.pageSize === 'letter'}
                        onChange={(e) => handleInputChange('pageSize', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-900">Letter (8.5x11)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="legal"
                        checked={formData.pageSize === 'legal'}
                        onChange={(e) => handleInputChange('pageSize', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-900">Legal (8.5x14)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Design Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select An Initial Design</h3>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {TEMPLATE_DESIGNS.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => handleInputChange('selectedDesign', design.id)}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      formData.selectedDesign === design.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-4xl">{design.icon}</div>
                      <span className="text-xs font-medium text-gray-900">{design.name}</span>
                    </div>
                    {formData.selectedDesign === design.id && (
                      <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm"
              disabled={!formData.name}
            >
              Save and Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}