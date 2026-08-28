import { useState, FormEvent } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import churchedenFavicon from "@/assets/churcheden_favicon.png";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="w-full bg-[#F8F6F1] py-12 lg:py-16">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        
        {/* Dark Navy Rounded Box */}
        <div
          className="relative overflow-hidden rounded-3xl bg-[#07182F] p-8 sm:p-12 lg:p-16 text-white shadow-xl border border-white/05"
        >
          {/* Watermark Logo Mark in background right */}
          <div className="absolute -right-12 -bottom-12 opacity-[0.06] pointer-events-none">
            <img src={churchedenFavicon} alt="" className="h-80 w-80 sm:h-96 sm:w-96 object-contain" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT SIDE */}
            <div className="lg:col-span-6 flex flex-col items-start">
              {/* Mail Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/05 border border-[#C98A16]/40 text-[#C98A16]">
                <Mail size={22} strokeWidth={1.75} />
              </div>

              {/* Headline */}
              <h2
                className="mb-3 font-serif text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-tight text-[#F7F5F0]"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
              >
                Stay inspired.<br />
                Stay informed.
              </h2>

              {/* Supporting text */}
              <p className="text-sm sm:text-base leading-relaxed text-[#94A3B8] max-w-[440px]">
                Get the latest resources, ministry tips, and product updates
                delivered to your inbox.
              </p>
            </div>

            {/* RIGHT SIDE: Input Form */}
            <div className="lg:col-span-6 flex flex-col items-start lg:items-end">
              {subscribed ? (
                <div className="w-full max-w-[480px] rounded-2xl bg-white/05 border border-[#C98A16]/40 p-6 flex items-center gap-3 text-[#D79A22]">
                  <CheckCircle2 size={24} />
                  <span className="text-sm font-semibold text-white">
                    Thank you for subscribing! Check your inbox soon.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-[480px] flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row items-center gap-2 bg-white rounded-2xl p-1.5 border border-white/20 shadow-lg">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-transparent px-4 py-3 text-sm text-[#162033] placeholder-[#7B8491] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto flex-shrink-0 rounded-xl bg-[#C98A16] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#B97808] active:scale-95"
                    >
                      Subscribe
                    </button>
                  </div>
                  <span className="text-[12px] text-[#7B8491] pl-2">
                    No spam. Unsubscribe anytime.
                  </span>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
