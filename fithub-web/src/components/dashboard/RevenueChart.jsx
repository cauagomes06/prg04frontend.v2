import React from 'react';
// 1. Verifique se o ResponsiveContainer está aqui na lista de imports
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
  // Se não houver dados, não renderiza nada para evitar erros de gráfico vazio
  if (!dados) return null;

  const data = [
    { name: 'Faturamento (R$)', valor: dados.total_faturado || 0, cor: '#2ecc71' },
    { name: 'Qtd. Vendas', valor: dados.quantidade_vendas || 0, cor: '#3498db' }
  ];

  return (
    /* IMPORTANTE: Removi a div 'dashboard-chart-section' daqui para 
       corrigir o problema de um card ultrapassando o outro.
    */
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          cursor={{ fill: '#f4f7f6' }}
          contentStyle={{ 
            borderRadius: '8px', 
            border: 'none', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }}
        />
        <Bar dataKey="valor" radius={[5, 5, 0, 0]} barSize={50}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.cor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}