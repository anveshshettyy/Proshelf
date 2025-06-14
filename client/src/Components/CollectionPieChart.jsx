import React from 'react';
import { ResponsivePie } from '@nivo/pie';

export default function CollectionPieChart({ data }) {
  return (
    <div className="flex items-center justify-center w-full py-10 px-4 min-h-[400px]">
      <div className="w-full max-w-2xl h-[400px]   p-6 rounded-2xl ">
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={1}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#374151" // Tailwind slate-700
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          colors={[
            '#6366f1', // indigo-500
            '#f59e0b', // amber-500
            '#10b981', // emerald-500
            '#3b82f6', // blue-500
            '#f43f5e', // rose-500
            '#8b5cf6', // violet-500
            '#14b8a6', // teal-500
            '#ec4899', // pink-500
          ]}
          theme={{
            textColor: '#111827', // slate-900
            fontSize: 14,
            tooltip: {
              container: {
                background: '#f9fafb', // slate-50
                color: '#111827',
                fontSize: 14,
                padding: '8px 12px',
                border: '1px solid #e5e7eb', // slate-200
                borderRadius: '6px',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
