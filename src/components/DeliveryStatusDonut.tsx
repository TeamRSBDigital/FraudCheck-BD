import React from 'react';

interface DeliveryStatusDonutProps {
  successful: number;
  cancelled: number;
  successRate?: number;
}

export const DeliveryStatusDonut: React.FC<DeliveryStatusDonutProps> = ({
  successful,
  cancelled,
  successRate,
}) => {
  const total = successful + cancelled;

  // Calculate percentages and angles
  const successRatio = total > 0 ? successful / total : 0;
  const cancelRatio = total > 0 ? cancelled / total : 0;

  // SVG dimensions & math
  const size = 260;
  const center = size / 2;
  const radius = 70;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  // Circumference stroke dash calculations
  const successDash = circumference * successRatio;
  const cancelDash = circumference * cancelRatio;

  // Angle math for leader pointers
  // Green starts at top (-90 deg), sweeps clockwise by (successRatio * 360)
  const greenMidAngleDeg = -90 + (successRatio * 360) / 2;
  const greenMidAngleRad = (greenMidAngleDeg * Math.PI) / 180;

  // Red starts where green ends, sweeps for (cancelRatio * 360)
  const redMidAngleDeg = -90 + successRatio * 360 + (cancelRatio * 360) / 2;
  const redMidAngleRad = (redMidAngleDeg * Math.PI) / 180;

  // Leader line anchor points
  const pointerRadiusInner = radius + strokeWidth / 2 + 2;
  const pointerRadiusOuter = radius + strokeWidth / 2 + 22;

  const greenLineStart = {
    x: center + pointerRadiusInner * Math.cos(greenMidAngleRad),
    y: center + pointerRadiusInner * Math.sin(greenMidAngleRad),
  };
  const greenLineEnd = {
    x: center + pointerRadiusOuter * Math.cos(greenMidAngleRad),
    y: center + pointerRadiusOuter * Math.sin(greenMidAngleRad),
  };

  const redLineStart = {
    x: center + pointerRadiusInner * Math.cos(redMidAngleRad),
    y: center + pointerRadiusInner * Math.sin(redMidAngleRad),
  };
  const redLineEnd = {
    x: center + pointerRadiusOuter * Math.cos(redMidAngleRad),
    y: center + pointerRadiusOuter * Math.sin(redMidAngleRad),
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between h-full">
      <div className="border-b border-slate-100 pb-3 mb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
          Delivery Status
        </h3>
      </div>

      <div className="relative flex flex-col items-center justify-center my-auto py-2">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-56 h-56 sm:w-64 sm:h-64 overflow-visible"
        >
          {/* Background circle if 0 */}
          {total === 0 ? (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
            />
          ) : (
            <>
              {/* Successful Arc (Emerald Green #059669) */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#059669"
                strokeWidth={strokeWidth}
                strokeDasharray={`${successDash} ${circumference}`}
                strokeDashoffset={0}
                transform={`rotate(-90 ${center} ${center})`}
                strokeLinecap="butt"
                className="transition-all duration-700 ease-out"
              />

              {/* Cancelled Arc (Rose Red #E11D48) */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#E11D48"
                strokeWidth={strokeWidth}
                strokeDasharray={`${cancelDash} ${circumference}`}
                strokeDashoffset={-successDash}
                transform={`rotate(-90 ${center} ${center})`}
                strokeLinecap="butt"
                className="transition-all duration-700 ease-out"
              />

              {/* Green Leader Line & Number */}
              {successful > 0 && (
                <g className="transition-opacity duration-500">
                  <line
                    x1={greenLineStart.x}
                    y1={greenLineStart.y}
                    x2={greenLineEnd.x}
                    y2={greenLineEnd.y}
                    stroke="#059669"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={greenLineEnd.x + (greenLineEnd.x >= center ? 6 : -6)}
                    y={greenLineEnd.y + (greenLineEnd.y >= center ? 4 : -4)}
                    fill="#059669"
                    fontSize="14"
                    fontWeight="700"
                    textAnchor={greenLineEnd.x >= center ? 'start' : 'end'}
                    dominantBaseline="middle"
                    className="font-mono"
                  >
                    {successful}
                  </text>
                </g>
              )}

              {/* Red Leader Line & Number */}
              {cancelled > 0 && (
                <g className="transition-opacity duration-500">
                  <line
                    x1={redLineStart.x}
                    y1={redLineStart.y}
                    x2={redLineEnd.x}
                    y2={redLineEnd.y}
                    stroke="#E11D48"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={redLineEnd.x + (redLineEnd.x >= center ? 6 : -6)}
                    y={redLineEnd.y + (redLineEnd.y >= center ? 4 : -4)}
                    fill="#E11D48"
                    fontSize="14"
                    fontWeight="700"
                    textAnchor={redLineEnd.x >= center ? 'start' : 'end'}
                    dominantBaseline="middle"
                    className="font-mono"
                  >
                    {cancelled}
                  </text>
                </g>
              )}
            </>
          )}

          {/* Center text badge */}
          <text
            x={center}
            y={center - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-extrabold fill-slate-900 font-display"
            fontSize="22"
            fontWeight="800"
          >
            {total > 0 ? (successRate !== undefined ? `${successRate}%` : `${Math.round(successRatio * 100)}%`) : '0%'}
          </text>
          <text
            x={center}
            y={center + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[11px] font-semibold fill-slate-500 uppercase tracking-wider"
            fontSize="10"
            fontWeight="600"
          >
            Delivered
          </text>
        </svg>
      </div>

      {/* Legend at bottom */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100 text-xs font-semibold">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-sm bg-emerald-600" />
          <span>Successful ({successful})</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-sm bg-rose-600" />
          <span>Cancelled ({cancelled})</span>
        </div>
      </div>
    </div>
  );
};
