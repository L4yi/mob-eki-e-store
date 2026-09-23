import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../storefront/AnnouncementBar';
import Navbar from '../storefront/Navbar';
import Footer from '../storefront/Footer';
import CartDrawer from '../storefront/CartDrawer';
import { api } from '../../lib/api';
import { BusinessSettings } from '../../types';

export default function StorefrontLayout() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    api.getSettings().then((data) => setSettings(data.settings)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6] text-[#171A1F]">
      <AnnouncementBar
        announcementText={settings?.announcementText}
        phone={settings?.phone1}
        whatsapp={settings?.whatsapp}
      />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <CartDrawer />
      <Footer settings={settings || undefined} />
    </div>
  );
}
