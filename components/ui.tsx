import Link from "next/link";
import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="SupplierDrop home" className={className}>
      <Image src="/logo.png" alt="SupplierDrop" width={130} height={26} priority className="h-[26px] w-auto" />
    </Link>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6z" />
      <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3C3.7 21.4 7.5 24 12 24z" />
      <path fill="#FBBC05" d="M5.6 14.7a7.2 7.2 0 0 1 0-4.6v-3H1.8a12 12 0 0 0 0 10.6z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.2 15.1 0 12 0 7.5 0 3.7 2.6 1.8 6.4l3.8 3c.9-2.7 3.4-4.6 6.4-4.6z" />
    </svg>
  );
}

// Reusable branded panel used on the auth pages.
export function AuthBrandPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative hidden overflow-hidden bg-[linear-gradient(150deg,#111111_0%,#20140F_55%,#3A1C10_100%)] p-14 text-white lg:flex lg:flex-col lg:justify-center">
      <div aria-hidden className="absolute -right-24 -top-36 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,106,61,0.55),transparent_70%)] blur-xl" />
      <div aria-hidden className="absolute -bottom-40 -left-28 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(255,139,94,0.3),transparent_70%)] blur-xl" />
      <div className="relative max-w-md">{children}</div>
    </div>
  );
}
