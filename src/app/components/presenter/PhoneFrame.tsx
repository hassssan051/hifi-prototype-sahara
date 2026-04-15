import type { PropsWithChildren } from "react";

export default function PhoneFrame({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto w-full max-w-[430px]">
      <div className="rounded-[2.5rem] bg-slate-900 p-2 shadow-2xl ring-1 ring-black/25">
        <div className="relative aspect-[393/852] w-full overflow-hidden rounded-[2rem] bg-black">
          <div className="relative z-10 h-full w-full bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
}
