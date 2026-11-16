import Image from "next/image";
import type { ReactNode } from "react";
export default function PhoneMockup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={"phone-mockup " + className}>
      <div className="phone-mockup-screen">{children}</div>
      <Image
        className="phone-mockup-frame"
        loading="eager"
        src="/collection/assets/iphone-mockup-20260921.webp"
        alt=""
        aria-hidden="true"
        width={612}
        height={1258}
        sizes="(max-width: 600px) 60vw, 320px"
      />
    </div>
  );
}
