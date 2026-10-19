import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import {
  CheckCircle2,
  ChevronRight,
  Lock,
  Copy,
  Check,
  Building2,
  Clock,
  AlertCircle,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

const nigerianStates =
  'Abia.Adamawa.Akwa Ibom.Anambra.Bauchi.Bayelsa.Benue.Borno.Cross River.Delta.Ebonyi.Edo.Ekiti.Enugu.FCT Abuja.Gombe.Imo.Jigawa.Kaduna.Kano.Katsina.Kebbi.Kogi.Kwara.Lagos.Nasarawa.Niger.Ogun.Ondo.Osun.Oyo.Plateau.Rivers.Sokoto.Taraba.Yobe.Zamfara'.split(
    '.'
  );

const southWestStates = ['Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    state: 'Lagos',
    city: '',
    address: '',
    delivery: 'standard', // standard | express | pickup
    payment: 'transfer', // transfer | paystack | pod
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [settings, setSettings] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idempotencyKey] = useState(
    () => 'mob-idem-' + Math.random().toString(36).substring(2) + '-' + Date.now()
  );

  useEffect(() => {
    api
      .getSettings()
      .then((data) => setSettings(data.settings))
      .catch(() => {});
  }, []);

  const isPickup = form.delivery === 'pickup';
  const isLagos = form.state === 'Lagos';
  const isSouthWest = southWestStates.includes(form.state);

  const deliveryCost = isPickup
    ? 0
    : isLagos
    ? form.delivery === 'express'
      ? 4500
      : 2000
    : isSouthWest
    ? form.delivery === 'express'
      ? 6000
      : 3500
    : form.delivery === 'express'
    ? 8000
    : 5000;

  const grandTotal = total + (items.length > 0 ? deliveryCost : 0);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (form.delivery !== 'pickup') {
      if (!form.state) errs.state = 'Please select a state';
      if (!form.city.trim()) errs.city = 'City is required';
      if (!form.address.trim()) errs.address = 'Address is required';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setLoading(true);
    try {
      const zone = isPickup
        ? 'PICKUP'
        : isLagos
        ? 'LAGOS'
        : isSouthWest
        ? 'SOUTH_WEST'
        : 'NATIONWIDE';

      const orderData = {
        userId: user?.id,
        customerName: form.fullName.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        deliveryZone: zone,
        deliveryState: isPickup ? 'Lagos' : form.state,
        deliveryCity: isPickup ? 'Mushin' : form.city.trim(),
        deliveryAddress: isPickup
          ? 'Store Pickup: 2, Amu Street, Mushin Market, Lagos'
          : form.address.trim(),
        paymentMethod: 'BANK_TRANSFER',
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          sku: i.product.sku || 'SKU',
          unitPrice: i.product.price,
          quantity: i.quantity,
        })),
      };

      const result = await api.createOrder(orderData, idempotencyKey);
      setCreatedOrder(result);
      setCreatedOrderNumber(result.orderNumber);
      setSubmitted(true);
      clearCart();
    } catch (err: any) {
      alert(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bankName =
    settings?.bankName && settings.bankName !== 'Access Bank' ? settings.bankName : 'OPay';
  const bankAccountName =
    settings?.bankAccountName && settings.bankAccountName !== 'M.O.B EKI VENTURES'
      ? settings.bankAccountName
      : 'Olaide Oladejo';
  const bankAccountNumber =
    settings?.bankAccountNumber && settings.bankAccountNumber !== '1234567890'
      ? settings.bankAccountNumber
      : '8025262598';

  const copyAccountNumber = (accNo: string) => {
    navigator.clipboard.writeText(accNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (submitted && createdOrder) {
    const totalPayable = createdOrder.totalAmount || createdOrder.totalKobo / 100 || grandTotal;

    const whatsappMsg = encodeURIComponent(
      `Hello M.O.B EKI VENTURES, I have placed Order ${createdOrder.orderNumber}.\nCustomer: ${createdOrder.customerName}\nAmount: ₦${totalPayable.toLocaleString()}\nBank Paid To: ${bankName} (${bankAccountNumber} - ${bankAccountName})\nI am sending my transfer receipt for confirmation.`
    );

    const trackingLink = `/orders/${createdOrder.orderNumber}?token=${createdOrder.trackingToken}`;

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-bold">
              Order Registered Successfully!
            </h1>
            <p className="text-sm font-mono font-bold text-[#C9A227]">
              Reference: {createdOrder.orderNumber}
            </p>
          </div>

          {/* Payment Status Notice */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertCircle size={16} className="shrink-0" />
              <span>Status: PENDING PAYMENT (Unpaid Order)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800/90 pl-6">
              Your items are temporarily reserved in our showroom fulfillment queue. To avoid cancellation, please transfer the exact total amount below and notify our team.
            </p>
          </div>

          {/* Official Bank Transfer Details */}
          {createdOrder.paymentMethod === 'BANK_TRANSFER' && (
            <div className="rounded-xl border border-blue-200 bg-gradient-to-b from-blue-50/60 to-white p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-[#0B1F3A]" />
                  <span className="font-serif font-bold text-sm text-[#0B1F3A]">
                    Official Showroom Bank Details
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Clock size={12} />
                  <span>30 Min Reservation</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">Bank</span>
                  <span className="font-bold text-[#0B1F3A] text-sm">{bankName}</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">Account Name</span>
                  <span className="font-bold text-[#0B1F3A] text-sm truncate block">{bankAccountName}</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200 sm:col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Account Number</span>
                    <span className="font-mono font-bold text-base text-[#0B1F3A] tracking-wider">
                      {bankAccountNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyAccountNumber(bankAccountNumber)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1F3A] text-white text-xs font-semibold rounded-md hover:bg-[#164A7A] transition"
                  >
                    {copied ? <Check size={13} className="text-[#C9A227]" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200 sm:col-span-2 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Exact Amount to Transfer:</span>
                  <span className="font-bold text-base text-[#0B1F3A]">₦{totalPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <a
              href={`https://wa.me/2348108725967?text=${whatsappMsg}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#1EBE5D] transition flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle size={16} />
              <span>Send Transfer Receipt on WhatsApp</span>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to={trackingLink}
                className="py-3 px-4 rounded-xl bg-[#0B1F3A] text-white font-bold text-xs hover:bg-[#164A7A] transition flex items-center justify-center gap-2 text-center"
              >
                <span>Track Order (Secure Token)</span>
                <ArrowRight size={14} className="text-[#C9A227]" />
              </Link>
              <Link
                to="/shop"
                className="py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition flex items-center justify-center text-center"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-6">
          <Link to="/" className="hover:text-[#0B1F3A] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/cart" className="hover:text-[#0B1F3A] transition-colors">Cart</Link>
          <ChevronRight size={12} />
          <span className="text-[#0B1F3A] font-semibold">Checkout</span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-[#0B1F3A]/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0B1F3A]">
            <Lock size={28} className="text-[#C9A227]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-semibold mb-2">
            Secure Checkout
          </h1>
          <p className="text-[#6B7280] text-sm max-w-md mx-auto mb-8">
            Your shopping cart is currently empty. Add architectural hardware, hinges, or kitchen accessories from our catalog to complete your order.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B1F3A] text-white font-semibold text-sm px-7 py-3.5 hover:bg-[#164A7A] transition-colors shadow-sm rounded-lg"
            >
              Browse Catalog & Shop
            </Link>
            <Link
              to="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#E5E7EB] text-[#0B1F3A] font-semibold text-sm px-6 py-3.5 hover:bg-gray-50 transition-colors rounded-lg"
            >
              Track Existing Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderField = (
    label: string,
    name: keyof typeof form,
    type = 'text',
    placeholder = ''
  ) => (
    <div>
      <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => handleChange(name, e.target.value)}
        placeholder={placeholder}
        className={`w-full border px-3 py-2.5 text-sm bg-white outline-none transition-colors ${
          errors[name]
            ? 'border-red-400 focus:border-red-500'
            : 'border-[#E5E7EB] focus:border-[#0B1F3A]'
        }`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-8">
        <Link to="/" className="hover:text-[#0B1F3A] transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link to="/cart" className="hover:text-[#0B1F3A] transition-colors">
          Cart
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#6B7280]">Checkout</span>
      </div>

      <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-semibold mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Details */}
          <div className="bg-white border border-[#E5E7EB] p-6">
            <h2 className="font-serif text-base text-[#0B1F3A] font-semibold mb-5">
              Contact & Delivery Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {renderField('Full Name *', 'fullName', 'text', 'Olawale Adebayo')}
              {renderField('Phone Number *', 'phone', 'tel', '0810 872 5967')}
            </div>
            <div className="mb-4">
              {renderField('Email Address *', 'email', 'email', 'name@example.com')}
            </div>

            {form.delivery !== 'pickup' && (
              <>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">
                      State *
                    </label>
                    <select
                      value={form.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className={`w-full border px-3 py-2.5 text-sm bg-white outline-none transition-colors text-[#171A1F] ${
                        errors.state
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-[#E5E7EB] focus:border-[#0B1F3A]'
                      }`}
                    >
                      <option value="">Select State</option>
                      {nigerianStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                    )}
                  </div>
                  {renderField('City / Town *', 'city', 'text', 'e.g. Ikeja / Surulere')}
                </div>
                <div>
                  {renderField('Street Address *', 'address', 'text', 'e.g. 15 Commercial Avenue')}
                </div>
              </>
            )}
          </div>

          {/* Delivery Method */}
          <div className="bg-white border border-[#E5E7EB] p-6">
            <h2 className="font-serif text-base text-[#0B1F3A] font-semibold mb-4">
              Delivery Method
            </h2>
            <div className="space-y-3">
              {[
                {
                  id: 'standard',
                  title: 'Standard Nationwide Delivery',
                  desc: 'Delivered within 3–5 business days',
                  price: '₦2,000',
                },
                {
                  id: 'express',
                  title: 'Express Priority Dispatch',
                  desc: 'Delivered within 1–2 business days',
                  price: '₦4,500',
                },
                {
                  id: 'pickup',
                  title: 'Direct Store Pickup',
                  desc: '2, Amu Street, Mushin Market, Lagos (Mon–Sat 8am–5pm)',
                  price: 'Free',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between p-3.5 border cursor-pointer transition-colors ${
                    form.delivery === opt.id
                      ? 'border-[#0B1F3A] bg-[#0B1F3A]/5'
                      : 'border-[#E5E7EB] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      value={opt.id}
                      checked={form.delivery === opt.id}
                      onChange={() => handleChange('delivery', opt.id)}
                      className="accent-[#0B1F3A]"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#171A1F]">{opt.title}</p>
                      <p className="text-xs text-[#6B7280]">{opt.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#0B1F3A]">{opt.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-[#E5E7EB] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-base text-[#0B1F3A] font-semibold">
                Payment Method
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold uppercase tracking-wider rounded-full">
                <AlertCircle size={12} />
                No Pay on Delivery
              </span>
            </div>

            <div className="p-4 border border-[#0B1F3A] bg-[#0B1F3A]/[0.03] rounded-lg space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked
                  readOnly
                  className="accent-[#0B1F3A] mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0B1F3A]">
                    Direct Bank Transfer (Prepayment Required)
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                    We do <strong>not</strong> offer Pay on Delivery. Place your order and transfer the total payable amount to the official account below to validate your dispatch.
                  </p>
                </div>
              </div>

              {/* Official OPay Bank Card */}
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">
                    <Building2 size={15} className="text-[#C9A227]" />
                    <span>Official Payment Account</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Instant Verification
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-[#F7F6F2] rounded border border-gray-200">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                      Bank / Institution
                    </span>
                    <span className="font-bold text-[#0B1F3A] text-sm">{bankName}</span>
                  </div>
                  <div className="p-2.5 bg-[#F7F6F2] rounded border border-gray-200">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                      Account Name
                    </span>
                    <span className="font-bold text-[#0B1F3A] text-sm">{bankAccountName}</span>
                  </div>
                  <div className="p-3 bg-[#F7F6F2] rounded border border-gray-200 sm:col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                        Account Number
                      </span>
                      <span className="font-mono font-bold text-base text-[#0B1F3A] tracking-wider">
                        {bankAccountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyAccountNumber(bankAccountNumber)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1F3A] text-white text-xs font-semibold rounded hover:bg-[#164A7A] transition"
                    >
                      {copied ? <Check size={13} className="text-[#C9A227]" /> : <Copy size={13} />}
                      <span>{copied ? 'Copied!' : 'Copy Account No.'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Column */}
        <div>
          <div className="bg-white border border-[#E5E7EB] p-6 sticky top-24">
            <h2 className="font-serif text-base text-[#0B1F3A] font-semibold mb-5">
              Order Summary
            </h2>
            <div className="divide-y divide-[#E5E7EB] max-h-60 overflow-y-auto mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex-1 pr-2">
                    <p className="font-medium text-[#171A1F] line-clamp-1">{product.name}</p>
                    <p className="text-[#6B7280]">Qty: {quantity}</p>
                  </div>
                  <span className="font-semibold text-[#0B1F3A]">
                    ₦{(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm pb-5 border-t border-b border-[#E5E7EB] pt-4">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Subtotal</span>
                <span className="font-medium text-[#171A1F]">₦{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Delivery</span>
                <span className="font-medium text-[#171A1F]">
                  {deliveryCost === 0 ? 'Free' : `₦${deliveryCost.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between py-4 text-base font-semibold text-[#0B1F3A]">
              <span>Total</span>
              <span>₦{grandTotal.toLocaleString()}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B1F3A] text-white font-semibold text-sm py-3.5 hover:bg-[#164A7A] transition-colors flex items-center justify-center gap-2"
            >
              <Lock size={14} />
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
