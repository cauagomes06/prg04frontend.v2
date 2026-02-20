import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export function RevenueChart({ dados }) {
  if (!dados) return null;

  // Cores alinhadas com o dashboard.css para consistência
  const data = [
    { name: 'Faturamento (R$)', valor: dados.total_faturado || 0, cor: '#2ecc71' },
    { name: 'Qtd. Vendas', valor: dados.quantidade_vendas || 0, cor: '#3498db' }
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        {/* Ajustada a cor da grade para ser visível mas discreta em ambos os temas */}
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
        
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
        />
        
        <Tooltip  
          cursor={{ fill: 'var(--bg-light)', opacity: 0.4 }}
          contentStyle={{ 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)', 
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-dark)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)' 
          }}
          itemStyle={{ fontWeight: 'bold' }}
        />

        <Bar dataKey="valor" radius={[8, 8, 0, 0]} barSize={60}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.cor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}