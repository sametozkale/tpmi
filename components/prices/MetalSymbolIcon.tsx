import type { ReactNode } from "react";
import type { MetalSymbol } from "@/types/metals";

interface MetalSymbolIconProps {
  symbol: MetalSymbol;
  size?: number;
}

function Base({ children, size }: { children: ReactNode; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function MetalSymbolIcon({ symbol, size = 32 }: MetalSymbolIconProps) {
  switch (symbol) {
    case "XAU":
      return (
        <Base size={size}>
          <path d="M4.5 10.2L12 6.6L19.5 10.2L12 13.8L4.5 10.2Z" fill="#E8C978" stroke="#C1943F" strokeWidth="1.5" />
          <path d="M4.5 10.2V18.7L12 22.3V13.8L4.5 10.2Z" fill="#D7B060" stroke="#C1943F" strokeWidth="1.5" />
          <path d="M12 13.8V22.3L19.5 18.7V10.2L12 13.8Z" fill="#CA9A46" stroke="#C1943F" strokeWidth="1.5" />
          <ellipse cx="23.8" cy="12.8" rx="4.2" ry="2" fill="#EED18A" stroke="#C69C4D" strokeWidth="1.3" />
          <path d="M19.6 12.8V19.2C19.6 20.3 21.5 21.2 23.8 21.2C26.1 21.2 28 20.3 28 19.2V12.8" fill="#D9B96E" stroke="#C69C4D" strokeWidth="1.3" />
          <ellipse cx="23.8" cy="19.2" rx="4.2" ry="2" fill="#CAA252" stroke="#C69C4D" strokeWidth="1.3" />
        </Base>
      );
    case "XAG":
      return (
        <Base size={size}>
          <ellipse cx="10.4" cy="9.2" rx="5.9" ry="2.6" fill="#DDE3EB" stroke="#96A3B4" strokeWidth="1.4" />
          <path d="M4.5 9.2V17.3C4.5 18.8 7.1 20 10.4 20C13.7 20 16.3 18.8 16.3 17.3V9.2" fill="#C7D1DE" stroke="#96A3B4" strokeWidth="1.4" />
          <ellipse cx="10.4" cy="17.3" rx="5.9" ry="2.6" fill="#E8EDF3" stroke="#96A3B4" strokeWidth="1.4" />
          <ellipse cx="22.6" cy="13" rx="4.9" ry="2.2" fill="#DDE3EB" stroke="#96A3B4" strokeWidth="1.3" />
          <path d="M17.7 13V19C17.7 20.3 19.9 21.3 22.6 21.3C25.3 21.3 27.5 20.3 27.5 19V13" fill="#C7D1DE" stroke="#96A3B4" strokeWidth="1.3" />
          <ellipse cx="22.6" cy="19" rx="4.9" ry="2.2" fill="#E8EDF3" stroke="#96A3B4" strokeWidth="1.3" />
        </Base>
      );
    case "XPT":
      return (
        <Base size={size}>
          <path d="M16 4.8L24.2 9.6V18.9L16 23.7L7.8 18.9V9.6L16 4.8Z" fill="#B5C0CC" stroke="#738396" strokeWidth="1.5" />
          <path d="M7.8 9.6L16 14.3L24.2 9.6" stroke="#738396" strokeWidth="1.25" />
          <path d="M16 14.3V23.7" stroke="#738396" strokeWidth="1.25" />
          <path d="M11.9 7.2L20.1 12" stroke="#90A0B3" strokeWidth="1.1" />
        </Base>
      );
    case "XPD":
      return (
        <Base size={size}>
          <path d="M7.5 10.4L15.8 6.5L24.1 10.4L15.8 14.3L7.5 10.4Z" fill="#C3CBDA" stroke="#808DA2" strokeWidth="1.5" />
          <path d="M7.5 10.4V19.4L15.8 23.3V14.3L7.5 10.4Z" fill="#AEB9CB" stroke="#808DA2" strokeWidth="1.5" />
          <path d="M15.8 14.3V23.3L24.1 19.4V10.4L15.8 14.3Z" fill="#9AA9BF" stroke="#808DA2" strokeWidth="1.5" />
          <circle cx="25.8" cy="22.4" r="2.7" fill="#D1D8E5" stroke="#808DA2" strokeWidth="1.2" />
        </Base>
      );
    case "RH":
      return (
        <Base size={size}>
          <path d="M16 5.2L23.3 11.9L16 26.8L8.7 11.9L16 5.2Z" fill="#D3D5DC" stroke="#8F939D" strokeWidth="1.5" />
          <path d="M8.7 11.9H23.3" stroke="#8F939D" strokeWidth="1.2" />
          <path d="M16 5.2V26.8" stroke="#8F939D" strokeWidth="1.2" />
        </Base>
      );
    case "IR":
      return (
        <Base size={size}>
          <path d="M8.5 10.3L16 6.7L23.5 10.3L16 13.9L8.5 10.3Z" fill="#BCC7D7" stroke="#7486A1" strokeWidth="1.5" />
          <path d="M8.5 10.3V18.9L16 22.5V13.9L8.5 10.3Z" fill="#A7B5C9" stroke="#7486A1" strokeWidth="1.5" />
          <path d="M16 13.9V22.5L23.5 18.9V10.3L16 13.9Z" fill="#8D9FB8" stroke="#7486A1" strokeWidth="1.5" />
        </Base>
      );
    case "RU":
      return (
        <Base size={size}>
          <ellipse cx="16" cy="10.5" rx="8.1" ry="3.2" fill="#B3C6C3" stroke="#738E8A" strokeWidth="1.4" />
          <path d="M7.9 10.5V19.4C7.9 21.3 11.5 22.8 16 22.8C20.5 22.8 24.1 21.3 24.1 19.4V10.5" fill="#9CB2AF" stroke="#738E8A" strokeWidth="1.4" />
          <ellipse cx="16" cy="19.4" rx="8.1" ry="3.2" fill="#C2D1CF" stroke="#738E8A" strokeWidth="1.4" />
        </Base>
      );
    case "OS":
      return (
        <Base size={size}>
          <path d="M9.2 11.2L16 8L22.8 11.2L16 14.5L9.2 11.2Z" fill="#A7B5C8" stroke="#667A93" strokeWidth="1.4" />
          <path d="M9.2 11.2V18.7L16 21.9V14.5L9.2 11.2Z" fill="#8FA1B8" stroke="#667A93" strokeWidth="1.4" />
          <path d="M16 14.5V21.9L22.8 18.7V11.2L16 14.5Z" fill="#778CA7" stroke="#667A93" strokeWidth="1.4" />
          <path d="M22.8 11.2L25.8 12.9V20.4L22.8 18.7V11.2Z" fill="#667A93" stroke="#667A93" strokeWidth="1.1" />
        </Base>
      );
    case "XCU":
      return (
        <Base size={size}>
          <ellipse cx="11" cy="9.3" rx="5.7" ry="2.5" fill="#DDA37E" stroke="#B9714A" strokeWidth="1.4" />
          <path d="M5.3 9.3V17.2C5.3 18.7 7.8 19.9 11 19.9C14.2 19.9 16.7 18.7 16.7 17.2V9.3" fill="#CB8860" stroke="#B9714A" strokeWidth="1.4" />
          <ellipse cx="11" cy="17.2" rx="5.7" ry="2.5" fill="#E8B894" stroke="#B9714A" strokeWidth="1.4" />
          <rect x="19.2" y="11.2" width="8.6" height="8.6" rx="1.8" fill="#D89A72" stroke="#B9714A" strokeWidth="1.3" />
        </Base>
      );
    case "ALI":
      return (
        <Base size={size}>
          <path d="M6.2 19.8L13.4 6.4H18.6L25.8 19.8H20.9L19.4 16.9H12.6L11.1 19.8H6.2Z" fill="#C8D0DB" stroke="#8D9AA9" strokeWidth="1.3" />
          <path d="M13.7 14.8H18.3" stroke="#8D9AA9" strokeWidth="1.1" />
        </Base>
      );
    case "NI":
      return (
        <Base size={size}>
          <path d="M6 7.8H12V24.2H6V7.8Z" fill="#A9B8CB" stroke="#6E819D" strokeWidth="1.3" />
          <path d="M20 7.8H26V24.2H20V7.8Z" fill="#8DA0B8" stroke="#6E819D" strokeWidth="1.3" />
          <path d="M12 10.2L20 21.8V24.2H14V22L6 10.4V7.8H12V10.2Z" fill="#B9C6D6" stroke="#6E819D" strokeWidth="1.1" />
        </Base>
      );
    case "ZN":
      return (
        <Base size={size}>
          <path d="M7.2 8H24.8V11.4L13.3 20.6H24.8V24H7.2V20.6L18.7 11.4H7.2V8Z" fill="#B2BDC9" stroke="#7A8898" strokeWidth="1.2" />
        </Base>
      );
    case "PB":
      return (
        <Base size={size}>
          <path d="M7.5 7.7H17.1C20.8 7.7 23.2 10 23.2 13.3C23.2 16.6 20.8 18.9 17.1 18.9H12V24.3H7.5V7.7Z" fill="#9EA8B6" stroke="#6D7684" strokeWidth="1.2" />
          <path d="M12 11.3H16.2C17.7 11.3 18.6 12.1 18.6 13.3C18.6 14.5 17.7 15.3 16.2 15.3H12V11.3Z" fill="#BBC3CE" stroke="#6D7684" strokeWidth="1" />
        </Base>
      );
    case "SN":
      return (
        <Base size={size}>
          <ellipse cx="11.2" cy="9.5" rx="5.8" ry="2.5" fill="#CBD3DE" stroke="#8E99A8" strokeWidth="1.3" />
          <path d="M5.4 9.5V17.6C5.4 19 7.9 20.2 11.2 20.2C14.5 20.2 17 19 17 17.6V9.5" fill="#B8C4D2" stroke="#8E99A8" strokeWidth="1.3" />
          <ellipse cx="11.2" cy="17.6" rx="5.8" ry="2.5" fill="#D9E0E8" stroke="#8E99A8" strokeWidth="1.3" />
          <path d="M19.3 12.1L27.6 12.1" stroke="#8E99A8" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M19.3 16L27.6 16" stroke="#8E99A8" strokeWidth="2.1" strokeLinecap="round" />
        </Base>
      );
    case "CO":
      return (
        <Base size={size}>
          <circle cx="12.3" cy="16" r="7.3" fill="#88A3C4" stroke="#4F6D93" strokeWidth="1.4" />
          <circle cx="12.3" cy="16" r="3.2" fill="#A8BED8" stroke="#4F6D93" strokeWidth="1.1" />
          <rect x="19.8" y="9.5" width="7.2" height="13" rx="1.8" fill="#6F8FB5" stroke="#4F6D93" strokeWidth="1.2" />
        </Base>
      );
    case "TIO":
      return (
        <Base size={size}>
          <path d="M5.2 21.8L11.5 8.8H20.5L26.8 21.8H5.2Z" fill="#B37D58" stroke="#8C5D3D" strokeWidth="1.3" />
          <path d="M9.8 14.2H22.2" stroke="#8C5D3D" strokeWidth="1.2" />
          <path d="M8.1 17.8H23.9" stroke="#8C5D3D" strokeWidth="1.2" />
        </Base>
      );
    case "HRC":
      return (
        <Base size={size}>
          <ellipse cx="16" cy="10.1" rx="7.3" ry="3.1" fill="#9EAAB8" stroke="#667382" strokeWidth="1.3" />
          <path d="M8.7 10.1V18.9C8.7 20.7 11.9 22.2 16 22.2C20.1 22.2 23.3 20.7 23.3 18.9V10.1" fill="#8794A5" stroke="#667382" strokeWidth="1.3" />
          <ellipse cx="16" cy="18.9" rx="7.3" ry="3.1" fill="#B1BBC8" stroke="#667382" strokeWidth="1.3" />
        </Base>
      );
    case "UX":
      return (
        <Base size={size}>
          <circle cx="16" cy="16" r="8.7" fill="#8CB673" stroke="#5A8348" strokeWidth="1.4" />
          <circle cx="16" cy="16" r="4" fill="#A9CE94" stroke="#5A8348" strokeWidth="1.1" />
          <path d="M16 7.3V3.9" stroke="#5A8348" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 28.1V24.7" stroke="#5A8348" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24.7 16H28.1" stroke="#5A8348" strokeWidth="1.5" strokeLinecap="round" />
        </Base>
      );
    case "LTH":
      return (
        <Base size={size}>
          <path d="M8.3 6.8H16.1V22.6H23.7V25.2H8.3V6.8Z" fill="#9AC6CC" stroke="#5F8E95" strokeWidth="1.3" />
          <path d="M18.5 8.9L24.9 6.2V17.9L18.5 20.6V8.9Z" fill="#7FB1B8" stroke="#5F8E95" strokeWidth="1.2" />
        </Base>
      );
    case "MO":
      return (
        <Base size={size}>
          <path d="M5.8 24.3V7.7H10.2L16 17.2L21.8 7.7H26.2V24.3H22.3V14.8L17.7 22.2H14.3L9.7 14.8V24.3H5.8Z" fill="#A0AAB7" stroke="#697482" strokeWidth="1.1" />
        </Base>
      );
    default:
      return (
        <Base size={size}>
          <rect x="5.5" y="8" width="5.5" height="16" rx="2.2" fill="#9BA7B6" stroke="#647487" strokeWidth="1.3" />
          <rect x="13.3" y="5.2" width="5.5" height="18.8" rx="2.2" fill="#B3BECA" stroke="#647487" strokeWidth="1.3" />
          <rect x="21" y="10.4" width="5.5" height="13.6" rx="2.2" fill="#8897AA" stroke="#647487" strokeWidth="1.3" />
        </Base>
      );
  }
}

