'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const DEMO_USERS = [
  {
    email: 'demo@dealer.com',
    password: 'demo123',
    name: 'Demo Dealer',
    role: 'Owner',
    dealership: 'Premium Auto Group'
  },
  {
    email: 'sales@dealer.com',
    password: 'sales123',
    name: 'Sales Manager',
    role: 'Sales',
    dealership: 'Premium Auto Group'
  },
  {
    email: 'photo@dealer.com',
    password: 'photo123',
    name: 'Photographer',
    role: 'Photographer',
    dealership: 'Premium Auto Group'
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('autolens-user', JSON.stringify(user));
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Use demo@dealer.com / demo123');
    }

    setLoading(false);
  };

  const fillDemo = (userIndex: number) => {
    const user = DEMO_USERS[userIndex];
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AutoLens</h1>
          <p className="text-gray-600 mt-2">Inventory Management & Photography Suite</p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>Enter your credentials to access your dealership dashboard</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                leftIcon={<EnvelopeIcon />}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                leftIcon={<LockClosedIcon />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                }
                required
              />

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                loading={loading}
              >
                Sign in
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-3">Demo Accounts:</p>
              <div className="space-y-2">
                {DEMO_USERS.map((user, index) => (
                  <button
                    key={index}
                    onClick={() => fillDemo(index)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {user.role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-8">
          © 2024 AutoLens. All rights reserved.
        </p>
      </div>
    </div>
  );
}