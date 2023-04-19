import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from 'recharts';

import EnvironmentGraphTooltip from '../EnvironmentDataView/EnvironmentGraphTooltip';

export default function DatabaseEvolutionGraph() {
  return (
    <div className="widget-container">
      <h3 className="title">Evolução Do Banco De Dados</h3>
      <div className="card" style={{ height: '55vh' }}>
        <ResponsiveContainer width="100%" height="92%">
          <AreaChart
            data={[
              {
                timestamp: 1681846774003,
                dbSize: 1954022376,
                dbTraficReceived: 420485,
                dbTraficSent: 551514,
              },
              {
                timestamp: 1681846775003,
                dbSize: 1954021376,
                dbTraficReceived: 420485,
                dbTraficSent: 551514,
              },
              {
                timestamp: 1681846776003,
                dbSize: 1954020376,
                dbTraficReceived: 420485,
                dbTraficSent: 551514,
              },
            ]}
          >
            <CartesianGrid strokeDasharray="3" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(el) =>
                `    ${new Date(el).toLocaleTimeString()}      `
              }
              interval="preserveEnd"
            />
            <YAxis
              allowDecimals={false}
              dataKey="dbSize"
              type="number"
              domain={[0, (dataMax: number) => Math.ceil(dataMax / 250) * 250]}
              tickCount={9}
            />
            <Tooltip
              content={(content) => {
                return <EnvironmentGraphTooltip content={content} />;
              }}
            />
            <Area
              type="monotone"
              dataKey="dbSize"
              dot={false}
              stroke="var(--purple)"
              strokeWidth={2}
              fill="var(--light-purple)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
