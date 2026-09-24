import Image from "next/image";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Image
        src="/rasikh-logo.png"
        alt="شعار منصة أ/ عمرو موسى"
        width={compact ? 48 : 58}
        height={compact ? 55 : 63}
        priority
        style={{ objectFit: "contain", width: compact ? 48 : 58, height: compact ? 55 : 63 }}
      />
      {!compact && (
        <div>
          <div style={{ fontWeight: 900, fontSize: 18, color: "#18233d" }}>منصة أ/ عمرو موسى</div>
          <div style={{ fontSize: 11, color: "#7a8497", marginTop: 2 }}>تعلم اللغة العربية بطريقة منظمة</div>
        </div>
      )}
    </div>
  );
}
