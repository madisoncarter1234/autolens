'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ChevronLeftIcon, 
  PhotoIcon, 
  VideoCameraIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

// Mock vehicle data - shared with dashboard
const MOCK_VEHICLES = [
  // Ellis Ford Vehicles
  {
    id: '1',
    stock: 'F10111',
    year: 2025,
    make: 'Ford',
    model: 'Expedition Max',
    trim: 'Platinum',
    styleDescription: 'Platinum 4 Door Advanced 4x4',
    bodyStyle: 'SUV',
    marketClass: '4WD Sport Utility Vehicles',
    modelNumber: 'U625',
    doorCount: 4,
    color: 'Star White Metallic',
    exteriorColorCode: 'Z1',
    exteriorGenericColor: 'White',
    interiorColor: 'Ebony',
    interiorColorCode: 'EB',
    interiorGenericColor: 'Black',
    upholstery: 'Leather',
    price: 86485,
    msrp: 89950,
    photos: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    hasVideo: true,
    videoUrl: '/api/placeholder/video',
    status: 'Ready',
    type: 'New',
    certified: false,
    vin: '1FMJK1JT5REA12345',
    dealership: 'Ellis Ford',
    lot: 'New iLot',
    location: 'Ellis Ford (new)',
    dateInStock: '2024-07-18',
    engineDescription: 'Twin Turbo Premium Unleaded V-6 3.5 L/213',
    engineCylinderCount: 6,
    engineDisplacement: '3.5 L',
    engineBlockType: 'V',
    engineAspirationType: 'Port/Direct Injection',
    fuelType: 'Premium Gasoline',
    fuelCapacity: 28.0,
    transmission: 'Automatic',
    transmissionSpeed: 10,
    transmissionDescription: '10-Speed Automatic',
    drivetrain: '4WD',
    wheelbase: '131.6',
    mpgCity: 17,
    mpgHighway: 23,
    passengerCapacity: 8,
    websiteVdpUrl: 'https://www.ellisford.com/new/Ford/2025-Ford-Expedition-Max-platinum.htm',
    qrCodeUrl: '',
    textCode: '',
    features: ['Adaptive Cruise Control', 'Blind Spot Monitoring', 'Third Row Seating', 'Premium Audio System', 'Navigation System', 'Heated/Cooled Seats', 'Power Liftgate', 'Trailer Tow Package'],
    description: 'The 2025 Ford Expedition Max Platinum offers luxury and capability for families who need space without compromise.',
    lastUpdated: '2024-01-15T10:30:00Z',
    dateAdded: '2024-01-10T14:20:00Z'
  },
  {
    id: '2',
    stock: 'F10411',
    year: 2025,
    make: 'Ford',
    model: 'Bronco Sport',
    trim: 'Big Bend',
    styleDescription: 'Big Bend 4 Door 4x4',
    bodyStyle: 'SUV',
    marketClass: 'Compact Sport Utility Vehicles',
    modelNumber: 'C9G',
    doorCount: 4,
    color: 'Desert Sand',
    exteriorColorCode: 'K4',
    exteriorGenericColor: 'Tan',
    interiorColor: 'Ebony',
    interiorColorCode: 'EB',
    interiorGenericColor: 'Black',
    upholstery: 'Cloth',
    price: 31955,
    msrp: 33500,
    photos: [],
    hasVideo: false,
    videoUrl: '',
    status: 'Needs Photos',
    type: 'New',
    certified: false,
    vin: '3FMCR9B60MRA23456',
    dealership: 'Ellis Ford',
    lot: 'New iLot',
    location: 'Ellis Ford (new)',
    dateInStock: '2024-08-01',
    engineDescription: 'Regular Unleaded I-3 1.5 L/91',
    engineCylinderCount: 3,
    engineDisplacement: '1.5 L',
    engineBlockType: 'I',
    engineAspirationType: 'Turbo',
    fuelType: 'Regular Gasoline',
    fuelCapacity: 16.0,
    transmission: 'Automatic',
    transmissionSpeed: 8,
    transmissionDescription: '8-Speed Automatic',
    drivetrain: '4WD',
    wheelbase: '105.1',
    mpgCity: 21,
    mpgHighway: 26,
    passengerCapacity: 5,
    websiteVdpUrl: 'https://www.ellisford.com/new/Ford/2025-Ford-Bronco-Sport-big-bend.htm',
    qrCodeUrl: '',
    textCode: '',
    features: ['Terrain Management System', 'Skid Plates', 'Hill Descent Control', 'Rear View Camera', 'Ford Co-Pilot360', 'SYNC 3 Infotainment'],
    description: 'Built for adventure, the 2025 Ford Bronco Sport Big Bend brings capability and style to everyday driving.',
    lastUpdated: '2024-08-01T14:30:00Z',
    dateAdded: '2024-08-01T09:15:00Z'
  },
  {
    id: '3',
    stock: 'F10412',
    year: 2025,
    make: 'Ford',
    model: 'Bronco',
    trim: 'Badlands',
    styleDescription: 'Badlands 4 Door Advanced 4x4',
    bodyStyle: 'Convertible',
    marketClass: '4WD Sport Utility Vehicles',
    modelNumber: 'E9B',
    doorCount: 4,
    color: 'Shadow Black',
    exteriorColorCode: 'UM',
    exteriorGenericColor: 'Black',
    interiorColor: 'Black Onyx',
    interiorColorCode: '1V',
    interiorGenericColor: 'Black',
    upholstery: 'Cloth',
    price: 58585,
    msrp: 61450,
    photos: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    hasVideo: true,
    videoUrl: '/api/placeholder/video',
    status: 'Ready',
    type: 'New',
    certified: false,
    vin: '1FMEE5EP6LLA45678',
    dealership: 'Ellis Ford',
    lot: 'New iLot',
    location: 'Ellis Ford (new)',
    dateInStock: '2024-07-18',
    engineDescription: 'Twin Turbo Regular Unleaded V-6 2.7 L/164',
    engineCylinderCount: 6,
    engineDisplacement: '2.7 L',
    engineBlockType: 'V',
    engineAspirationType: 'Port/Direct Injection',
    fuelType: 'Regular Gasoline',
    fuelCapacity: 20.8,
    transmission: 'Automatic',
    transmissionSpeed: 10,
    transmissionDescription: '10-Speed Automatic',
    drivetrain: '4WD',
    wheelbase: '116.1',
    mpgCity: 16,
    mpgHighway: 17,
    passengerCapacity: 5,
    websiteVdpUrl: 'https://www.ellisford.com/new/Ford/2025-Ford-Bronco-badlands.htm',
    qrCodeUrl: '',
    textCode: '',
    features: ['Advanced 4x4 System', 'Removable Roof Panels', 'Rock Crawl Mode', 'Trail Control', 'Bash Plates', 'Heavy-Duty Bash Plate Package', 'LED Lighting Package', 'Sasquatch Package Available'],
    description: 'Built wild. The 2025 Ford Bronco Badlands delivers legendary off-road capability with modern technology and comfort.',
    lastUpdated: '2024-01-15T10:30:00Z',
    dateAdded: '2024-01-10T14:20:00Z'
  },
  // Add a few more vehicles to make the detail page work for different IDs
  {
    id: '4',
    stock: 'U2024-F01',
    year: 2022,
    make: 'Ford',
    model: 'F-150',
    trim: 'XLT',
    styleDescription: 'XLT SuperCrew Cab 4x4',
    bodyStyle: 'Truck',
    marketClass: 'Full Size Pickup',
    modelNumber: 'F1C',
    doorCount: 4,
    color: 'Race Red',
    exteriorColorCode: 'PQ',
    exteriorGenericColor: 'Red',
    interiorColor: 'Black',
    interiorColorCode: 'FB',
    interiorGenericColor: 'Black',
    upholstery: 'Cloth',
    price: 42500,
    msrp: 45000,
    photos: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    hasVideo: false,
    videoUrl: '',
    status: 'Ready',
    type: 'Used',
    certified: true,
    vin: '1FTEW1EP9NFA67890',
    dealership: 'Ellis Ford',
    lot: 'Used iLot',
    location: 'Ellis Ford (used)',
    dateInStock: '2024-06-15',
    engineDescription: 'Regular Unleaded V-8 5.0 L/302',
    engineCylinderCount: 8,
    engineDisplacement: '5.0 L',
    engineBlockType: 'V',
    engineAspirationType: 'Natural',
    fuelType: 'Regular Gasoline',
    fuelCapacity: 26.0,
    transmission: 'Automatic',
    transmissionSpeed: 10,
    transmissionDescription: '10-Speed Automatic',
    drivetrain: '4WD',
    wheelbase: '145.4',
    mpgCity: 17,
    mpgHighway: 24,
    passengerCapacity: 5,
    websiteVdpUrl: 'https://www.ellisford.com/used/Ford/2022-Ford-F-150-xlt.htm',
    qrCodeUrl: '',
    textCode: '',
    features: ['Tow Package', 'Bed Liner', 'Power Windows', 'Cruise Control', 'Bluetooth', 'Backup Camera', 'Ford Co-Pilot360'],
    description: 'This certified pre-owned 2022 Ford F-150 XLT offers proven capability with modern convenience features.',
    lastUpdated: '2024-06-15T11:30:00Z',
    dateAdded: '2024-06-15T09:00:00Z'
  }
];

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState('synced'); // synced, pending, error
  const [showSyncConfig, setShowSyncConfig] = useState(false);
  const [syncConfig, setSyncConfig] = useState({
    syncPricing: true,
    syncPhotos: true,
    syncVideos: true,
    syncDescription: true,
    syncFeatures: true,
    syncSpecs: true,
    syncStatus: true,
    syncColors: true,
    syncEngine: true,
    syncUrls: true
  });

  useEffect(() => {
    const userData = localStorage.getItem('autolens-user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Find vehicle by ID - in real app this would be an API call
    const vehicleData = MOCK_VEHICLES.find(v => v.id === params.id);
    if (vehicleData) {
      setVehicle(vehicleData);
      setEditedVehicle(vehicleData);
    } else {
      // Vehicle not found, redirect to dashboard
      router.push('/dashboard');
    }
  }, [params.id, router]);

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit - reset to original
      setEditedVehicle(vehicle);
    }
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setLastSyncStatus('pending');
    
    try {
      // In real app, this would call API to update vehicle and sync to vAuto
      console.log('Saving vehicle data:', editedVehicle);
      console.log('Sync configuration:', syncConfig);
      
      // Show which fields will be synced
      const enabledSyncs = Object.entries(syncConfig)
        .filter(([, enabled]) => enabled)
        .map(([field]) => field.replace('sync', ''))
        .join(', ');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setVehicle(editedVehicle);
      setIsEditMode(false);
      setLastSyncStatus('synced');
      
      alert(`Vehicle updated successfully!\n\nSynced to vAuto: ${enabledSyncs || 'None'}`);
    } catch (error) {
      console.error('Save error:', error);
      setLastSyncStatus('error');
      alert('Error saving vehicle data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedVehicle({
      ...editedVehicle,
      [field]: value
    });
    setLastSyncStatus('pending');
  };

  // Helper component for editable fields
  const EditableField = ({ label, field, value, type = 'text', options = null }: {
    label: string;
    field: string;
    value: any;
    type?: string;
    options?: { value: string; label: string }[] | null;
  }) => (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      {isEditMode ? (
        options ? (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => handleInputChange(field, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
            className="font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 text-sm text-right"
          />
        )
      ) : (
        <span className="font-medium text-gray-900">
          {type === 'number' && field.includes('price') ? `$${value?.toLocaleString()}` : value}
        </span>
      )}
    </div>
  );

  // Helper component for editable textarea fields
  const EditableTextArea = ({ label, field, value }: {
    label: string;
    field: string;
    value: any;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}:</label>
      {isEditMode ? (
        <textarea
          value={value || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      ) : (
        <p className="text-gray-900 leading-relaxed">{value}</p>
      )}
    </div>
  );

  // Helper component for editable feature list
  const EditableFeatures = () => {
    const currentFeatures = isEditMode ? editedVehicle.features : vehicle.features;
    
    const addFeature = () => {
      const newFeatures = [...currentFeatures, ''];
      handleInputChange('features', newFeatures);
    };

    const removeFeature = (index: number) => {
      const newFeatures = currentFeatures.filter((_: any, i: number) => i !== index);
      handleInputChange('features', newFeatures);
    };

    const updateFeature = (index: number, value: string) => {
      const newFeatures = [...currentFeatures];
      newFeatures[index] = value;
      handleInputChange('features', newFeatures);
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700">Features & Options:</h3>
          {isEditMode && (
            <button
              onClick={addFeature}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Add Feature
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentFeatures.map((feature: string, index: number) => (
            <div key={index} className="flex items-center">
              {isEditMode ? (
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm mr-2"
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-800">{feature}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!user || !vehicle) return null;

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === vehicle.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? vehicle.photos.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                Back to Inventory
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-sm text-gray-600">Stock #{vehicle.stock} • {vehicle.vin}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Sync Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  lastSyncStatus === 'synced' ? 'bg-green-500' : 
                  lastSyncStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {lastSyncStatus === 'synced' ? 'Synced with vAuto' :
                   lastSyncStatus === 'pending' ? 'Pending sync' : 'Sync error'}
                </span>
              </div>

              {/* vAuto Sync Config */}
              <button
                onClick={() => setShowSyncConfig(!showSyncConfig)}
                className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-sm"
              >
                vAuto Config
              </button>

              {!isEditMode ? (
                <>
                  <button 
                    onClick={handleEditToggle}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Vehicle
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Preview
                  </button>
                  <button className="flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 rounded-md"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      'Save & Sync'
                    )}
                  </button>
                  <button 
                    onClick={handleEditToggle}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* vAuto Sync Configuration Panel */}
      {showSyncConfig && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-blue-900">vAuto Sync Configuration</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-700">Applies to: {user?.role === 'OWNER' ? 'All Rooftops' : 'This Rooftop'}</span>
                <button
                  onClick={() => setShowSyncConfig(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncConfig.syncPricing}
                  onChange={(e) => setSyncConfig({...syncConfig, syncPricing: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-blue-900">Pricing</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncConfig.syncPhotos}
                  onChange={(e) => setSyncConfig({...syncConfig, syncPhotos: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-blue-900">Photos</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncConfig.syncVideos}
                  onChange={(e) => setSyncConfig({...syncConfig, syncVideos: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-blue-900">Videos</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncConfig.syncDescription}
                  onChange={(e) => setSyncConfig({...syncConfig, syncDescription: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-blue-900">Description</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncConfig.syncFeatures}
                  onChange={(e) => setSyncConfig({...syncConfig, syncFeatures: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-blue-900">Features</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncConfig.syncSpecs}
                  onChange={(e) => setSyncConfig({...syncConfig, syncSpecs: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-blue-900">Specifications</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncConfig.syncStatus}
                  onChange={(e) => setSyncConfig({...syncConfig, syncStatus: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-blue-900">Status</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncConfig.syncColors}
                  onChange={(e) => setSyncConfig({...syncConfig, syncColors: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-blue-900">Colors</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncConfig.syncEngine}
                  onChange={(e) => setSyncConfig({...syncConfig, syncEngine: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-blue-900">Engine</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncConfig.syncUrls}
                  onChange={(e) => setSyncConfig({...syncConfig, syncUrls: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-blue-900">URLs</span>
              </label>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSyncConfig(Object.keys(syncConfig).reduce((acc, key) => ({...acc, [key]: true}), {}))}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Enable All
                </button>
                <button
                  onClick={() => setSyncConfig(Object.keys(syncConfig).reduce((acc, key) => ({...acc, [key]: false}), {}))}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Disable All
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => {
                    console.log('Saving sync config:', syncConfig);
                    alert('vAuto sync configuration saved!');
                    setShowSyncConfig(false);
                  }}
                >
                  Save Config
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Media Gallery</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <PhotoIcon className="w-4 h-4" />
                    <span>{vehicle.photos.length} Photos</span>
                    {vehicle.hasVideo && (
                      <>
                        <VideoCameraIcon className="w-4 h-4 ml-2" />
                        <span>Video Available</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Main Image */}
                <div className="mb-4">
                  <div 
                    className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => openLightbox(selectedImageIndex)}
                  >
                    <img 
                      src={vehicle.photos[selectedImageIndex]} 
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      {selectedImageIndex + 1} / {vehicle.photos.length}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                      <ArrowsPointingOutIcon className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-6 gap-2">
                  {vehicle.photos.map((photo: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square bg-gray-100 rounded overflow-hidden border-2 ${
                        index === selectedImageIndex ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={photo} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* General Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  General Information
                  {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editable - syncs to vAuto)</span>}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <EditableField
                      label="Type"
                      field="type"
                      value={isEditMode ? editedVehicle.type : vehicle.type}
                      options={[
                        { value: 'New', label: 'New' },
                        { value: 'Used', label: 'Used' }
                      ]}
                    />
                    <EditableField
                      label="Year"
                      field="year"
                      value={isEditMode ? editedVehicle.year : vehicle.year}
                      type="number"
                    />
                    <EditableField
                      label="Make"
                      field="make"
                      value={isEditMode ? editedVehicle.make : vehicle.make}
                    />
                    <EditableField
                      label="Model"
                      field="model"
                      value={isEditMode ? editedVehicle.model : vehicle.model}
                    />
                    <EditableField
                      label="Market Class"
                      field="marketClass"
                      value={isEditMode ? editedVehicle.marketClass : vehicle.marketClass}
                    />
                    <EditableField
                      label="Model Number"
                      field="modelNumber"
                      value={isEditMode ? editedVehicle.modelNumber : vehicle.modelNumber}
                    />
                  </div>

                  <div className="space-y-3">
                    <EditableField
                      label="Trim"
                      field="trim"
                      value={isEditMode ? editedVehicle.trim : vehicle.trim}
                    />
                    <EditableField
                      label="Style Description"
                      field="styleDescription"
                      value={isEditMode ? editedVehicle.styleDescription : vehicle.styleDescription}
                    />
                    <EditableField
                      label="Body Style"
                      field="bodyStyle"
                      value={isEditMode ? editedVehicle.bodyStyle : vehicle.bodyStyle}
                    />
                    <EditableField
                      label="Door Count"
                      field="doorCount"
                      value={isEditMode ? editedVehicle.doorCount : vehicle.doorCount}
                      type="number"
                    />
                    <EditableField
                      label="VIN"
                      field="vin"
                      value={isEditMode ? editedVehicle.vin : vehicle.vin}
                    />
                    <EditableField
                      label="Date in Stock"
                      field="dateInStock"
                      value={isEditMode ? editedVehicle.dateInStock : vehicle.dateInStock}
                      type="date"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Color Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Color Information
                  {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editable - syncs to vAuto)</span>}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <EditableField
                      label="Exterior Color"
                      field="color"
                      value={isEditMode ? editedVehicle.color : vehicle.color}
                    />
                    <EditableField
                      label="Exterior Color Code"
                      field="exteriorColorCode"
                      value={isEditMode ? editedVehicle.exteriorColorCode : vehicle.exteriorColorCode}
                    />
                    <EditableField
                      label="Generic Color"
                      field="exteriorGenericColor"
                      value={isEditMode ? editedVehicle.exteriorGenericColor : vehicle.exteriorGenericColor}
                    />
                  </div>

                  <div className="space-y-3">
                    <EditableField
                      label="Interior Color"
                      field="interiorColor"
                      value={isEditMode ? editedVehicle.interiorColor : vehicle.interiorColor}
                    />
                    <EditableField
                      label="Interior Color Code"
                      field="interiorColorCode"
                      value={isEditMode ? editedVehicle.interiorColorCode : vehicle.interiorColorCode}
                    />
                    <EditableField
                      label="Upholstery"
                      field="upholstery"
                      value={isEditMode ? editedVehicle.upholstery : vehicle.upholstery}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Engine Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Engine
                  {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editable - syncs to vAuto)</span>}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <EditableField
                      label="Engine Description"
                      field="engineDescription"
                      value={isEditMode ? editedVehicle.engineDescription : vehicle.engineDescription}
                    />
                    <EditableField
                      label="Cylinder Count"
                      field="engineCylinderCount"
                      value={isEditMode ? editedVehicle.engineCylinderCount : vehicle.engineCylinderCount}
                      type="number"
                    />
                    <EditableField
                      label="Displacement"
                      field="engineDisplacement"
                      value={isEditMode ? editedVehicle.engineDisplacement : vehicle.engineDisplacement}
                    />
                  </div>

                  <div className="space-y-3">
                    <EditableField
                      label="Block Type"
                      field="engineBlockType"
                      value={isEditMode ? editedVehicle.engineBlockType : vehicle.engineBlockType}
                    />
                    <EditableField
                      label="Fuel Type"
                      field="fuelType"
                      value={isEditMode ? editedVehicle.fuelType : vehicle.fuelType}
                    />
                    <EditableField
                      label="Fuel Capacity"
                      field="fuelCapacity"
                      value={isEditMode ? editedVehicle.fuelCapacity : vehicle.fuelCapacity}
                      type="number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mechanical */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Mechanical
                  {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editable - syncs to vAuto)</span>}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <EditableField
                      label="Transmission"
                      field="transmissionDescription"
                      value={isEditMode ? editedVehicle.transmissionDescription : vehicle.transmissionDescription}
                    />
                    <EditableField
                      label="Drive Type"
                      field="drivetrain"
                      value={isEditMode ? editedVehicle.drivetrain : vehicle.drivetrain}
                      options={[
                        { value: '2WD', label: '2WD' },
                        { value: '4WD', label: '4WD' },
                        { value: 'AWD', label: 'AWD' },
                        { value: 'FWD', label: 'FWD' },
                        { value: 'RWD', label: 'RWD' }
                      ]}
                    />
                  </div>

                  <div className="space-y-3">
                    <EditableField
                      label="City MPG"
                      field="mpgCity"
                      value={isEditMode ? editedVehicle.mpgCity : vehicle.mpgCity}
                      type="number"
                    />
                    <EditableField
                      label="Highway MPG"
                      field="mpgHighway"
                      value={isEditMode ? editedVehicle.mpgHighway : vehicle.mpgHighway}
                      type="number"
                    />
                    <EditableField
                      label="Wheelbase"
                      field="wheelbase"
                      value={isEditMode ? editedVehicle.wheelbase : vehicle.wheelbase}
                    />
                    <EditableField
                      label="Passenger Capacity"
                      field="passengerCapacity"
                      value={isEditMode ? editedVehicle.passengerCapacity : vehicle.passengerCapacity}
                      type="number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Features & Options
                  {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editable - syncs to vAuto)</span>}
                </h2>
                <EditableFeatures />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Description
                  {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editable - syncs to vAuto)</span>}
                </h2>
                <EditableTextArea
                  label="Vehicle Description"
                  field="description"
                  value={isEditMode ? editedVehicle.description : vehicle.description}
                />
              </div>
            </div>

            {/* Marketing & URLs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Marketing & URLs
                  {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editable - syncs to vAuto)</span>}
                </h2>
                <div className="space-y-3">
                  <EditableField
                    label="Website VDP URL"
                    field="websiteVdpUrl"
                    value={isEditMode ? editedVehicle.websiteVdpUrl : vehicle.websiteVdpUrl}
                  />
                  <EditableField
                    label="QR Code URL"
                    field="qrCodeUrl"
                    value={isEditMode ? editedVehicle.qrCodeUrl : vehicle.qrCodeUrl}
                  />
                  <EditableField
                    label="Text Code"
                    field="textCode"
                    value={isEditMode ? editedVehicle.textCode : vehicle.textCode}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Pricing 
                  {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editable - syncs to vAuto)</span>}
                </h2>
                <div className="space-y-3">
                  <EditableField
                    label="Selling Price"
                    field="price"
                    value={isEditMode ? editedVehicle.price : vehicle.price}
                    type="number"
                  />
                  <EditableField
                    label="MSRP"
                    field="msrp"
                    value={isEditMode ? editedVehicle.msrp : vehicle.msrp}
                    type="number"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Status
                  {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editable - syncs to vAuto)</span>}
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Type:</span>
                    {isEditMode ? (
                      <select
                        value={editedVehicle.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded"
                      >
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        vehicle.type === 'New' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {vehicle.type}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Certified:</span>
                    {isEditMode ? (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editedVehicle.certified || false}
                          onChange={(e) => handleInputChange('certified', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-xs">CPO Certified</span>
                      </label>
                    ) : (
                      vehicle.certified ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          CPO
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">Not Certified</span>
                      )
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Photo Status:</span>
                    {isEditMode ? (
                      <select
                        value={editedVehicle.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Ready">Ready</option>
                        <option value="Needs Photos">Needs Photos</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        vehicle.status === 'Ready'
                          ? 'bg-green-100 text-green-800'
                          : vehicle.status === 'Needs Photos'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    )}
                  </div>
                  <EditableField
                    label="Stock Number"
                    field="stock"
                    value={isEditMode ? editedVehicle.stock : vehicle.stock}
                  />
                  <EditableField
                    label="Location"
                    field="location"
                    value={isEditMode ? editedVehicle.location : vehicle.location}
                  />
                </div>
              </div>
            </div>

            {/* Window Sticker */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Window Sticker</h2>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">COC WS Template</p>
                      <p className="text-xs text-gray-500">Last Generated: Never</p>
                    </div>
                  </div>
                  <div className="flex justify-between space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium">
                      Publish
                    </button>
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md text-sm font-medium">
                      Batch
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Buyers Guide */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Buyer's Guide</h2>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">FTC Buyer's Guide</p>
                      <p className="text-xs text-gray-500">Last Generated: Never</p>
                    </div>
                  </div>
                  <div className="flex justify-between space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium">
                      Publish
                    </button>
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md text-sm font-medium">
                      Batch
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Added:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(vehicle.dateAdded).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(vehicle.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeftIcon className="w-8 h-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <img
              src={vehicle.photos[selectedImageIndex]}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImageIndex + 1} of {vehicle.photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}