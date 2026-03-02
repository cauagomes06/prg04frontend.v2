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

  // Substituímos os dados de vendas pelos dados reais da plataforma
  const data = [
    { name: 'Alunos', valor: dados.totalAlunos || 0, cor: '#3498db' }, // Azul
    { name: 'Personais', valor: dados.totalPersonais || 0, cor: '#0dcaf0' }, // Ciano
    { name: 'Aulas Agendadas', valor: dados.aulasAgendadas || 0, cor: '#f1c40f' }, // Amarelo
    { name: 'Competições', valor: dados.competicoesAtivas || 0, cor: '#e74c3c' } // Vermelho
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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
          allowDecimals={false} // Não permite números quebrados no eixo Y (ex: 1.5 alunos)
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