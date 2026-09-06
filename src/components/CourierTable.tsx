import React from 'react';
import { Truck, Hash, CheckCircle2, XCircle } from 'lucide-react';
import { CourierStats } from '../types/index';
import { CourierLogo } from './CourierLogos';

interface CourierTableProps {
  couriers: CourierStats[];
  totalOrders: number;
  delivered: number;
  cancelled: number;
}

// Ordered list of 6 standard BD courier networks
const STANDARD_COURIERS = [
  { id: 'pathao', name: 'Pathao' },
  { id: 'steadfast', name: 'SteadFast' },
  { id: 'courierfast', name: 'Courrier Fast' },
  { id: 'redx', name: 'RedX' },
  { id: 'paperfly', name: 'Paperfly' },
  { id: 'carrybee', name: 'CarryBee' },
];

export const CourierTable: React.FC<CourierTableProps> = ({
  couriers,
  totalOrders,
  delivered,
  cancelled,
}) => {
  // Map provided couriers by normalized ID
  const courierMap = new Map<string, CourierStats>();
  couriers.forEach((c) => {
    const key = c.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    courierMap.set(key, c);
  });

  // Build rows including all 6 standard couriers
  const displayRows = STANDARD_COURIERS.map((std) => {
    const key = std.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = courierMap.get(key);
    if (found) {
      courierMap.delete(key);
      return found;
    }
    return {
      id: std.id,
      name: std.name,
      totalOrders: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
      successRate: 0,
      returnRate: 0,
    };
  });

  // Any other courier in response not in standard list
  courierMap.forEach((extra) => {
    displayRows.push(extra);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between h-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header with unified B2B SaaS Slate Theme & SVG icons */}
          <thead>
            <tr className="bg-slate-900 text-slate-100 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6 w-[42%]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Courier</span>
                </div>
              </th>
              <th className="py-3.5 px-3 sm:px-4 text-center w-[18%]">
                <div className="flex items-center justify-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>Total</span>
                </div>
              </th>
              <th className="py-3.5 px-3 sm:px-4 text-center w-[20%]">
                <div className="flex items-center justify-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Success</span>
                </div>
              </th>
              <th className="py-3.5 px-3 sm:px-4 text-center w-[20%]">
                <div className="flex items-center justify-center gap-1 text-rose-400">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-sm">
            {displayRows.map((courier) => {
              const cancelCount =
                courier.cancelled +
                (courier.returned > courier.cancelled
                  ? courier.returned - courier.cancelled
                  : 0);
              return (
                <tr
                  key={courier.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Courier Logo Container */}
                  <td className="py-3 px-4 sm:px-6">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg border border-slate-200 bg-white h-9 w-28 sm:w-32 shadow-2xs group-hover:border-slate-300 transition-colors">
                      <CourierLogo
                        id={courier.id}
                        name={courier.name}
                        className="max-h-6 w-auto max-w-full"
                      />
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3 px-3 sm:px-4 text-center font-bold text-slate-900 font-mono">
                    {courier.totalOrders}
                  </td>

                  {/* Success */}
                  <td className="py-3 px-3 sm:px-4 text-center font-bold text-emerald-600 font-mono">
                    {courier.delivered}
                  </td>

                  {/* Cancel */}
                  <td className="py-3 px-3 sm:px-4 text-center font-bold text-rose-600 font-mono">
                    {cancelCount}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer / Summary Row */}
          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200 text-sm font-bold">
              <td className="py-3 px-4 sm:px-6 text-slate-900 font-display">
                Total
              </td>
              <td className="py-3 px-3 sm:px-4 text-center text-slate-950 font-mono font-extrabold text-base">
                {totalOrders}
              </td>
              <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-mono font-extrabold text-base">
                {delivered}
              </td>
              <td className="py-3 px-3 sm:px-4 text-center text-rose-600 font-mono font-extrabold text-base">
                {cancelled}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
