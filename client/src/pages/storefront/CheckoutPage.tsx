import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { CheckCircle2, ChevronRight, Lock } from 'lucide-react';

const nigerianStates =
  'Abia.Adamawa.Akwa Ibom.Anambra.Bauchi.Bayelsa.Benue.Borno.Cross River.Delta.Ebonyi.Edo.Ekiti.Enugu.FCT Abuja.Gombe.Imo.Jigawa.Kaduna.Kano.Katsina.Kebbi.Kogi.Kwara.Lagos.Nasarawa.Niger.Ogun.Ondo.Osun.Oyo.Plateau.Rivers.Sokoto.Taraba.Yobe.Zamfara'.split(
    '.'
  );

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
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryCost =
    form.delivery === 'pickup' ? 0 : form.delivery === 'express' ? 4500 : 2000;
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
      const orderData = {
        userId: user?.id,
        customerName: form.fullName,
        customerEmail: form.email,
        customerPhone: form.phone,
        deliveryZone: form.delivery === 'pickup' ? 'PICKUP' : form.state === 'Lagos' ? 'LAGOS' : 'NATIONWIDE',
        deliveryState: form.delivery === 'pickup' ? 'Lagos' : form.state,
        deliveryCity: form.delivery === 'pickup' ? 'Mushin' : form.city,
        deliveryAddress:
          form.delivery === 'pickup'
            ? 'Store Pickup: 2, Amu Street, Mushin Market, Lagos'
            : form.address,
        paymentMethod:
          form.payment === 'paystack'
            ? 'PAYSTACK'
            : form.payment === 'pod'
            ? 'PAY_ON_DELIVERY'
            : 'BANK_TRANSFER',
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          sku: i.product.sku || 'SKU',
          unitPrice: i.product.price,
          quantity: i.quantity,
        })),
      };

      const result = await api.createOrder(orderData);
      setCreatedOrderNumber(result.orderNumber);
      setSubmitted(true);
      clearCart();
    } catch (err: any) {
      alert(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h2 className="font-serif text-2xl text-[#0B1F3A] font-semibold mb-2">
          Order Placed Successfully
        </h2>
        {createdOrderNumber && (
          <p className="text-xs font-mono font-bold text-[#C9A227] mb-2">
            Order Reference: {createdOrderNumber}
          </p>
        )}
        <p className="text-[#6B7280] text-sm leading-relaxed mb-7">
          Thank you for your order. We'll contact you shortly on WhatsApp / Phone to confirm delivery details.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white font-semibold text-sm px-6 py-3 hover:bg-[#164A7A] transition-colors"
          >
            Continue Shopping
          </Link>
          {createdOrderNumber && (
            <Link
              to={`/orders/${createdOrderNumber}`}
              className="inline-flex items-center gap-2 border border-[#0B1F3A] text-[#0B1F3A] font-semibold text-sm px-6 py-3 hover:bg-[#0B1F3A]/5 transition-colors"
            >
              Track Order
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h2 className="font-serif text-2xl text-[#0B1F3A] font-semibold mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#6B7280] text-sm mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white font-semibold text-sm px-6 py-3 hover:bg-[#164A7A] transition-colors"
        >
          Browse Products
        </Link>
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
          <div className="bg-white border border-[#E5E7EB] p-6">
            <h2 className="font-serif text-base text-[#0B1F3A] font-semibold mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              {[
                {
                  id: 'transfer',
                  title: 'Direct Bank Transfer / POS',
                  desc: 'Transfer directly to our M.O.B EKI VENTURES bank account. Order confirmed immediately after payment.',
                },
                {
                  id: 'paystack',
                  title: 'Debit Card / Paystack',
                  desc: 'Secure instant checkout via Mastercard, Visa, Verve or USSD.',
                },
                {
                  id: 'pod',
                  title: 'Pay on Delivery (Lagos Only)',
                  desc: 'Cash or POS on delivery for Lagos mainland & island orders.',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-colors ${
                    form.payment === opt.id
                      ? 'border-[#0B1F3A] bg-[#0B1F3A]/5'
                      : 'border-[#E5E7EB] hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={form.payment === opt.id}
                    onChange={() => handleChange('payment', opt.id)}
                    className="accent-[#0B1F3A] mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#171A1F]">{opt.title}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
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
