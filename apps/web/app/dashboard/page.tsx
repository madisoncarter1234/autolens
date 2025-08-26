'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  VideoCameraIcon,
  ArrowRightOnRectangleIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

// Mock dealer group structure with realistic test data
const MOCK_DEALER_GROUPS = [
  {
    id: 'ellis-auto-group',
    name: 'Ellis Auto Group',
    dealerships: [
      {
        id: 'ellis-ford',
        name: 'Ellis Ford',
        brand: 'Ford',
        lots: [
          { id: 'ford-new', name: 'New iLot', type: 'NEW' },
          { id: 'ford-used', name: 'Used iLot', type: 'USED' },
          { id: 'ford-service', name: 'Service Lot', type: 'SERVICE' }
        ]
      },
      {
        id: 'ellis-chevrolet',
        name: 'Ellis Chevrolet',
        brand: 'Chevrolet',
        lots: [
          { id: 'chevy-new', name: 'New iLot', type: 'NEW' },
          { id: 'chevy-used', name: 'Used iLot', type: 'USED' },
          { id: 'chevy-cpo', name: 'CPO iLot', type: 'USED' }
        ]
      },
      {
        id: 'ellis-toyota',
        name: 'Ellis Toyota',
        brand: 'Toyota',
        lots: [
          { id: 'toyota-new', name: 'New iLot', type: 'NEW' },
          { id: 'toyota-used', name: 'Used iLot', type: 'USED' }
        ]
      }
    ]
  },
  {
    id: 'summit-auto-group',
    name: 'Summit Auto Group',
    dealerships: [
      {
        id: 'summit-honda',
        name: 'Summit Honda',
        brand: 'Honda',
        lots: [
          { id: 'honda-new', name: 'New iLot', type: 'NEW' },
          { id: 'honda-used', name: 'Used iLot', type: 'USED' }
        ]
      },
      {
        id: 'summit-nissan',
        name: 'Summit Nissan',
        brand: 'Nissan',
        lots: [
          { id: 'nissan-new', name: 'New iLot', type: 'NEW' },
          { id: 'nissan-used', name: 'Used iLot', type: 'USED' },
          { id: 'nissan-auction', name: 'Auction Lot', type: 'AUCTION' }
        ]
      }
    ]
  }
];

