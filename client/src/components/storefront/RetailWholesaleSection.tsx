import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface RetailWholesaleProps {
  whatsappNumber?: string;
}

export default function RetailWholesaleSection({
  whatsappNumber = '2348108725967',
}: RetailWholesaleProps) {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section className="bg-[#0B1F3A] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-white/15 p-8 lg:p-10 bg-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-[#C9A227] tracking-[0.2em] uppercase font-medium">
                Individual Orders
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold mt-2 mb-3">
                Retail Customers
              </h3>
              <p className="text-white/75 text-sm leading-relaxed mb-6">
                Looking to upgrade or complete a single project? Browse our full catalogue with no minimum order.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#C9A227] hover:text-white transition-colors"
            >
              Shop Retail <ChevronRight size={14} />
            </Link>
          </div>
          <div className="border border-white/15 p-8 lg:p-10 bg-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-[#C9A227] tracking-[0.2em] uppercase font-medium">
                Business & Bulk
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold mt-2 mb-3">
                Wholesale
              </h3>
              <p className="text-white/75 text-sm leading-relaxed mb-6">
                Stock up for your furniture business or larger projects. Contact us for bulk pricing and wholesale enquiries.
              </p>
            </div>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#C9A227] hover:text-white transition-colors"
            >
              Contact Us <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
