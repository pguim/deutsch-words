import React, { useMemo } from "react";

/**
 * SVGProgressBar
 *
 * Props:
 * - value: number (0..100)
 * - width: total width in px (default 300)
 * - height: bar height in px (default 20)
 * - radius: border radius in px (default 6)
 * - stroke: border color (default '#e6e6e6')
 * - showLabel: boolean to show percentage text (default true)
 * - animateDuration: transition time in seconds (default 0.4)
 */
export default function ProgressBar ({
  value = 0,
  width = 300,
  height = 20,
  radius = 6,
  stroke = "#e6e6e6",
  showLabel = true,
  animateDuration = 0.4,
}) {
  // clamp value 0..100
  const v = Math.max(0, Math.min(100, Number(value) || 0));

  // inner padding so border visible
  const padding = 0;
  const innerWidth = Math.max(0, width - padding * 2);
  const innerHeight = Math.max(0, height - padding * 2);

  // compute color: hue 0 (red) -> 120 (green)
  const fillColor = useMemo(() => {
    const hue = (120 * v) / 100; // 0..120
    // use full saturation and medium lightness for vivid colors
    return `hsl(${hue} 85% 45%)`;
  }, [v]);

  // scale for transform: 0..1
  const scale = v / 100;

  // transform origin left for scaleX
  const transform = `translate(${padding}, ${padding})`;

  return (
    <svg
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer border / background */}
      <rect
        x={padding}
        y={padding}
        rx={radius}
        ry={radius}
        width={innerWidth}
        height={innerHeight}
        fill="#ffffff"
        stroke={stroke}
        strokeWidth="1"
      />

      {/* Fill group positioned in inner area — use scaleX to animate width */}
      <g transform={transform}>
        {/* A full-width rect that will be scaled horizontally */}
        <rect
          x={0}
          y={0}
          rx={Math.max(0, radius - padding)}
          ry={Math.max(0, radius - padding)}
          width={innerWidth}
          height={innerHeight}
          fill={fillColor}
          style={{
            transformOrigin: "0 50%",
            transform: `scaleX(${scale})`,
            transition: `transform ${animateDuration}s ease, fill ${animateDuration}s linear`,
          }}
        />
      </g>

      {/* Optional label below */}
      {showLabel && (
        <text
          x={width / 2 + padding * 2 - 22}
          y={height / 2 + padding * 2 + 5}
          fontSize="12"
          fontWeight="bold"
          fill="#374151"
        >
          {Number.parseFloat(v).toFixed(2)} %
        </text>
      )}
    </svg>
  );
}