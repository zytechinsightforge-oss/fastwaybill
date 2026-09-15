const SETTINGS = [
  {
    section: "Business",
    items: [
      { label: "Company Name", value: "FastWaybill Logistics Ltd", type: "text" },
      { label: "Support Email", value: "support@fastwaybill.ng", type: "text" },
      { label: "Support WhatsApp", value: "+2348100000000", type: "text" },
      { label: "Base Currency", value: "NGN", type: "text" },
    ],
  },
  {
    section: "Pricing",
    items: [
      { label: "Platform Commission (%)", value: "28", type: "number" },
      { label: "Min Ride Fare (₦)", value: "500", type: "number" },
      { label: "Min Dispatch Fare (₦)", value: "600", type: "number" },
      { label: "Surge Multiplier (max)", value: "3.5", type: "number" },
    ],
  },
  {
    section: "Paystack",
    items: [
      { label: "Public Key", value: "pk_test_a8d696328f6017bdc0...", type: "text" },
      { label: "Secret Key", value: "sk_test_••••••••••••••••••••", type: "password" },
      { label: "Webhook URL", value: "https://rbhptfneaqmfvdoafehq.supabase.co/functions/v1/make-server-a0892b1f/webhook/paystack", type: "text" },
    ],
  },
  {
    section: "Termii (SMS)",
    items: [
      { label: "API Key", value: "tlv_QH12861ZhD_Pw••••••••", type: "password" },
      { label: "Sender ID", value: "2347080690690", type: "text" },
    ],
  },
];

export default function AdminSettings() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm mt-1" style={{ color: "#BAD8F7", opacity: 0.5 }}>Platform configuration and API keys</p>
      </div>

      {SETTINGS.map(group => (
        <div key={group.section} className="rounded-2xl overflow-hidden" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(186,216,247,0.06)" }}>
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#BAD8F7", opacity: 0.5, fontFamily: "JetBrains Mono, monospace" }}>{group.section}</p>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(186,216,247,0.04)" }}>
            {group.items.map(item => (
              <div key={item.label} className="flex items-center justify-between px-6 py-4">
                <p className="text-sm text-white">{item.label}</p>
                <input
                  type={item.type}
                  defaultValue={item.value}
                  className="text-sm px-3 py-1.5 rounded-lg outline-none text-right w-64"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(186,216,247,0.08)", color: item.type === "password" ? "#BAD8F799" : "#F5820D", fontFamily: "JetBrains Mono, monospace" }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "#F5820D" }}>
        Save Changes
      </button>
    </div>
  );
}
