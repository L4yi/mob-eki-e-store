import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, CreditCard, Clock, Phone, MapPin, ChevronRight, FileText } from 'lucide-react';

type TabKey = 'shipping' | 'returns' | 'payment' | 'privacy';

interface PolicyPageProps {
  initialTab?: TabKey;
}

export default function PolicyPage({ initialTab }: PolicyPageProps) {
  const location = useLocation();

  const getTabFromPath = (): TabKey => {
    if (initialTab) return initialTab;
    const path = location.pathname.toLowerCase();
    if (path.includes('terms') || path.includes('payment')) return 'payment';
    if (path.includes('privacy')) return 'privacy';
    if (path.includes('returns')) return 'returns';
    if (path.includes('shipping') || path.includes('delivery')) return 'shipping';
    
    // Check search query ?tab=xxx
    const searchParams = new URLSearchParams(location.search);
    const tabQuery = searchParams.get('tab') as TabKey;
    if (tabQuery && ['shipping', 'returns', 'payment', 'privacy'].includes(tabQuery)) {
      return tabQuery;
    }
    return 'shipping';
  };

  const [activeTab, setActiveTab] = useState<TabKey>(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search, initialTab]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Hero Header */}
      <div className="bg-[#0B1F3A] text-white py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C9A227] uppercase mb-3">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight size={13} />
            <span>Store Policies & Legal Information</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-3">
            Policies, Delivery & Terms
          </h1>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-2xl leading-relaxed">
            Transparent operational standards for hardware deliveries across Nigeria, stock reservations, product guarantees, and customer data protection.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar gap-2 sm:gap-4 mb-8 bg-white p-2 rounded-xl shadow-sm border">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'shipping'
                ? 'bg-[#0B1F3A] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Truck size={17} className={activeTab === 'shipping' ? 'text-[#C9A227]' : 'text-gray-400'} />
            Shipping & Nationwide Delivery
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'returns'
                ? 'bg-[#0B1F3A] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <RotateCcw size={17} className={activeTab === 'returns' ? 'text-[#C9A227]' : 'text-gray-400'} />
            Returns, Exchanges & Warranty
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'payment'
                ? 'bg-[#0B1F3A] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <CreditCard size={17} className={activeTab === 'payment' ? 'text-[#C9A227]' : 'text-gray-400'} />
            Payment & Stock Reservation
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'privacy'
                ? 'bg-[#0B1F3A] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck size={17} className={activeTab === 'privacy' ? 'text-[#C9A227]' : 'text-gray-400'} />
            Privacy Policy (NDPR)
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 text-gray-700 leading-relaxed space-y-8">
          {/* TAB 1: SHIPPING & DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C9A227] uppercase mb-1">
                  Fulfilment & Waybill
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#0B1F3A]">
                  Shipping & Nationwide Delivery Policy
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#F8F9FA] p-5 rounded-xl border border-gray-200/80">
                  <div className="flex items-center gap-2 font-bold text-[#0B1F3A] text-sm mb-2">
                    <MapPin size={16} className="text-[#C9A227]" />
                    Lagos Showroom Pickup (100% Free)
                  </div>
                  <p className="text-xs text-gray-600">
                    Customers can pick up verified orders at our main store: <strong>Shop 8, Alhaja Abibatu Mogaji Modern Market, Mushin, Lagos State</strong>. Available Monday through Saturday, 8:00 AM to 6:00 PM.
                  </p>
                </div>

                <div className="bg-[#F8F9FA] p-5 rounded-xl border border-gray-200/80">
                  <div className="flex items-center gap-2 font-bold text-[#0B1F3A] text-sm mb-2">
                    <Truck size={16} className="text-[#C9A227]" />
                    Nationwide Park Waybill Delivery
                  </div>
                  <p className="text-xs text-gray-600">
                    We deliver across all 36 States + FCT Abuja via verified interstate logistics parks (ABC Transport, Peace Mass, Young Shall Grow, GIGL, GUO). Delivery fees are calculated dynamically based on regional delivery zone.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">1. Order Processing Timeframes</h3>
                <p className="text-sm">
                  Orders submitted and confirmed with verified payment before <strong>1:00 PM (West Africa Time)</strong> are prepped and packaged the same business day. Orders placed after 1:00 PM or on Sundays/Public Holidays are processed the next business day.
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1.5 text-gray-600">
                  <li><strong>Lagos Intra-State Delivery:</strong> Typically arrives within 24 to 48 hours of dispatch.</li>
                  <li><strong>South-West States (Ogun, Oyo, Osun, Ondo, Ekiti):</strong> 1 to 2 business days.</li>
                  <li><strong>Interstate & Far Regions (Abuja, Port Harcourt, Kano, Enugu, etc.):</strong> 2 to 4 business days depending on transit hub schedule.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">2. Delivery Fee Calculation</h3>
                <p className="text-sm">
                  Delivery costs are computed automatically at checkout based on your selected destination state. For exceptionally bulky or heavy wholesale cargo (such as full-truck door shipments), our logistics desk may contact you to confirm park drop-off terms.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">3. Delivery Inspection & Acceptance</h3>
                <p className="text-sm">
                  Upon receiving or collecting your package from the courier or interstate park driver, please inspect the external packaging before signing delivery manifests. In the rare event of transit damage or missing cartons, immediately take photos and notify our WhatsApp support desk at <strong>+234 810 872 5967</strong> within 24 hours.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: RETURNS & EXCHANGES */}
          {activeTab === 'returns' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C9A227] uppercase mb-1">
                  Quality Assurance
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#0B1F3A]">
                  Returns, Exchanges & Warranty Policy
                </h2>
              </div>

              <p className="text-sm">
                At M.O.B EKI VENTURES, we take pride in distributing premier architectural fittings, security mortise locks, cabinet hardware, and heavy-duty doors. If an item does not meet your specifications, we offer a straightforward <strong>7-Day Return & Exchange Window</strong> from the date of physical receipt.
              </p>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">1. Eligibility for Returns & Exchanges</h3>
                <ul className="list-disc pl-5 text-sm space-y-2 text-gray-600">
                  <li>
                    <strong>Unused & Uninstalled:</strong> Hardware (handles, hinges, drawer slides, rim locks) must not have been drilled, painted, or installed onto joinery or masonry.
                  </li>
                  <li>
                    <strong>Original Packaging:</strong> Products must be returned in their original boxes, along with all fixing screws, spindles, keys, and installation templates.
                  </li>
                  <li>
                    <strong>Doors & Finished Woodwork:</strong> Authentic luxury doors (such as Turkish security doors and laminate interior doors) must be inspected prior to drilling holes for lock mortises or hanging onto frames. Once altered, cut, or planed, doors cannot be returned.
                  </li>
                  <li>
                    <strong>Proof of Purchase:</strong> A valid order reference (e.g. <code>MOB-2026-XXXX</code>) or receipt is required.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">2. Defective or Damaged Products</h3>
                <p className="text-sm">
                  If an item is determined to suffer from a manufacturing defect (e.g., seized lock cylinder, stripped screw thread from factory, defective hydraulic damper), we will replace the item at zero additional cost or provide an immediate refund.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">3. Return Process & Refund Timelines</h3>
                <ol className="list-decimal pl-5 text-sm space-y-2 text-gray-600">
                  <li>Contact our customer care line on WhatsApp at <strong>+234 810 872 5967</strong> with your order ID and pictures of the item.</li>
                  <li>Our logistics team will verify return authorization and provide the dispatch address or showroom intake slip.</li>
                  <li>Upon receipt and physical inspection at our Mushin warehouse, approved refunds are transferred directly to your bank account within <strong>3 business days</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT & STOCK RESERVATION */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C9A227] uppercase mb-1">
                  Orders & Commercial Terms
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#0B1F3A]">
                  Payment, Stock Reservation & Cancellation Policy
                </h2>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl text-amber-900 text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-base">
                  <Clock size={18} className="text-amber-700" />
                  30-Minute Temporary Stock Reservation
                </div>
                <p className="text-xs leading-relaxed text-amber-800">
                  When you place an order on the storefront, inventory is temporarily reserved for <strong>30 minutes</strong>. This holds your items against other buyers while you initiate your bank transfer. If payment is unconfirmed after the hold period, stock may be automatically released back to the general catalog.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">1. Accepted Payment Channels (No Pay on Delivery)</h3>
                <p className="text-sm">
                  M.O.B EKI VENTURES operates a strict <strong>No Pay on Delivery</strong> policy. All online and dispatch orders require prepayment via direct bank transfer to our official account below before goods leave our Mushin warehouse (or payment at our Mushin showroom counter for in-store pickup).
                </p>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm font-mono text-gray-800 space-y-1">
                  <div><strong>Bank:</strong> OPay</div>
                  <div><strong>Account Name:</strong> Olaide Oladejo</div>
                  <div><strong>Account Number:</strong> 8025262598</div>
                  <div><strong>Showroom Address:</strong> 2, Amu Street, Mushin Market (Shop 8, Alhaja Abibatu Mogaji Modern Market), Lagos</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">2. Payment Verification & Narration</h3>
                <p className="text-sm">
                  To ensure rapid matching of your payment, please specify your <strong>Order Number</strong> (e.g. <code>MOB-2026-6976</code>) in your bank app's transfer narration or description field. Once paid, click the <em>"Send Proof on WhatsApp"</em> button or message our accounting line directly.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">3. Order Cancellation Policy</h3>
                <p className="text-sm">
                  You have the right to cancel an unpaid order at any time without penalty using the secure order link generated upon checkout. Once an order is paid and dispatched to an interstate transport park, cancellation requires following our standard Returns procedure.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY POLICY (NDPR) */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C9A227] uppercase mb-1">
                  Data Protection
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#0B1F3A]">
                  Privacy Policy & NDPR Compliance
                </h2>
              </div>

              <p className="text-sm">
                M.O.B EKI VENTURES is dedicated to protecting customer personal data in compliance with the <strong>Nigeria Data Protection Regulation (NDPR)</strong> and international privacy standards.
              </p>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">1. Data We Collect</h3>
                <p className="text-sm">We collect only information necessary to fulfill your hardware orders, deliver packages, and communicate transactional status:</p>
                <ul className="list-disc pl-5 text-sm space-y-1.5 text-gray-600">
                  <li><strong>Identity Information:</strong> Full name, company name (for wholesale and contractors).</li>
                  <li><strong>Contact Details:</strong> Phone number (used for courier delivery calls and WhatsApp status), email address.</li>
                  <li><strong>Delivery Information:</strong> Physical street address, destination city, local government area (LGA), and state.</li>
                  <li><strong>Order History:</strong> Ordered products, quantities, prices, payment status, and order tracking tokens.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">2. Public Tracking PII Safeguards</h3>
                <p className="text-sm">
                  In accordance with strict privacy safeguards, public tracking lookups on our website automatically mask personally identifiable information (e.g., displaying names as <code>J*** D**</code> and phone numbers as <code>+234 810 *** 5967</code>). Only the original order creator with their authenticated session or private tracking token can view full unmasked records.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">3. Non-Disclosure & Third Parties</h3>
                <p className="text-sm">
                  We <strong>never sell, lease, or monetize</strong> your personal contact information to third-party advertising or marketing brokers. Customer delivery details are shared exclusively with trusted logistics personnel and interstate drivers for the sole purpose of delivering your packages.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A]">4. Customer Rights & Data Officer Contact</h3>
                <p className="text-sm">
                  Under the NDPR, you possess the right to request a copy of the data we hold concerning your account, request corrections to erroneous delivery information, or request account deletion. Inquiries may be directed to our data protection desk:
                </p>
                <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-200 text-sm space-y-1">
                  <div><strong>Data Protection Officer:</strong> M.O.B EKI VENTURES Desk</div>
                  <div><strong>Email:</strong> muhazoladejo@gmail.com</div>
                  <div><strong>Phone / WhatsApp:</strong> +234 810 872 5967</div>
                  <div><strong>Physical Address:</strong> Shop 8, Alhaja Abibatu Mogaji Modern Market, Mushin, Lagos, Nigeria</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Contact Card on Every Tab */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-5 rounded-xl">
            <div className="text-xs text-gray-500">
              Need immediate clarification on an order or custom consignment?
            </div>
            <a
              href="https://wa.me/2348108725967"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Phone size={14} /> Contact Logistics Desk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
