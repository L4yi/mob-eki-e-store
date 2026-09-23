import React, { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-[#F8F8F6] border-t border-[#E5E7EB] py-14">
      <div className="max-w-md mx-auto px-4 sm:px-6 text-center">
        <h3 className="font-serif text-lg text-[#0B1F3A] font-semibold mb-1">
          Stay updated
        </h3>
        <p className="text-[#6B7280] text-sm mb-5">
          Get updates about new products, offers and availability.
        </p>
        {subscribed ? (
          <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 py-2.5 px-4 border border-emerald-200">
            Thank you for subscribing!
          </p>
        ) : (
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0B1F3A] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#0B1F3A] text-white font-semibold text-sm px-5 py-2.5 hover:bg-[#164A7A] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
