'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp } from 'lucide-react';

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

export default function BanksDisplay({ banks, loading, error }: { banks: Bank[], loading: boolean, error: string }) {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {banks.map((bank) => (
        <Card key={bank.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
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
              <div className="text-4xl" style={{display: 'none'}}>
                {bank.id === 'banque-misr' ? '🏦' : '🏛️'}
              </div>
            </div>
            <CardTitle className="text-xl">{bank.name}</CardTitle>
            <CardDescription>{bank.certificates.length} شهادة متاحة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bank.certificates.map((cert) => (
                <div key={cert.id} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <div className="text-center flex-1">
                    <p className="font-medium text-sm">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.duration / 12} سنوات</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Badge variant="outline">
                        {cert.returnType === 'fixed' ? 'ثابت' : 
                         cert.returnType === 'variable' ? 'متغير' : 'متدرج'}
                      </Badge>
                      {cert.returnType === 'graduated' && cert.graduatedRates && (
                        <span className="text-xs text-primary">
                          ({cert.graduatedRates.year1}%|{cert.graduatedRates.year2}%|{cert.graduatedRates.year3}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary">
                    {cert.returnType === 'graduated' && cert.graduatedRates 
                      ? Math.max(cert.graduatedRates.year1, cert.graduatedRates.year2, cert.graduatedRates.year3) 
                      : cert.interestRate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}