const MOCK_VEHICLES = [
  // Ellis Ford Vehicles
  {
    id: '1',
    stock: 'F10111',
    year: 2025,
    make: 'Ford',
    model: 'Expedition Max',
    trim: 'Platinum',
    color: 'Star White Metallic',
    price: 86485,
    photos: 12,
    hasVideo: true,
    status: 'Ready',
    type: 'New',
    certified: false,
    vin: '1FMJK1JT5REA12345',
    dealership: 'Ellis Ford',
    dealershipId: 'ellis-ford',
    lot: 'New iLot',
    lotId: 'ford-new',
    groupId: 'ellis-auto-group'
  },
  {
    id: '2',
    stock: 'F10411',
    year: 2025,
    make: 'Ford',
    model: 'Bronco Sport',
    trim: 'Big Bend',
    color: 'Desert Sand',
    price: 31955,
    photos: 0,
    hasVideo: false,
    status: 'Needs Photos',
    type: 'New',
    certified: false,
    vin: '3FMCR9B60MRA23456',
    dealership: 'Ellis Ford',
    dealershipId: 'ellis-ford',
    lot: 'New iLot',
    lotId: 'ford-new',
    groupId: 'ellis-auto-group'
  },
  {
    id: '3',
    stock: 'F10412',
    year: 2025,
    make: 'Ford',
    model: 'Bronco',
    trim: 'Badlands',
    color: 'Shadow Black',
    price: 58585,
    photos: 15,
    hasVideo: true,
    status: 'Ready',
    type: 'New',
    certified: false,
    vin: '1FMEE5EP6LLA45678',
    dealership: 'Ellis Ford',
    dealershipId: 'ellis-ford',
    lot: 'New iLot',
    lotId: 'ford-new',
    groupId: 'ellis-auto-group'
  },
  {
    id: '4',
    stock: 'U2024-F01',
    year: 2022,
    make: 'Ford',
    model: 'F-150',
    trim: 'XLT',
    color: 'Race Red',
    price: 42500,
    photos: 8,
    hasVideo: false,
    status: 'Ready',
    type: 'Used',
    certified: true,
    vin: '1FTEW1EP9NFA67890',
    dealership: 'Ellis Ford',
    dealershipId: 'ellis-ford',
    lot: 'Used iLot',
    lotId: 'ford-used',
    groupId: 'ellis-auto-group'
  },
  // Ellis Chevrolet Vehicles
  {
    id: '5',
    stock: 'C25001',
    year: 2025,
    make: 'Chevrolet',
    model: 'Silverado 1500',
    trim: 'LT',
    color: 'Summit White',
    price: 52485,
    photos: 6,
    hasVideo: true,
    status: 'Ready',
    type: 'New',
    certified: false,
    vin: '1GCRYEED8PZ123456',
    dealership: 'Ellis Chevrolet',
    dealershipId: 'ellis-chevrolet',
    lot: 'New iLot',
    lotId: 'chevy-new',
    groupId: 'ellis-auto-group'
  },
  {
    id: '6',
    stock: 'C24102',
    year: 2024,
    make: 'Chevrolet',
    model: 'Equinox',
    trim: 'Premier',
    color: 'Mosaic Black',
    price: 31750,
    photos: 0,
    hasVideo: false,
    status: 'In Progress',
    type: 'New',
    certified: false,
    vin: '2GNAXUEV8P6234567',
    dealership: 'Ellis Chevrolet',
    dealershipId: 'ellis-chevrolet',
    lot: 'New iLot',
    lotId: 'chevy-new',
    groupId: 'ellis-auto-group'
  },
  {
    id: '7',
    stock: 'U2023-C01',
    year: 2021,
    make: 'Chevrolet',
    model: 'Tahoe',
    trim: 'LS',
    color: 'Black',
    price: 58900,
    photos: 11,
    hasVideo: true,
    status: 'Ready',
    type: 'Used',
    certified: true,
    vin: '1GNSKCKC8MR345678',
    dealership: 'Ellis Chevrolet',
    dealershipId: 'ellis-chevrolet',
    lot: 'CPO iLot',
    lotId: 'chevy-cpo',
    groupId: 'ellis-auto-group'
  },
  // Ellis Toyota Vehicles
  {
    id: '8',
    stock: 'T25001',
    year: 2025,
    make: 'Toyota',
    model: 'Camry',
    trim: 'XLE',
    color: 'Blueprint',
    price: 29850,
    photos: 9,
    hasVideo: false,
    status: 'Ready',
    type: 'New',
    certified: false,
    vin: '4T1C11AK4PU456789',
    dealership: 'Ellis Toyota',
    dealershipId: 'ellis-toyota',
    lot: 'New iLot',
    lotId: 'toyota-new',
    groupId: 'ellis-auto-group'
  },
  {
    id: '9',
    stock: 'T24203',
    year: 2024,
    make: 'Toyota',
    model: 'RAV4',
    trim: 'XLE Hybrid',
    color: 'Magnetic Gray',
    price: 34560,
    photos: 0,
    hasVideo: false,
    status: 'Needs Photos',
    type: 'New',
    certified: false,
    vin: '2T3F1RFV8PC567890',
    dealership: 'Ellis Toyota',
    dealershipId: 'ellis-toyota',
    lot: 'New iLot',
    lotId: 'toyota-new',
    groupId: 'ellis-auto-group'
  },
  {
    id: '10',
    stock: 'U2023-T02',
    year: 2022,
    make: 'Toyota',
    model: 'Highlander',
    trim: 'Limited',
    color: 'Midnight Black',
    price: 42750,
    photos: 7,
    hasVideo: false,
    status: 'Ready',
    type: 'Used',
    certified: true,
    vin: '5TDBZRFH0NS678901',
    dealership: 'Ellis Toyota',
    dealershipId: 'ellis-toyota',
    lot: 'Used iLot',
    lotId: 'toyota-used',
    groupId: 'ellis-auto-group'
  },
  // Summit Honda Vehicles
  {
    id: '11',
    stock: 'H25001',
    year: 2025,
    make: 'Honda',
    model: 'Accord',
    trim: 'Sport',
    color: 'Still Night Pearl',
    price: 28950,
    photos: 8,
    hasVideo: true,
    status: 'Ready',
    type: 'New',
    certified: false,
    vin: '1HGCV1F34PA789012',
    dealership: 'Summit Honda',
    dealershipId: 'summit-honda',
    lot: 'New iLot',
    lotId: 'honda-new',
    groupId: 'summit-auto-group'
  },
  {
    id: '12',
    stock: 'U2024-H01',
    year: 2023,
    make: 'Honda',
    model: 'CR-V',
    trim: 'EX',
    color: 'Radiant Red',
    price: 31200,
    photos: 5,
    hasVideo: false,
    status: 'In Progress',
    type: 'Used',
    certified: true,
    vin: '7FARW2H84OE890123',
    dealership: 'Summit Honda',
    dealershipId: 'summit-honda',
    lot: 'Used iLot',
    lotId: 'honda-used',
    groupId: 'summit-auto-group'
  },
  // Summit Nissan Vehicles
  {
    id: '13',
    stock: 'N25001',
    year: 2025,
    make: 'Nissan',
    model: 'Altima',
    trim: 'SL',
    color: 'Pearl White',
    price: 26850,
    photos: 0,
    hasVideo: false,
    status: 'Needs Photos',
    type: 'New',
    certified: false,
    vin: '1N4BL4BV1PC901234',
    dealership: 'Summit Nissan',
    dealershipId: 'summit-nissan',
    lot: 'New iLot',
    lotId: 'nissan-new',
    groupId: 'summit-auto-group'
  },
  {
    id: '14',
    stock: 'A2024-001',
    year: 2020,
    make: 'Nissan',
    model: 'Rogue',
    trim: 'SV',
    color: 'Gun Metallic',
    price: 22500,
    photos: 3,
    hasVideo: false,
    status: 'In Progress',
    type: 'Used',
    certified: false,
    vin: '5N1AT2MV4LC012345',
    dealership: 'Summit Nissan',
    dealershipId: 'summit-nissan',
    lot: 'Auction Lot',
    lotId: 'nissan-auction',
    groupId: 'summit-auto-group'
  }
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());
  const [selectedDealerGroup, setSelectedDealerGroup] = useState('ellis-auto-group');
  const [selectedRooftop, setSelectedRooftop] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortField, setSortField] = useState('stock');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  // Get current dealer group
  const currentDealerGroup = MOCK_DEALER_GROUPS.find(group => group.id === selectedDealerGroup);
  
  // Get rooftops for selected dealer group
  const availableRooftops = currentDealerGroup ? [
    { id: 'all', name: 'All Rooftops' },
    ...currentDealerGroup.dealerships.map(dealership => ({
      id: dealership.id,
      name: dealership.name
    }))
  ] : [];

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

  const handleEdit = (vehicleId: string) => {
    console.log('Edit vehicle:', vehicleId);
    alert(`Edit vehicle ${vehicleId}`);
  };

  const handleDelete = (vehicleId: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
      console.log('Deleted vehicle:', vehicleId);
    }
  };

  const handleAddVehicle = () => {
    router.push('/add-vehicle');
  };

  const handleExport = () => {
    // Create Excel-style data structure
    const headers = ['Stock #', 'Dealership', 'iLot', 'Type', 'Year', 'Make', 'Model', 'Trim', 'Color', 'Price', 'Photos', 'Status', 'VIN'];
    const data = filteredVehicles.map(vehicle => [
      vehicle.stock,
      vehicle.dealership,
      vehicle.lot,
      vehicle.type,
      vehicle.year,
      vehicle.make,
      vehicle.model,
      vehicle.trim,
      vehicle.color,
      `$${vehicle.price.toLocaleString()}`,
      vehicle.photos,
      vehicle.status,
      vehicle.vin
    ]);
    
    // Create simple HTML table for Excel import
    let html = '<table border="1"><tr>';
    headers.forEach(header => html += `<th>${header}</th>`);
    html += '</tr>';
    
    data.forEach(row => {
      html += '<tr>';
      row.forEach(cell => html += `<td>${cell}</td>`);
      html += '</tr>';
    });
    html += '</table>';
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('vehicle-table')?.outerHTML || '';
    const printWindow = window.open('', '', 'width=1200,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Vehicle Inventory - ${new Date().toLocaleDateString()}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; font-size: 11px; }
              th, td { border: 1px solid #ddd; padding: 6px; text-align: left; vertical-align: top; }
              th { background-color: #f5f5f5; font-weight: bold; }
              
              /* Hide interactive elements */
              input[type="checkbox"], button { display: none !important; }
              
              /* Fix icon sizes */
              svg { width: 12px !important; height: 12px !important; }
              
              /* Fix header button sizes */
              th button { display: none !important; }
              th .flex { display: block !important; }
              th .space-x-1 > span { display: inline !important; }
              
              /* Replace video icons with text */
              .video-icon::after { content: "Video"; font-size: 10px; }
              .video-icon svg { display: none !important; }
              
              /* Clean up spacing */
              .space-x-1, .space-x-2, .space-x-3 { 
                display: inline !important; 
                gap: 4px !important; 
              }
              
              @media print {
                body { margin: 0; }
                table { font-size: 10px; }
                th, td { padding: 4px; }
              }
            </style>
          </head>
          <body>
            <h1>Vehicle Inventory Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <p>Total Vehicles: ${filteredVehicles.length}</p>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for content to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVehicles(new Set(filteredVehicles.map(v => v.id)));
    } else {
      setSelectedVehicles(new Set());
    }
  };

  const handleSelectVehicle = (vehicleId: string, checked: boolean) => {
    const newSelected = new Set(selectedVehicles);
    if (checked) {
      newSelected.add(vehicleId);
    } else {
      newSelected.delete(vehicleId);
    }
    setSelectedVehicles(newSelected);
  };

  const filteredVehicles = vehicles
    .filter(vehicle => {
      const matchesSearch = searchTerm === '' || 
        vehicle.stock.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'All' || vehicle.type === filterType;
      
      const matchesDealerGroup = vehicle.groupId === selectedDealerGroup;
      
      const matchesRooftop = selectedRooftop === 'All' || 
        vehicle.dealershipId === selectedRooftop ||
        vehicle.dealership === selectedRooftop;
      
      return matchesSearch && matchesType && matchesDealerGroup && matchesRooftop;
    })
    .sort((a, b) => {
      const aVal = a[sortField as keyof typeof a];
      const bVal = b[sortField as keyof typeof b];
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

  const allSelected = filteredVehicles.length > 0 && selectedVehicles.size === filteredVehicles.length;
  const someSelected = selectedVehicles.size > 0;

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button 
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 hover:bg-gray-200 px-2 py-1 rounded text-gray-900 font-medium"
    >
      <span>{children}</span>
      {sortField === field && (
        sortOrder === 'asc' ? 
        <ChevronUpIcon className="w-3 h-3 text-gray-700" /> : 
        <ChevronDownIcon className="w-3 h-3 text-gray-700" />
      )}
    </button>
  );

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
                  <p className="text-sm text-gray-600">{currentDealerGroup?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <nav className="flex space-x-1">
                  <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded text-sm">
                    Inventory
                  </button>
                  <button 
                    onClick={() => router.push('/stickers')}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm"
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
        {/* Clean Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="px-6 py-4">
            {/* Top Row: Title and Actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-medium text-gray-900">Vehicle Inventory</h2>
                <div className="text-sm text-gray-500">
                  {filteredVehicles.length} of {vehicles.length} vehicles
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleAddVehicle}
                  className="flex items-center px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md text-sm"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Vehicle
                </button>
                <button 
                  onClick={handleExport}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                  Export
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm"
                >
                  <PrinterIcon className="w-4 h-4 mr-1" />
                  Print
                </button>
              </div>
            </div>

            {/* Bottom Row: Filters and Search */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Group and Rooftop Selectors */}
                <div className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded-md">
                  <select 
                    value={selectedDealerGroup}
                    onChange={(e) => {
                      setSelectedDealerGroup(e.target.value);
                      setSelectedRooftop('All'); // Reset rooftop when group changes
                    }}
                    className="text-sm border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-700 font-medium"
                  >
                    {MOCK_DEALER_GROUPS.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  
                  <div className="w-px h-4 bg-gray-300"></div>
                  
                  <select 
                    value={selectedRooftop}
                    onChange={(e) => setSelectedRooftop(e.target.value)}
                    className="text-sm border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-600"
                  >
                    {availableRooftops.map(rooftop => (
                      <option key={rooftop.id} value={rooftop.id}>
                        {rooftop.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search and Type Filter */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                  />
                </div>

                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                >
                  <option value="All">All Types</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
              </div>

              {someSelected && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-blue-600 font-medium">{selectedVehicles.size} selected</span>
                  <button className="px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm">
                    Bulk Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table id="vehicle-table" className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="w-8 px-2 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </th>
                <th className="w-20 px-2 py-3 text-left">
                  <SortButton field="stock">Stock #</SortButton>
                </th>
                <th className="w-24 px-2 py-3 text-left">
                  <SortButton field="dealership">Rooftop</SortButton>
                </th>
                <th className="w-20 px-2 py-3 text-left">
                  <SortButton field="lot">iLot</SortButton>
                </th>
                <th className="w-12 px-2 py-3 text-left">
                  <SortButton field="year">Year</SortButton>
                </th>
                <th className="w-16 px-2 py-3 text-left">
                  <SortButton field="make">Make</SortButton>
                </th>
                <th className="w-24 px-2 py-3 text-left">
                  <SortButton field="model">Model</SortButton>
                </th>
                <th className="w-20 px-2 py-3 text-left font-medium text-gray-900">Color</th>
                <th className="w-20 px-2 py-3 text-right">
                  <SortButton field="price">Price</SortButton>
                </th>
                <th className="w-16 px-2 py-3 text-center">
                  <SortButton field="photos">Photos</SortButton>
                </th>
                <th className="w-24 px-2 py-3 text-left font-medium text-gray-900">Status</th>
                <th className="w-16 px-2 py-3 text-center font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVehicles.map((vehicle, index) => (
                  <tr
                    key={vehicle.id}
                    className={`hover:bg-gray-50 ${
                      selectedVehicles.has(vehicle.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-2 py-3">
                      <input
                        type="checkbox"
                        checked={selectedVehicles.has(vehicle.id)}
                        onChange={(e) => handleSelectVehicle(vehicle.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <Link href={`/vehicle/${vehicle.id}`} className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-sm">
                        {vehicle.stock}
                      </Link>
                    </td>
                    <td className="px-2 py-3">
                      <div className="text-sm text-gray-900 truncate">{vehicle.dealership.replace("Ellis ", "")}</div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        {vehicle.lot.replace(" iLot", "")}
                      </div>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-900">{vehicle.year}</td>
                    <td className="px-2 py-3 text-sm text-gray-900 truncate">{vehicle.make}</td>
                    <td className="px-2 py-3 text-sm text-gray-900 truncate" title={vehicle.model}>{vehicle.model}</td>
                    <td className="px-2 py-3 text-sm text-gray-600 truncate" title={vehicle.color}>{vehicle.color}</td>
                    <td className="px-2 py-3 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ${(vehicle.price / 1000).toFixed(0)}k
                      </div>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {vehicle.photos > 0 ? (
                          <span className="text-green-600 font-medium text-sm">{vehicle.photos}</span>
                        ) : (
                          <span className="text-red-600 font-medium text-sm">0</span>
                        )}
                        {vehicle.hasVideo && (
                          <VideoCameraIcon className="w-3 h-3 text-blue-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          vehicle.status === 'Ready'
                            ? 'bg-green-100 text-green-800'
                            : vehicle.status === 'Needs Photos'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {vehicle.status.replace(" Photos", "")}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => handleEdit(vehicle.id)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" 
                          title="Edit"
                        >
                          <PencilIcon className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => handleDelete(vehicle.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50" 
                          title="Delete"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}