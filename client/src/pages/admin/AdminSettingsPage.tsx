import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { BusinessSettings, TeamMember } from '../../types';
import { Save, Check, Store, Phone, Mail, Building, Users } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings()
      .then((data) => {
        setSettings(data.settings);
        setTeam(data.team);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await api.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert('Failed to update settings');
    }
  };

  if (loading || !settings) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0B1F3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
          HEADQUARTERS CONFIGURATION
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#0B1F3A]">
          Store Settings & Regional Delivery
        </h1>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Settings updated successfully! Changes are live on the storefront.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Contact & Address */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#0B1F3A] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#C9A227]" />
            Mushin Physical Showroom & Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#0B1F3A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Physical Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Phone Line 1 (Primary)</label>
              <input
                type="text"
                value={settings.phone1}
                onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Phone Line 2</label>
              <input
                type="text"
                value={settings.phone2}
                onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Phone Line 3</label>
              <input
                type="text"
                value={settings.phone3}
                onChange={(e) => setSettings({ ...settings, phone3: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Store Operating Hours</label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 2. Regional Delivery Rates */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#0B1F3A] flex items-center gap-2">
            <Building className="w-5 h-5 text-[#C9A227]" />
            Tiered Nigerian Delivery Rates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Lagos State (₦)</label>
              <input
                type="number"
                value={settings.deliveryLagos}
                onChange={(e) => setSettings({ ...settings, deliveryLagos: Number(e.target.value) })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">South-West States (₦)</label>
              <input
                type="number"
                value={settings.deliverySouthWest}
                onChange={(e) => setSettings({ ...settings, deliverySouthWest: Number(e.target.value) })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Nationwide All 36 States (₦)</label>
              <input
                type="number"
                value={settings.deliveryNationwide}
                onChange={(e) => setSettings({ ...settings, deliveryNationwide: Number(e.target.value) })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3. GTBank Details */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#0B1F3A] flex items-center gap-2">
            <Building className="w-5 h-5 text-[#C9A227]" />
            Corporate Bank Transfer Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={settings.bankName}
                onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Account Name</label>
              <input
                type="text"
                value={settings.bankAccountName}
                onChange={(e) => setSettings({ ...settings, bankAccountName: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={settings.bankAccountNumber}
                onChange={(e) => setSettings({ ...settings, bankAccountNumber: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#0B1F3A] text-white font-bold text-xs rounded-xl hover:bg-[#164A7A] transition flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4 text-[#C9A227]" />
            Save Store Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
