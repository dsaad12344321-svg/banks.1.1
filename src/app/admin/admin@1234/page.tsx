'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Upload, 
  Download,
  RefreshCw,
  Building2,
  Percent,
  Clock,
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';

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
  logoUrl?: string;
}

interface Bank {
  id: string;
  name: string;
  logo: string;
  certificates: Certificate[];
}

interface BankData {
  banks: Bank[];
}

export default function AdminPanel() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'admin@1234') {
      // Redirect to login if not authenticated
      window.location.href = '/admin';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === 'admin@1234') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'admin@1234');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setPassword('');
  };

  // Load bank data
  const loadBankData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bank-data');
      const data: BankData = await response.json();
      setBanks(data.banks || []);
    } catch (error) {
      console.error('Error loading bank data:', error);
      alert('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Update static data in page.tsx as well
  const updateStaticData = (updatedBanks: Bank[]) => {
    // This will trigger a re-render with the new data
    setBanks(updatedBanks);
    
    // Also update the static data by calling the API
    fetch('/api/admin/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ banks: updatedBanks }),
    }).catch(error => {
      console.error('Error updating static data:', error);
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadBankData();
    }
  }, [isAuthenticated]);

  // Save bank data
  const saveBankData = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ banks }),
      });

      if (response.ok) {
        alert('تم حفظ البيانات بنجاح');
        // Update static data in page.tsx
        updateStaticData(banks);
      } else {
        alert('فشل في حفظ البيانات');
      }
    } catch (error) {
      console.error('Error saving bank data:', error);
      alert('فشل في حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  // Add new bank
  const addBank = () => {
    const newBank: Bank = {
      id: `bank-${Date.now()}`,
      name: 'بنك جديد',
      logo: '/logo.svg',
      certificates: []
    };
    const updatedBanks = [...banks, newBank];
    setBanks(updatedBanks);
    updateStaticData(updatedBanks);
  };

  // Add new certificate
  const addCertificate = (bankId: string) => {
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      name: 'شهادة جديدة',
      duration: 36,
      interestRate: 15.0,
      returnType: 'fixed',
      graduatedRates: {
        year1: 15.0,
        year2: 16.0,
        year3: 17.0
      },
      type: 'monthly',
      minAmount: 1000,
      description: 'شهادة ادخارية جديدة',
      features: ['فائدة شهرية']
    };

    const updatedBanks = banks.map(bank => 
      bank.id === bankId 
        ? { ...bank, certificates: [...bank.certificates, newCert] }
        : bank
    );
    setBanks(updatedBanks);
    updateStaticData(updatedBanks);
  };

  // Delete bank
  const deleteBank = (bankId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا البنك؟')) {
      const updatedBanks = banks.filter(bank => bank.id !== bankId);
      setBanks(updatedBanks);
      updateStaticData(updatedBanks);
    }
  };

  // Delete certificate
  const deleteCertificate = (bankId: string, certId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الشهادة؟')) {
      const updatedBanks = banks.map(bank => 
        bank.id === bankId 
          ? { ...bank, certificates: bank.certificates.filter(cert => cert.id !== certId) }
          : bank
      );
      setBanks(updatedBanks);
      updateStaticData(updatedBanks);
    }
  };

  // Update bank
  const updateBank = (bankId: string, updates: Partial<Bank>) => {
    const updatedBanks = banks.map(bank => 
      bank.id === bankId ? { ...bank, ...updates } : bank
    );
    setBanks(updatedBanks);
    updateStaticData(updatedBanks);
    
    // Trigger storage event for real-time sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'bankDataUpdated'
      }));
    }
  };

  // Update certificate
  const updateCertificate = (bankId: string, certId: string, updates: Partial<Certificate>) => {
    const updatedBanks = banks.map(bank => 
      bank.id === bankId 
        ? { 
            ...bank, 
            certificates: bank.certificates.map(cert => 
              cert.id === certId ? { ...cert, ...updates } : cert
            )
          }
        : bank
    );
    setBanks(updatedBanks);
    updateStaticData(updatedBanks);
    
    // Trigger storage event for real-time sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'bankDataUpdated'
      }));
    }
  };

  // Export data
  const exportData = () => {
    const dataStr = JSON.stringify({ banks }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'bank-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import data
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.banks && Array.isArray(data.banks)) {
            setBanks(data.banks);
            alert('تم استيراد البيانات بنجاح');
          } else {
            alert('ملف JSON غير صالح');
          }
        } catch (error) {
          alert('فشل في قراءة الملف');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md mx-auto mt-20">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Settings className="w-6 h-6 text-blue-600" />
                لوحة التحكم
              </CardTitle>
              <CardDescription>
                يرجى إدخال كلمة المرور للوصول إلى لوحة التحكم
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button onClick={handleLogin} className="w-full">
                تسجيل الدخول
              </Button>
              <div className="text-center">
                <Link href="/" className="text-blue-600 hover:underline text-sm">
                  العودة إلى الصفحة الرئيسية
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  لوحة التحكم
                </h1>
                <p className="text-gray-600">
                  إدارة بيانات شهادات البنوك
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadBankData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 ml-2" />
                تحديث
              </Button>
              <Button onClick={saveBankData} disabled={saving} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 ml-2" />
                {saving ? 'جاري الحفظ...' : 'حفظ البيانات'}
              </Button>
              <Button onClick={handleLogout} variant="destructive" size="sm">
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </header>

        {/* Import/Export */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              استيراد وتصدير البيانات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div>
                <Label htmlFor="import" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 ml-2" />
                      استيراد JSON
                    </span>
                  </Button>
                </Label>
                <input
                  id="import"
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </div>
              <Button onClick={exportData} variant="outline">
                <Download className="w-4 h-4 ml-2" />
                تصدير JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Banks Management */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {banks.map((bank) => (
              <Card key={bank.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{bank.name}</CardTitle>
                        <CardDescription>
                          {bank.certificates.length} شهادة
                        </CardDescription>
                        <div className="text-xs text-gray-500 mt-1">
                          اللوجو: {bank.logo}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingBank(editingBank?.id === bank.id ? null : bank)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteBank(bank.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Bank Edit Form */}
                  {editingBank?.id === bank.id && (
                    <form onSubmit={(e) => { e.preventDefault(); updateBank(bank.id, editingBank); }} className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-4">تعديل البنك</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>اسم البنك</Label>
                          <Input
                            value={editingBank.name}
                            onChange={(e) => setEditingBank({ ...editingBank, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>الأيقونة (المسار)</Label>
                          <Input
                            type="text"
                            value={editingBank.logo}
                            onChange={(e) => setEditingBank({ ...editingBank, logo: e.target.value })}
                            placeholder="/elahly.svg"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            مثال: /misr.svg أو /elahly.svg
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            المسار الحالي: {editingBank.logo}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button type="submit" className="bg-green-600">
                          <Save className="w-4 h-4 ml-2" />
                          حفظ التعديلات
                        </Button>
                        <Button type="button" onClick={() => setEditingBank(null)} variant="outline">
                          إلغاء
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Certificates */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">الشهادات</h4>
                      <Button
                        onClick={() => addCertificate(bank.id)}
                        size="sm"
                        className="bg-blue-600"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة شهادة
                      </Button>
                    </div>

                    {bank.certificates.map((cert) => (
                      <div key={cert.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{cert.name}</Badge>
                            <Badge className="bg-green-100 text-green-800">
                              {cert.interestRate}%
                            </Badge>
                            <Badge variant="outline">
                              {cert.duration / 12} سنوات
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setEditingCert(editingCert?.id === cert.id ? cert : cert)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => deleteCertificate(bank.id, cert.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Certificate Edit Form */}
                        {editingCert?.id === cert.id && (
                          <form onSubmit={(e) => { e.preventDefault(); updateCertificate(bank.id, cert.id, editingCert); }} className="p-4 bg-gray-50 rounded-lg">
                            <h5 className="font-semibold mb-4">تعديل الشهادة</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>اسم الشهادة</Label>
                                <Input
                                  value={editingCert.name}
                                  onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>نوع العائد</Label>
                                <Select
                                  value={editingCert.returnType}
                                  onValueChange={(value: 'fixed' | 'variable' | 'graduated') => setEditingCert({ ...editingCert, returnType: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="fixed">ثابت</SelectItem>
                                    <SelectItem value="variable">متغير</SelectItem>
                                    <SelectItem value="graduated">متدرج</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {editingCert.returnType !== 'graduated' && (
                                <div>
                                  <Label>سعر الفائدة (%)</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editingCert.interestRate}
                                    onChange={(e) => setEditingCert({ ...editingCert, interestRate: parseFloat(e.target.value) })}
                                  />
                                </div>
                              )}
                              <div>
                                <Label>المدة (سنوات)</Label>
                                <Input
                                  type="number"
                                  value={editingCert.duration / 12}
                                  onChange={(e) => setEditingCert({ ...editingCert, duration: parseInt(e.target.value) * 12 })}
                                />
                              </div>
                              <div>
                                <Label>الحد الأدنى</Label>
                                <Input
                                  type="number"
                                  value={editingCert.minAmount}
                                  onChange={(e) => setEditingCert({ ...editingCert, minAmount: parseFloat(e.target.value) })}
                                />
                              </div>
                              <div>
                                <Label>نوع الفائدة</Label>
                                <Select
                                  value={editingCert.type}
                                  onValueChange={(value: 'monthly' | 'quarterly' | 'annual') => setEditingCert({ ...editingCert, type: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="monthly">شهري</SelectItem>
                                    <SelectItem value="quarterly">ربع سنوي</SelectItem>
                                    <SelectItem value="annual">سنوي</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {/* Graduated Rates Section */}
                              {editingCert.returnType === 'graduated' && (
                                <>
                                  <div className="md:col-span-2">
                                    <h6 className="font-medium mb-3 text-blue-700">أسعار الفائدة المتدرجة</h6>
                                  </div>
                                  <div>
                                    <Label>السنة الأولى (%)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={editingCert.graduatedRates?.year1 || 15.0}
                                      onChange={(e) => setEditingCert({ 
                                        ...editingCert, 
                                        graduatedRates: { 
                                          year1: parseFloat(e.target.value),
                                          year2: editingCert.graduatedRates?.year2 || 15.0,
                                          year3: editingCert.graduatedRates?.year3 || 15.0
                                        }
                                      })}
                                    />
                                  </div>
                                  <div>
                                    <Label>السنة الثانية (%)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={editingCert.graduatedRates?.year2 || 16.0}
                                      onChange={(e) => setEditingCert({ 
                                        ...editingCert, 
                                        graduatedRates: { 
                                          year1: editingCert.graduatedRates?.year1 || 15.0,
                                          year2: parseFloat(e.target.value),
                                          year3: editingCert.graduatedRates?.year3 || 15.0
                                        }
                                      })}
                                    />
                                  </div>
                                  <div>
                                    <Label>السنة الثالثة (%)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={editingCert.graduatedRates?.year3 || 17.0}
                                      onChange={(e) => setEditingCert({ 
                                        ...editingCert, 
                                        graduatedRates: { 
                                          year1: editingCert.graduatedRates?.year1 || 15.0,
                                          year2: editingCert.graduatedRates?.year2 || 16.0,
                                          year3: parseFloat(e.target.value)
                                        }
                                      })}
                                    />
                                  </div>
                                </>
                              )}
                              
                              <div className="md:col-span-2">
                                <Label>الوصف</Label>
                                <Textarea
                                  value={editingCert.description}
                                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>المميزات (مفصولة بفواصل)</Label>
                                <Textarea
                                  value={editingCert.features.join(', ')}
                                  onChange={(e) => setEditingCert({ ...editingCert, features: e.target.value.split(',').map(f => f.trim()) })}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button type="submit" className="bg-green-600">
                                <Save className="w-4 h-4 ml-2" />
                                حفظ التعديلات
                              </Button>
                              <Button type="button" onClick={() => setEditingCert(null)} variant="outline">
                                إلغاء
                              </Button>
                            </div>
                          </form>
                        )}

                        {/* Certificate Display */}
                        {editingCert?.id !== cert.id && (
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={cert.returnType === 'graduated' ? 'default' : cert.returnType === 'variable' ? 'secondary' : 'outline'}>
                                {cert.returnType === 'fixed' ? 'ثابت' : cert.returnType === 'variable' ? 'متغير' : 'متدرج'}
                              </Badge>
                              {cert.returnType === 'graduated' && cert.graduatedRates && (
                                <span className="text-xs text-blue-600">
                                  السنة الأولى: {cert.graduatedRates.year1}% | 
                                  السنة الثانية: {cert.graduatedRates.year2}% | 
                                  السنة الثالثة: {cert.graduatedRates.year3}%
                                </span>
                              )}
                              {cert.returnType !== 'graduated' && (
                                <span className="text-xs text-green-600">
                                  فائدة: {cert.interestRate}%
                                </span>
                              )}
                            </div>
                            <p>{cert.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {cert.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Bank */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  إضافة بنك جديد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={addBank} className="bg-blue-600">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة بنك جديد
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}