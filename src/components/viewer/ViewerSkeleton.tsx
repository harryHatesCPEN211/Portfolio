export function ViewerSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0f0b] rounded-card">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full border-2 border-accent/40 border-t-accent-light animate-spin" />
        <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">
          Loading model
        </p>
      </div>
    </div>
  );
}
