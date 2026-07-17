// Shared content/data for SupplierDrop pages.

export type Feature = { title: string; body: string; icon: string };
export const features: Feature[] = [
  { icon: "Zap", title: "One-Click Product Import", body: "Push any product to your Shopify store in under a second — images, variants, and descriptions included." },
  { icon: "RefreshCw", title: "Automatic Inventory Sync", body: "Stock levels update in real time across every supplier, so you never oversell again." },
  { icon: "Clock", title: "Real-Time Price Updates", body: "Supplier price changes flow straight to your store with margin rules you control." },
  { icon: "Truck", title: "Fast Worldwide Shipping", body: "Vetted warehouses in the US, EU, and Asia deliver in 3–8 days — not 30." },
  { icon: "Package", title: "Private Label Services", body: "Add your branding to packaging, inserts, and products — build a real brand, not a reseller shop." },
  { icon: "Settings", title: "Order Automation", body: "Orders route to the right supplier and get fulfilled automatically, with tracking pushed back to the customer." },
  { icon: "BarChart3", title: "Analytics Dashboard", body: "Profit, margin, and best-seller insights per product — know exactly what to scale." },
  { icon: "Users", title: "Supplier Management", body: "Every supplier is verified, rated, and monitored — with response times you can see upfront." },
  { icon: "Sparkles", title: "AI Product Research", body: "Our models scan demand signals across the web to surface winning products before they trend." },
];

export const steps = [
  { n: 1, title: "Browse Products", body: "Explore 50,000+ vetted products with real margin and demand data." },
  { n: 2, title: "Connect Shopify", body: "One secure OAuth connection — no code, no CSV files, no headaches." },
  { n: 3, title: "Import Products", body: "Click import. Images, variants, and pricing land in your store instantly." },
  { n: 4, title: "Start Selling", body: "Orders fulfill automatically while you focus on marketing and growth." },
];

export type Product = { name: string; margin: string; shipping: string; rating: string; supplier: string };
export const products: Product[] = [
  { name: "Aura Desk Lamp", margin: "68%", shipping: "4–6 days", rating: "4.9", supplier: "Lumina Co." },
  { name: "Flow Water Bottle", margin: "61%", shipping: "3–5 days", rating: "4.8", supplier: "HydraWorks" },
  { name: "Nomad Card Wallet", margin: "72%", shipping: "5–8 days", rating: "4.9", supplier: "Craft&Co" },
  { name: "Halo Ring Light", margin: "58%", shipping: "4–7 days", rating: "4.7", supplier: "Lumina Co." },
];

export const testimonials = [
  { initials: "MR", name: "Maya Rodriguez", role: "Founder, Veloura · $2.1M/yr", quote: "We replaced three tools with SupplierDrop. Import is genuinely one click, and inventory sync just… works. Our oversell rate went to zero.", tint: "#FFF1EA", fg: "#FF6A3D" },
  { initials: "DK", name: "Dan Kim", role: "Owner, Kubo Living", quote: "Shipping times dropped from 24 days to 5 with their US warehouses. Refund requests are down 80%. That alone paid for the subscription.", tint: "#EFF6FF", fg: "#2563EB" },
  { initials: "IP", name: "Ines Petit", role: "CEO, Fern&Fog", quote: "The AI research surfaced a product that's now 40% of our revenue. It flagged the trend three weeks before we saw it anywhere else.", tint: "#ECFDF3", fg: "#16A34A" },
];

export const faqs = [
  { q: "How does the Shopify integration work?", a: "You connect your store through Shopify's official OAuth flow — no code or CSV files. Once connected, products, inventory, and orders sync automatically in both directions in real time." },
  { q: "Do I need inventory or upfront investment?", a: "No. You only pay for products after a customer orders them. Suppliers hold the stock, and our platform routes each order to the right warehouse automatically." },
  { q: "How fast is shipping, really?", a: "Products stocked in our US and EU warehouses deliver in 3–8 business days. Every product card shows the actual shipping time for your customers' regions before you import it." },
  { q: "Can I use my own branding?", a: "Yes. Professional and Enterprise plans include private label services: branded packaging, custom inserts, and even custom product modifications with qualifying suppliers." },
  { q: "What happens if a supplier runs out of stock?", a: "Inventory syncs in real time, so the product is automatically marked unavailable in your store before an oversell can happen. You can also set backup suppliers for critical products." },
  { q: "Can I cancel anytime?", a: "Yes. All plans are month-to-month with no lock-in. If you cancel, your imported products stay in your Shopify store — they're yours." },
];

export const orders = [
  { id: "#10482", customer: "Maya R.", product: "Aura Desk Lamp", supplier: "Lumina Co.", total: "$64.00", status: "Shipped" },
  { id: "#10481", customer: "Dan K.", product: "Flow Water Bottle", supplier: "HydraWorks", total: "$29.00", status: "Packing" },
  { id: "#10480", customer: "Ines P.", product: "Nomad Card Wallet", supplier: "Craft&Co", total: "$38.00", status: "Delivered" },
  { id: "#10479", customer: "Leo M.", product: "Halo Ring Light", supplier: "Lumina Co.", total: "$52.00", status: "In transit" },
  { id: "#10478", customer: "Ada W.", product: "Aura Desk Lamp", supplier: "Lumina Co.", total: "$64.00", status: "Delivered" },
];

export const statusStyles: Record<string, string> = {
  Shipped: "bg-[#ECFDF3] text-[#16A34A]",
  Delivered: "bg-[#ECFDF3] text-[#16A34A]",
  Packing: "bg-[#FFF7E6] text-[#B45309]",
  "In transit": "bg-[#EFF6FF] text-[#2563EB]",
};
