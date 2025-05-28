"use client";

import {
  getColorForLevel,
  getDarkerColorForLevel,
  getLighterColorForLevel,
} from "../utils/color-helpers";

interface MeasurementTankProps {
  typeId: number;
  levelPercentage: number;
}

export default function MeasurementTank({
  typeId,
  levelPercentage,
}: MeasurementTankProps) {
  const tankLeft = 15;
  const tankRight = 185;
  const tankTop = 30;
  const tankBottom = 110;
  const tankWidth = tankRight - tankLeft;
  const tankHeight = tankBottom - tankTop;

  const liquidHeight = (tankHeight * levelPercentage) / 100.0;
  const liquidY = tankBottom - liquidHeight;

  const waveTopY = liquidY;
  const waveMidY = liquidY + liquidHeight * 0.4;
  const waveBottomY = liquidY + liquidHeight * 0.8;

  return (
    <svg width="200" height="150" viewBox="0 0 200 150">
      <defs>
        {/* Tank gradients */}
        <linearGradient
          id={`tankGradient${typeId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#7a7a7a" />
          <stop offset="20%" stopColor="#c0c0c0" />
          <stop offset="50%" stopColor="#e0e0e0" />
          <stop offset="80%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#7a7a7a" />
        </linearGradient>

        {/* Highlight gradient */}
        <linearGradient
          id={`highlightGradient${typeId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Liquid gradient */}
        <linearGradient
          id={`liquidGradient${typeId}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor={getColorForLevel(levelPercentage)}
            stopOpacity="0.95"
          />
          <stop
            offset="100%"
            stopColor={getDarkerColorForLevel(levelPercentage)}
            stopOpacity="0.85"
          />
        </linearGradient>

        {/* Gloss/reflection gradient for liquid */}
        <linearGradient
          id={`liquidGloss${typeId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Shadow filter */}
        <filter
          id={`tankShadow${typeId}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="3" dy="3" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Clip path for liquid */}
        <clipPath id={`liquidClip${typeId}`}>
          <rect
            x={tankLeft + 1}
            y={liquidY}
            width={tankWidth - 2}
            height={tankBottom - liquidY - 1}
          />
        </clipPath>
      </defs>

      {/* Horizontal tank with sharp corners */}
      <g filter={`url(#tankShadow${typeId})`}>
        {/* Tank body - horizontal rectangle with no rounded corners */}
        <rect
          x={tankLeft}
          y={tankTop}
          width={tankWidth}
          height={tankHeight}
          fill={`url(#tankGradient${typeId})`}
          stroke="#555"
          strokeWidth="1"
        />

        {/* Inner highlight - slightly inset from edges */}
        <rect
          x={tankLeft + 2}
          y={tankTop + 2}
          width={tankWidth - 4}
          height={tankHeight - 4}
          fill="none"
          stroke={`url(#highlightGradient${typeId})`}
          strokeWidth="2"
          strokeOpacity="0.3"
        />
      </g>

      {/* Liquid fill */}
      {levelPercentage > 0 && (
        <g clipPath={`url(#liquidClip${typeId})`}>
          {/* Base liquid */}
          <rect
            x={tankLeft + 1}
            y={liquidY}
            width={tankWidth - 2}
            height={tankBottom - liquidY - 1}
            fill={`url(#liquidGradient${typeId})`}
            stroke="none"
          />

          {/* Surface wave - multiple waves with different animations */}
          <path
            className="animate-[wave1_5s_infinite_cubic-bezier(0.445,0.05,0.55,0.95)]"
            d={`M${tankLeft},${waveTopY} Q${tankLeft + tankWidth * 0.1},${
              waveTopY - 3
            } ${tankLeft + tankWidth * 0.25},${waveTopY} Q${
              tankLeft + tankWidth * 0.4
            },${waveTopY + 3} ${tankLeft + tankWidth * 0.5},${waveTopY} Q${
              tankLeft + tankWidth * 0.65
            },${waveTopY - 3} ${tankLeft + tankWidth * 0.8},${waveTopY} Q${
              tankLeft + tankWidth * 0.9
            },${
              waveTopY + 3
            } ${tankRight},${waveTopY} L${tankRight},${tankBottom} L${tankLeft},${tankBottom} Z`}
            fill={getColorForLevel(levelPercentage)}
            fillOpacity="0.6"
          />

          <path
            className="animate-[wave2_6s_infinite_cubic-bezier(0.445,0.05,0.55,0.95)]"
            d={`M${tankLeft},${waveTopY} Q${tankLeft + tankWidth * 0.15},${
              waveTopY + 3
            } ${tankLeft + tankWidth * 0.3},${waveTopY} Q${
              tankLeft + tankWidth * 0.45
            },${waveTopY - 3} ${tankLeft + tankWidth * 0.6},${waveTopY} Q${
              tankLeft + tankWidth * 0.75
            },${waveTopY + 3} ${
              tankLeft + tankWidth * 0.9
            },${waveTopY} Q${tankRight},${
              waveTopY - 2
            } ${tankRight},${waveTopY} L${tankRight},${tankBottom} L${tankLeft},${tankBottom} Z`}
            fill={getColorForLevel(levelPercentage)}
            fillOpacity="0.4"
          />

          {/* Middle flow wave */}
          {liquidHeight > 10 && (
            <path
              className="animate-[wave3_7s_infinite_cubic-bezier(0.445,0.05,0.55,0.95)]"
              d={`M${tankLeft},${waveMidY} Q${tankLeft + tankWidth * 0.2},${
                waveMidY + 2
              } ${tankLeft + tankWidth * 0.35},${waveMidY} Q${
                tankLeft + tankWidth * 0.5
              },${waveMidY - 2} ${tankLeft + tankWidth * 0.7},${waveMidY} Q${
                tankLeft + tankWidth * 0.85
              },${waveMidY + 2} ${tankRight},${waveMidY}`}
              fill="none"
              stroke={getLighterColorForLevel(levelPercentage)}
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
          )}

          {/* Bottom flow wave - only visible if enough liquid */}
          {liquidHeight > 20 && (
            <path
              className="animate-[wave4_8s_infinite_cubic-bezier(0.445,0.05,0.55,0.95)]"
              d={`M${tankLeft},${waveBottomY} Q${tankLeft + tankWidth * 0.25},${
                waveBottomY - 2
              } ${tankLeft + tankWidth * 0.4},${waveBottomY} Q${
                tankLeft + tankWidth * 0.55
              },${waveBottomY + 2} ${
                tankLeft + tankWidth * 0.75
              },${waveBottomY} Q${tankLeft + tankWidth * 0.9},${
                waveBottomY - 2
              } ${tankRight},${waveBottomY}`}
              fill="none"
              stroke={getLighterColorForLevel(levelPercentage)}
              strokeWidth="1"
              strokeOpacity="0.2"
            />
          )}

          {/* Glossy reflective overlay */}
          <rect
            x={tankLeft + 3}
            y={liquidY + 2}
            width={tankWidth * 0.8}
            height={liquidHeight * 0.5}
            fill={`url(#liquidGloss${typeId})`}
            className="animate-[glossy_9s_infinite_cubic-bezier(0.445,0.05,0.55,0.95)]"
          />

          {/* Surface wave outlines */}
          <path
            className="animate-[wave2_6s_infinite_cubic-bezier(0.445,0.05,0.55,0.95)]"
            d={`M${tankLeft},${waveTopY} Q${tankLeft + tankWidth * 0.15},${
              waveTopY + 3
            } ${tankLeft + tankWidth * 0.3},${waveTopY} Q${
              tankLeft + tankWidth * 0.45
            },${waveTopY - 3} ${tankLeft + tankWidth * 0.6},${waveTopY} Q${
              tankLeft + tankWidth * 0.75
            },${waveTopY + 3} ${
              tankLeft + tankWidth * 0.9
            },${waveTopY} Q${tankRight},${
              waveTopY - 2
            } ${tankRight},${waveTopY}`}
            fill="none"
            stroke={getDarkerColorForLevel(levelPercentage)}
            strokeWidth="0.8"
            strokeOpacity="0.7"
          />
        </g>
      )}

      {/* Percentage display in the middle of the tank */}
      <g transform="translate(100, 70)" textAnchor="middle">
        <rect
          x="-25"
          y="-18"
          width="50"
          height="36"
          rx="8"
          ry="8"
          fill="rgba(255,255,255,0.85)"
          stroke="#555"
          strokeWidth="0.5"
        />
        <text y="6" fontSize="20" fontWeight="bold" fill="#333">
          {levelPercentage}%
        </text>
      </g>
    </svg>
  );
}
