'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp } from 'lucide-react';

interface Certificate {
  id: string;
  name: string;
  duration: number;
  interestRate: number;
  returnType: 'fixed' | 'variable' | 'graduated';
  graduatedRates?: {
    year1: number;
    year2: number;
    year3: number;
  };
  type: 'monthly' | 'quarterly' | 'annual';
  minAmount: number;
  description: string;
  features: string[];
}

interface Bank {
  id: string;
  name: string;
  logo: string;
  certificates: Certificate[];
}

export default function CalculatorClient({
  banks,
  loading,
  error,
}: {
  banks: Bank[];
  loading: boolean;
  error: string;
}) {
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState('');
  const [amount, setAmount] = useState('10000');
  const [result, setResult] = useState<{ totalProfit: number; totalAmount: number } | null>(null);

  const availableCertificates = selectedBank
    ? banks.find((bank) => bank.id === selectedBank)?.certificates || []
    : [];

  const calculateProfit = () => {
      // Open smart link in new window
        const smartLink = 'https://www.effectivegatecpm.com/e9za5z4kq?key=dcc0f851d9a84373efd70f7e3ed11080'
        window.open(smartLink, '_blank', 'noopener,noreferrer');

    if (!selectedBank || !selectedCertificate || !amount) return;

    const bank = banks.find((b) => b.id === selectedBank);
    const certificate = bank?.certificates.find((c) => c.id === selectedCertificate);
    if (!certificate) return;

    const principal = parseFloat(amount);
    let totalProfit = 0;

    if (certificate.returnType === 'graduated' && certificate.graduatedRates) {
      totalProfit =
        principal * (certificate.graduatedRates.year1 / 100) +
        principal * (certificate.graduatedRates.year2 / 100) +
        principal * (certificate.graduatedRates.year3 / 100);
    } else {
      const years = certificate.duration / 12;
      totalProfit = principal * (certificate.interestRate / 100) * years;
    }

    setResult({
      totalProfit,
      totalAmount: principal + totalProfit,
    });
  };

  const reset = () => {
    setSelectedBank('');
    setSelectedCertificate('');
    setAmount('10000');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>اختر البنك</Label>
          <Select value={selectedBank} onValueChange={setSelectedBank}>
            <SelectTrigger>
              <SelectValue placeholder="اختر البنك" />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <img
                        src={bank.logo}
                        alt={`${bank.name} logo`}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                      <div className="text-sm hidden">🏦</div>
                    </div>
                    <span>{bank.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>اختر الشهادة</Label>
          <Select
            value={selectedCertificate}
            onValueChange={setSelectedCertificate}
            disabled={!selectedBank}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الشهادة" />
            </SelectTrigger>
            <SelectContent>
              {availableCertificates.map((cert) => (
                <SelectItem key={cert.id} value={cert.id}>
                  {cert.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>مبلغ الاستثمار (جنيه مصري)</Label>
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>

      <div className="flex gap-4">
        <Button className="flex-1" onClick={calculateProfit}>
          <Calculator className="w-4 h-4 ml-2" />
          حساب الأرباح
        </Button>
        <Button variant="outline" onClick={reset}>
          إعادة تعيين
        </Button>
      </div>

      {result && (() => {
        const bank = banks.find((b) => b.id === selectedBank);
        const certificate = bank?.certificates.find((c) => c.id === selectedCertificate);
        if (!certificate) return null;

        const principal = parseFloat(amount);
        const annualProfit = principal * (certificate.interestRate / 100);

        const monthlyProfit =
          certificate.returnType === 'fixed' && certificate.type === 'monthly'
            ? annualProfit / 12
            : null;

        const quarterlyProfit =
          certificate.returnType === 'fixed' && certificate.type === 'quarterly'
            ? annualProfit / 4
            : null;

        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                نتيجة الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded">
                  <p className="text-sm">مبلغ الاستثمار</p>
                  <p className="text-xl font-bold">{principal.toLocaleString()} ج.م</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded">
                  <p className="text-sm">إجمالي الربح</p>
                  <p className="text-xl font-bold text-primary">
                    {result.totalProfit.toLocaleString()} ج.م
                  </p>
                </div>
              </div>

              {monthlyProfit && (
                <div className="text-center p-4 bg-green-50 rounded border">
                  <p className="text-sm font-medium text-green-700">الربح الشهري</p>
                  <p className="text-xl font-bold text-green-600">
                    {monthlyProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })} ج.م
                  </p>
                </div>
              )}

              {quarterlyProfit && (
                <div className="text-center p-4 bg-blue-50 rounded border">
                  <p className="text-sm font-medium text-blue-700">الربح كل 3 شهور</p>
                  <p className="text-xl font-bold text-blue-600">
                    {quarterlyProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })} ج.م
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
}
