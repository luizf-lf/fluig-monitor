import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts/types/component/Tooltip';

import '../../assets/styles/components/EnvironmentDataView/EnvironmentGraphTooltip.scss';

interface Props {
  content: TooltipProps<ValueType, NameType>;
}

export default function EnvironmentGraphTooltip({ content }: Props) {
  if (content && content.active) {
    return (
      <div className="custom-graph-tooltip">
        <p>{new Date(content.label).toLocaleString()}</p>
        <div className="items-container">
          {content.payload?.map((item) => {
            if (item.dataKey) {
              let dataKeyTitle = '';
              switch (item.dataKey) {
                case 'license':
                  dataKeyTitle = 'Licenças';
                  break;
                case 'monitor':
                  dataKeyTitle = 'Monitor';
                  break;
                case 'statistics':
                  dataKeyTitle = 'Estatísticas';
                  break;
                default:
                  break;
              }
              return (
                <span key={item.dataKey}>
                  {dataKeyTitle}: {item.payload[item.dataKey]}ms
                </span>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  return null;
}
