import justLogoTransparent from "@/assets/Just-logo-transparent.png";

export function MobileBrandHeader() {
  return (
    <div className="lg:hidden w-full p-6 flex items-center justify-between border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <img src={justLogoTransparent} alt="ChurchEden" className="w-9 h-9 object-contain" />
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, color: '#1a1a1a' }}>
          ChurchEden
        </span>
      </div>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(0, 0, 0, 0.5)' }}>
        Church Management, Simplified
      </p>
    </div>
  );
}
