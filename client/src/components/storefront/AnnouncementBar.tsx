import React from 'react';

interface AnnouncementBarProps {
  announcementText?: string;
  phone?: string;
  whatsapp?: string;
}

export default function AnnouncementBar({
  announcementText = 'Nationwide delivery available · Retail & wholesale orders welcome',
}: AnnouncementBarProps) {
  return (
    <div className="w-full bg-[#0B1F3A] text-white text-xs py-2 px-4 text-center tracking-wide font-medium">
      {announcementText}
    </div>
  );
}
