type ProxyDevicePlaceholderProps = {
  title?: string;
  description?: string;
  badge?: string;
};

export default function ProxyDevicePlaceholder({
  title = "Sahara Proxy",
  description = "Companion safety dashboard",
  badge = "Proxy preview",
}: ProxyDevicePlaceholderProps) {
  return (
    <div className="flex h-full w-full flex-col bg-slate-50">
      <div className="border-b bg-white px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {badge}
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Proxy view placeholder
        </h3>
        <p className="max-w-[260px] text-sm text-slate-600">
          This screen will host the family member workflow (Teach / Do) in the
          next step.
        </p>
      </div>
    </div>
  );
}
