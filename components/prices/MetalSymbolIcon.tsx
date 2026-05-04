import type { ReactNode } from "react";
import type { MetalSymbol } from "@/types/metals";

interface MetalSymbolIconProps {
  symbol: MetalSymbol;
  size?: number;
  labelOverride?: string;
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

type MetalPalette = {
  light: string;
  mid: string;
  dark: string;
  stroke: string;
  text: string;
};

const METAL_ICON_META: Record<
  MetalSymbol,
  { label: string; palette: MetalPalette }
> = {
  XAU: {
    label: "Au",
    palette: {
      light: "#FFE39A",
      mid: "#D4A64A",
      dark: "#9B6B17",
      stroke: "#7A5210",
      text: "#6A4305",
    },
  },
  XAG: {
    label: "Ag",
    palette: {
      light: "#F3F6FA",
      mid: "#C2CCD8",
      dark: "#8898AB",
      stroke: "#697A8F",
      text: "#5D6D81",
    },
  },
  XPT: {
    label: "Pt",
    palette: {
      light: "#F6F1ED",
      mid: "#C5BDB8",
      dark: "#908780",
      stroke: "#756C65",
      text: "#5F5750",
    },
  },
  XPD: {
    label: "Pd",
    palette: {
      light: "#EDE4DD",
      mid: "#B8AEA5",
      dark: "#867D74",
      stroke: "#6F665E",
      text: "#5A524B",
    },
  },
  RH: {
    label: "Rh",
    palette: {
      light: "#E7ECF3",
      mid: "#B1BAC8",
      dark: "#7B8C9F",
      stroke: "#65788D",
      text: "#53667D",
    },
  },
  IR: {
    label: "Ir",
    palette: {
      light: "#E8EDF4",
      mid: "#B4BECD",
      dark: "#788CA7",
      stroke: "#607692",
      text: "#4C6482",
    },
  },
  RU: {
    label: "Ru",
    palette: {
      light: "#DCE8E6",
      mid: "#A4B9B6",
      dark: "#708E8A",
      stroke: "#5C7975",
      text: "#4B6662",
    },
  },
  OS: {
    label: "Os",
    palette: {
      light: "#E1E8F3",
      mid: "#ABBBD0",
      dark: "#738CA9",
      stroke: "#5C7390",
      text: "#4A627F",
    },
  },
  XCU: {
    label: "Cu",
    palette: {
      light: "#F1C29F",
      mid: "#D18C62",
      dark: "#A9633E",
      stroke: "#8D4E2F",
      text: "#733B21",
    },
  },
  ALI: {
    label: "Al",
    palette: {
      light: "#E8EDF3",
      mid: "#C2CCD8",
      dark: "#8D9BAE",
      stroke: "#6F7F94",
      text: "#5A6B82",
    },
  },
  NI: {
    label: "Ni",
    palette: {
      light: "#E2E9F3",
      mid: "#AFC0D5",
      dark: "#748BA8",
      stroke: "#5E7594",
      text: "#4C6380",
    },
  },
  ZN: {
    label: "Zn",
    palette: {
      light: "#E4E8EF",
      mid: "#B4BCC9",
      dark: "#7F8B9B",
      stroke: "#687485",
      text: "#556174",
    },
  },
  PB: {
    label: "Pb",
    palette: {
      light: "#D5DAE3",
      mid: "#9EA9B8",
      dark: "#687383",
      stroke: "#556071",
      text: "#454F61",
    },
  },
  SN: {
    label: "Sn",
    palette: {
      light: "#EEF2F8",
      mid: "#C8D1DE",
      dark: "#92A0B3",
      stroke: "#748295",
      text: "#5F6D80",
    },
  },
  CO: {
    label: "Co",
    palette: {
      light: "#C4D3EA",
      mid: "#8EA9CC",
      dark: "#5A7FAF",
      stroke: "#456995",
      text: "#355578",
    },
  },
  TIO: {
    label: "Ti",
    palette: {
      light: "#E9CCBC",
      mid: "#C59579",
      dark: "#94664B",
      stroke: "#7C523B",
      text: "#65402D",
    },
  },
  HRC: {
    label: "Fe",
    palette: {
      light: "#DDE3EC",
      mid: "#A9B5C4",
      dark: "#738396",
      stroke: "#5E6E82",
      text: "#4C5C71",
    },
  },
  UX: {
    label: "Ux",
    palette: {
      light: "#D3EAB7",
      mid: "#97BE6B",
      dark: "#628749",
      stroke: "#4F723A",
      text: "#3C5E2A",
    },
  },
  LTH: {
    label: "Li",
    palette: {
      light: "#D2E5E7",
      mid: "#94BCC1",
      dark: "#5F8E95",
      stroke: "#4C757C",
      text: "#3E6168",
    },
  },
  MO: {
    label: "Mo",
    palette: {
      light: "#DFE4EC",
      mid: "#A9B2C0",
      dark: "#727D8F",
      stroke: "#5D687A",
      text: "#4C5669",
    },
  },
};

function IngotIcon({
  size,
  label,
  palette,
}: {
  size: number;
  label: string;
  palette: MetalPalette;
}) {
  const gradId = `metal-grad-${label.toLowerCase()}`;

  return (
    <Base size={size}>
      <defs>
        <linearGradient
          id={gradId}
          x1="6"
          y1="5"
          x2="24"
          y2="27"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={palette.light} />
          <stop offset="0.56" stopColor={palette.mid} />
          <stop offset="1" stopColor={palette.dark} />
        </linearGradient>
      </defs>

      <path
        d="M7.1 8.4L10.7 5.1H25.2L23.5 22.3L6.8 26.9L7.1 8.4Z"
        fill={`url(#${gradId})`}
        stroke={palette.stroke}
        strokeWidth="1.2"
      />
      <path
        d="M10.7 5.1L9.1 22L23.5 22.3"
        stroke="#FFFFFF"
        strokeOpacity="0.58"
        strokeWidth="0.9"
      />
      <path d="M7.1 8.4L10.7 5.1" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="0.8" />
      <text
        x="16.3"
        y="15.3"
        textAnchor="middle"
        fill={palette.text}
        fontSize="6.1"
        fontWeight="700"
        fontFamily="Inter, Arial"
      >
        {label}
      </text>
    </Base>
  );
}

export function MetalSymbolIcon({ symbol, size = 32, labelOverride }: MetalSymbolIconProps) {
  const meta = METAL_ICON_META[symbol];
  return (
    <IngotIcon
      size={size}
      label={labelOverride ?? meta.label}
      palette={meta.palette}
    />
  );
}

