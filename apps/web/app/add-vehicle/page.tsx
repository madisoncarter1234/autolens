'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { 
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface VinDecodeResult {
  success: boolean;
  data?: {
    year: string;
    make: string;
    model: string;
    trim?: string;
    engine?: string;
    transmission?: string;
    drivetrain?: string;
    bodyStyle?: string;
    fuel?: string;
  };
  error?: string;
}

export default function AddVehiclePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [vinDecoding, setVinDecoding] = useState(false);
  const [vinDecoded, setVinDecoded] = useState(false);
  const [vinError, setVinError] = useState('');

  // Mock data for dealership hierarchy
  const mockDealerships = [
    { id: '1', name: 'Ellis Chevrolet', brand: 'Chevrolet' },
    { id: '2', name: 'Ellis Ford', brand: 'Ford' },
    { id: '3', name: 'Ellis Toyota', brand: 'Toyota' }
  ];

  const mockLots = [
    { id: '1', dealershipId: '1', name: 'New iLot', type: 'NEW' },
    { id: '2', dealershipId: '1', name: 'Used iLot', type: 'USED' },
    { id: '3', dealershipId: '1', name: 'Service Lot', type: 'SERVICE' },
    { id: '4', dealershipId: '2', name: 'New iLot', type: 'NEW' },
    { id: '5', dealershipId: '2', name: 'Used iLot', type: 'USED' },
    { id: '6', dealershipId: '3', name: 'New iLot', type: 'NEW' },
    { id: '7', dealershipId: '3', name: 'Used iLot', type: 'USED' }
  ];

  // Form data
  const [formData, setFormData] = useState({
    dealershipId: '',
    lotId: '',
    stock: '',
    vin: '',
    year: '',
    make: '',
    model: '',
    trim: '',
    color: '',
    interiorColor: '',
    price: '',
    msrp: '',
    mileage: '',
    engine: '',
    transmission: '',
    drivetrain: '',
    mpgCity: '',
    mpgHighway: '',
    type: 'New',
    certified: false,
    description: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('autolens-user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const decodeVin = async () => {
    if (!formData.vin || formData.vin.length !== 17) {
      setVinError('VIN must be exactly 17 characters');
      return;
    }

    setVinDecoding(true);
    setVinError('');
    setVinDecoded(false);

    try {
      // Using NHTSA VIN Decoder API (free government API)
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${formData.vin}?format=json`);
      const data = await response.json();

      if (data.Results) {
        // Extract relevant information from the API response
        const results = data.Results;
        const getResult = (variableName: string) => {
          const item = results.find((r: any) => r.Variable === variableName);
          return item?.Value || '';
        };

        // Update form data with decoded information
        setFormData(prev => ({
          ...prev,
          year: getResult('Model Year') || prev.year,
          make: getResult('Make') || prev.make,
          model: getResult('Model') || prev.model,
          trim: getResult('Trim') || prev.trim,
          engine: getResult('Engine Configuration') || getResult('Engine Number of Cylinders') || prev.engine,
          transmission: getResult('Transmission Style') || prev.transmission,
          drivetrain: getResult('Drive Type') || prev.drivetrain
        }));

        setVinDecoded(true);
        setVinError('');
      } else {
        setVinError('Could not decode VIN. Please check the VIN number.');
      }
    } catch (error) {
      console.error('VIN decode error:', error);
      setVinError('Error decoding VIN. Please try again or enter vehicle details manually.');
    } finally {
      setVinDecoding(false);
    }
  };

  // Get available lots for selected dealership
  const availableLots = mockLots.filter(lot => lot.dealershipId === formData.dealershipId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.dealershipId || !formData.lotId || !formData.stock || !formData.vin || !formData.year || !formData.make || !formData.model) {
      alert('Please fill in all required fields (Dealership, iLot, Stock #, VIN, Year, Make, Model)');
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would submit to the API
      console.log('Submitting vehicle data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, just redirect back to dashboard
      alert('Vehicle added successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Error adding vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
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
                <h1 className="text-xl font-semibold text-gray-900">Add New Vehicle</h1>
                <p className="text-sm text-gray-600">Add a new vehicle to your inventory</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* VIN Decoder Section */}
          <Card>
            <CardHeader>
              <CardTitle>VIN Decoder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    label="Vehicle Identification Number (VIN)"
                    value={formData.vin}
                    onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                    placeholder="Enter 17-character VIN"
                    maxLength={17}
                    required
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={decodeVin}
                    loading={vinDecoding}
                    disabled={!formData.vin || formData.vin.length !== 17}
                    className="flex items-center"
                  >
                    <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                    Decode VIN
                  </Button>
                </div>
              </div>

              {vinDecoded && (
                <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-md">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  <span>VIN decoded successfully! Vehicle information has been populated.</span>
                </div>
              )}

              {vinError && (
                <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-md">
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                  <span>{vinError}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dealership *
                  </label>
                  <select
                    value={formData.dealershipId}
                    onChange={(e) => {
                      handleInputChange('dealershipId', e.target.value);
                      handleInputChange('lotId', ''); // Reset lot when dealership changes
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  >
                    <option value="">Select Dealership</option>
                    {mockDealerships.map(dealership => (
                      <option key={dealership.id} value={dealership.id}>
                        {dealership.name} ({dealership.brand})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    iLot (Physical Lot) *
                  </label>
                  <select
                    value={formData.lotId}
                    onChange={(e) => handleInputChange('lotId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                    disabled={!formData.dealershipId}
                  >
                    <option value="">Select iLot</option>
                    {availableLots.map(lot => (
                      <option key={lot.id} value={lot.id}>
                        {lot.name} ({lot.type.toLowerCase()})
                      </option>
                    ))}
                  </select>
                  {!formData.dealershipId && (
                    <p className="text-sm text-gray-500 mt-1">Select a dealership first</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Stock Number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="Enter stock number"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="Year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder="2024"
                  required
                />
                
                <Input
                  label="Make"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  placeholder="Ford"
                  required
                />
                
                <Input
                  label="Model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="F-150"
                  required
                />
                
                <Input
                  label="Trim"
                  value={formData.trim}
                  onChange={(e) => handleInputChange('trim', e.target.value)}
                  placeholder="Lariat"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Exterior Color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="Magnetic Gray"
                />
                
                <Input
                  label="Interior Color"
                  value={formData.interiorColor}
                  onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                  placeholder="Black Leather"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Mileage */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Mileage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Current Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="45000"
                />
                
                <Input
                  label="MSRP (Optional)"
                  type="number"
                  value={formData.msrp}
                  onChange={(e) => handleInputChange('msrp', e.target.value)}
                  placeholder="47500"
                />
                
                <Input
                  label="Mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  placeholder="12"
                />
              </div>

              {formData.type === 'Used' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="certified"
                    checked={formData.certified}
                    onChange={(e) => handleInputChange('certified', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded mr-2"
                  />
                  <label htmlFor="certified" className="text-sm font-medium text-gray-700">
                    Certified Pre-Owned (CPO)
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Engine"
                  value={formData.engine}
                  onChange={(e) => handleInputChange('engine', e.target.value)}
                  placeholder="3.5L V6 Twin-Turbo"
                />
                
                <Input
                  label="Transmission"
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  placeholder="10-Speed Automatic"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Drivetrain"
                  value={formData.drivetrain}
                  onChange={(e) => handleInputChange('drivetrain', e.target.value)}
                  placeholder="4WD"
                />
                
                <Input
                  label="MPG City"
                  type="number"
                  value={formData.mpgCity}
                  onChange={(e) => handleInputChange('mpgCity', e.target.value)}
                  placeholder="17"
                />
                
                <Input
                  label="MPG Highway"
                  type="number"
                  value={formData.mpgHighway}
                  onChange={(e) => handleInputChange('mpgHighway', e.target.value)}
                  placeholder="23"
                />
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter vehicle description, features, and any additional notes..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="px-8"
            >
              Add Vehicle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}