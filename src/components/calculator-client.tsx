'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';

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

export default function CalculatorClient({ banks, loading, error }: { banks: Bank[], loading: boolean, error: string }) {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [selectedCertificate, setSelectedCertificate] = useState<string>('');
  const [amount, setAmount] = useState<string>('10000');
  const [result, setResult] = useState<{ totalProfit: number; totalAmount: number } | null>(null);

  const availableCertificates = selectedBank 
    ? banks.find(bank => bank.id === selectedBank)?.certificates || []
    : [];

  const calculateProfit = () => {
      // Open smart link in new window
        const smartLink = 'https://www.effectivegatecpm.com/kcizzjmh1?key=1f3876afe83612bbf1921c9f11ab2695'
        window.open(smartLink, '_blank', 'noopener,noreferrer');
    if (!selectedBank || !selectedCertificate || !amount) return;

    const bank = banks.find(b => b.id === selectedBank);
    const certificate = bank?.certificates.find(c => c.id === selectedCertificate);
    
    if (!certificate) return;

    const principal = parseFloat(amount);
    let totalProfit = 0;

    if (certificate.returnType === 'graduated' && certificate.graduatedRates) {
      // Check if it's annual graduated certificate
      if (certificate.type === 'annual') {
        // Annual graduated certificate - YEARLY profit only
        const year1Profit = principal * (certificate.graduatedRates.year1 / 100);
        const year2Profit = principal * (certificate.graduatedRates.year2 / 100);
        const year3Profit = principal * (certificate.graduatedRates.year3 / 100);
        totalProfit = year1Profit + year2Profit + year3Profit;
      } else {
        // Monthly graduated certificate - MONTHLY profit for each year
        const year1MonthlyProfit = (principal * (certificate.graduatedRates.year1 / 100)) / 12;
        const year2MonthlyProfit = (principal * (certificate.graduatedRates.year2 / 100)) / 12;
        const year3MonthlyProfit = (principal * (certificate.graduatedRates.year3 / 100)) / 12;
        
        const year1TotalProfit = year1MonthlyProfit * 12;
        const year2TotalProfit = year2MonthlyProfit * 12;
        const year3TotalProfit = year3MonthlyProfit * 12;
        
        totalProfit = year1TotalProfit + year2TotalProfit + year3TotalProfit;
      }
    } else {
      // Calculate profit for fixed certificates - MONTHLY profit
      const years = certificate.duration / 12;
      const monthlyProfit = (principal * (certificate.interestRate / 100)) / 12;
      totalProfit = monthlyProfit * 12 * years; // Total profit over the entire period
    }

    setResult({
      totalProfit,
      totalAmount: principal + totalProfit
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
          <Label htmlFor="bank">اختر البنك</Label>
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
                          // Fallback to emoji if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'block';
                          }
                        }}
                      />
                      <div className="text-sm" style={{display: 'none'}}>
                        {bank.id === 'banque-misr' ? '🏦' : '🏛️'}
                      </div>
                    </div>
                    <span>{bank.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="certificate">اختر الشهادة</Label>
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
                  <div className="flex flex-col">
                    <span className="font-medium">{cert.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {cert.duration / 12} سنوات • {
                        cert.returnType === 'graduated' && cert.graduatedRates 
                          ? Math.max(cert.graduatedRates.year1, cert.graduatedRates.year2, cert.graduatedRates.year3) 
                          : cert.interestRate
                      }%
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">مبلغ الاستثمار (جنيه مصري)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="أدخل المبلغ"
          min="0"
        />
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={calculateProfit}
          disabled={!selectedBank || !selectedCertificate || !amount}
          className="flex-1"
        >
          <Calculator className="w-4 h-4 ml-2" />
          حساب الأرباح
        </Button>
        <Button variant="outline" onClick={reset}>
          إعادة تعيين
        </Button>
      </div>

      {result && selectedBank && selectedCertificate && (() => {
        const bank = banks.find(b => b.id === selectedBank);
        const certificate = bank?.certificates.find(c => c.id === selectedCertificate);
        const principal = parseFloat(amount);
        
        if (!certificate) return null;

        const monthlyProfit = certificate.returnType === 'fixed' 
          ? (principal * (certificate.interestRate / 100)) / 12
          : null;

        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                نتيجة الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">مبلغ الاستثمار</p>
                  <p className="text-2xl font-bold">{principal.toLocaleString()} ج.م</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">إجمالي الربح</p>
                  <p className="text-2xl font-bold text-primary">{result.totalProfit.toLocaleString()} ج.م</p>
                </div>
              </div>
              
              {/* Monthly profit for fixed certificates */}
              {certificate.returnType === 'fixed' && monthlyProfit && (
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium">الربح الشهري</p>
                  <p className="text-xl font-bold text-green-600">
                    {monthlyProfit.toLocaleString(undefined, {maximumFractionDigits: 2})} ج.م
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    (شهرياً من {certificate.interestRate}% سنوياً)
                  </p>
                </div>
              )}
              
              {/* Show yearly breakdown for graduated certificates */}
              {certificate.returnType === 'graduated' && certificate.graduatedRates && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-center mb-4 text-foreground">
                    تفصيل الأرباح {certificate.type === 'annual' ? 'السنوية' : 'الشهري'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-background rounded border">
                      <p className="text-sm text-muted-foreground">السنة الأولى</p>
                      <p className="text-lg font-bold text-primary">{certificate.graduatedRates.year1}%</p>
                      {certificate.type === 'annual' ? (
                        <p className="text-sm text-green-600 font-medium">
                          {(principal * certificate.graduatedRates.year1 / 100).toLocaleString()} ج.م سنوياً
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-green-600 font-medium">
                            {((principal * (certificate.graduatedRates.year1 / 100)) / 12).toLocaleString(undefined, {maximumFractionDigits: 2})} ج.م شهرياً
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(principal * certificate.graduatedRates.year1 / 100).toLocaleString()} ج.م سنوياً
                          </p>
                        </>
                      )}
                    </div>
                    <div className="text-center p-3 bg-background rounded border">
                      <p className="text-sm text-muted-foreground">السنة الثانية</p>
                      <p className="text-lg font-bold text-primary">{certificate.graduatedRates.year2}%</p>
                      {certificate.type === 'annual' ? (
                        <p className="text-sm text-green-600 font-medium">
                          {(principal * certificate.graduatedRates.year2 / 100).toLocaleString()} ج.م سنوياً
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-green-600 font-medium">
                            {((principal * (certificate.graduatedRates.year2 / 100)) / 12).toLocaleString(undefined, {maximumFractionDigits: 2})} ج.م شهرياً
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(principal * certificate.graduatedRates.year2 / 100).toLocaleString()} ج.م سنوياً
                          </p>
                        </>
                      )}
                    </div>
                    <div className="text-center p-3 bg-background rounded border">
                      <p className="text-sm text-muted-foreground">السنة الثالثة</p>
                      <p className="text-lg font-bold text-primary">{certificate.graduatedRates.year3}%</p>
                      {certificate.type === 'annual' ? (
                        <p className="text-sm text-green-600 font-medium">
                          {(principal * certificate.graduatedRates.year3 / 100).toLocaleString()} ج.م سنوياً
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-green-600 font-medium">
                            {((principal * (certificate.graduatedRates.year3 / 100)) / 12).toLocaleString(undefined, {maximumFractionDigits: 2})} ج.م شهرياً
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(principal * certificate.graduatedRates.year3 / 100).toLocaleString()} ج.م سنوياً
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Additional info for annual certificates */}
                  {certificate.type === 'annual' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 text-center">
                        <strong>ملاحظة:</strong> هذه الشهادة ذات عائد سنوي فقط، يتم صرف الفائدة مرة واحدة في نهاية كل سنة.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
}
