import React from 'react';

interface NnecxyLogoProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export const NnecxyLogo: React.FC<NnecxyLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  glow = true,
}) => {
  let pixelSize = 44;
  if (typeof size === 'number') {
    pixelSize = size;
  } else {
    switch (size) {
      case 'sm':
        pixelSize = 32;
        break;
      case 'md':
        pixelSize = 48;
        break;
      case 'lg':
        pixelSize = 72;
        break;
      case 'xl':
        pixelSize = 110;
        break;
    }
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <svg
          viewBox="0 0 200 200"
          width={pixelSize}
          height={pixelSize}
          className="w-full h-full drop-shadow-lg"
          style={{
            filter: glow ? 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.45))' : 'none',
          }}
        >
          <defs>
            {/* Outer Cybernetic Ring Gradients */}
            <radialGradient id="cyberBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#051026" />
              <stop offset="70%" stopColor="#020817" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>

            <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#00B0FF" />
              <stop offset="100%" stopColor="#2979FF" />
            </linearGradient>

            <linearGradient id="cyberRingGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0091EA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.8" />
            </linearGradient>

            {/* Letter N 3D Neon Gradient: Pink to Gold */}
            <linearGradient id="goldPink" x1="20%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="35%" stopColor="#FF8C00" />
              <stop offset="70%" stopColor="#FF1493" />
              <stop offset="100%" stopColor="#C71585" />
            </linearGradient>

            <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF69B4" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="nnecxyGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Deep dark circular background */}
          <circle cx="100" cy="100" r="96" fill="url(#cyberBg)" stroke="#001830" strokeWidth="2" />

          {/* Outer Cybernetic Ring with notches */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="url(#neonCyan)"
            strokeWidth="5"
            strokeDasharray="14 4 6 4 28 6 8 4"
            strokeLinecap="round"
          />

          {/* Secondary Concentric Tech Circles */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="1.5"
            strokeOpacity="0.6"
            strokeDasharray="4 8"
          />

          <circle
            cx="100"
            cy="100"
            r="73"
            fill="none"
            stroke="#0091EA"
            strokeWidth="2.5"
            strokeOpacity="0.8"
          />

          {/* Circuit Tech Marks (top, right, bottom, left) */}
          <g stroke="#00E5FF" strokeWidth="2" opacity="0.85">
            {/* Cardinal notches */}
            <line x1="100" y1="6" x2="100" y2="18" />
            <line x1="100" y1="182" x2="100" y2="194" />
            <line x1="6" y1="100" x2="18" y2="100" />
            <line x1="182" y1="100" x2="194" y2="100" />

            {/* Corner circuit micro notches */}
            <line x1="34" y1="34" x2="42" y2="42" />
            <line x1="166" y1="34" x2="158" y2="42" />
            <line x1="34" y1="166" x2="42" y2="158" />
            <line x1="166" y1="166" x2="158" y2="158" />

            {/* Dots */}
            <circle cx="100" cy="24" r="2" fill="#00E5FF" />
            <circle cx="100" cy="176" r="2" fill="#00E5FF" />
            <circle cx="24" cy="100" r="2" fill="#00E5FF" />
            <circle cx="176" cy="100" r="2" fill="#00E5FF" />
          </g>

          {/* Inner ring track with dots */}
          <circle
            cx="100"
            cy="100"
            r="66"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="1"
            strokeDasharray="1 7"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Glowing Aura for N */}
          <circle cx="100" cy="100" r="50" fill="#FF1493" opacity="0.12" filter="blur(10px)" />

          {/* The Calligraphic/Cursive 3D Letter N */}
          {/* Shadow/Extrusion stroke */}
          <g filter="url(#nnecxyGlow)">
            {/* Left flourish loop */}
            <path
              d="M 68 135 C 55 145 42 135 48 118 C 55 98 78 82 86 64 C 91 52 95 44 102 45 C 108 46 102 60 96 76 L 82 120 C 76 138 65 144 58 138 C 52 132 58 116 68 96"
              fill="none"
              stroke="#880e4f"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
            {/* Main Arch & Right Stem */}
            <path
              d="M 85 75 C 96 52 118 42 134 46 C 148 50 152 64 142 85 L 118 132 C 112 144 116 150 126 146 C 138 142 152 124 160 102"
              fill="none"
              stroke="#880e4f"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />

            {/* Glowing Golden-Pink Ribbons */}
            <path
              d="M 72 132 C 58 142 46 132 52 116 C 58 98 80 80 88 64 C 93 54 96 46 103 47 C 109 48 103 62 97 78 L 82 122 C 78 134 68 140 60 134 C 54 128 62 112 72 94"
              fill="none"
              stroke="url(#goldPink)"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 87 75 C 98 52 120 42 135 47 C 148 51 150 66 140 86 L 116 134 C 111 144 116 149 125 145 C 137 140 152 122 158 100"
              fill="none"
              stroke="url(#goldPink)"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Core Bright Highlights */}
            <path
              d="M 75 130 C 65 138 52 130 56 116 C 62 100 82 82 89 66 C 93 58 96 50 102 51 C 106 52 101 64 97 78 L 84 120"
              fill="none"
              stroke="url(#goldHighlight)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.95"
            />
            <path
              d="M 91 72 C 101 53 120 46 133 50 C 144 54 146 66 138 84 L 116 130 C 113 138 117 142 124 139 C 134 135 146 120 152 102"
              fill="none"
              stroke="url(#goldHighlight)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.95"
            />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 text-lg leading-tight">
            NNECXY
          </span>
          <span className="text-[10px] tracking-widest uppercase text-cyan-400 font-semibold opacity-90">
            V1 Social Mobile
          </span>
        </div>
      )}
    </div>
  );
};
