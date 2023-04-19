import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts/types/component/Tooltip';

import '../../assets/styles/components/EnvironmentDataView/EnvironmentGraphTooltip.scss';
import formatBytes from '../../../common/utils/formatBytes';

interface Props {
  content: TooltipProps<ValueType, NameType>;
  unit: string;
}

export default function EnvironmentGraphTooltip({ content, unit }: Props) {
  if (content && content.active) {
    return (
      <div className="custom-graph-tooltip">
        <p>{new Date(content.label).toLocaleString()}</p>
        <div className="items-container">
          {content.payload?.map((item) => {
            if (item.dataKey) {
              let dataKeyTitle = '';
              switch (unit) {
                case 'ms':
                  dataKeyTitle = 'Ping';
                  break;
                case 'bytes':
                  dataKeyTitle = 'Tamanho';
                  break;
                default:
                  break;
              }
              return (
                <span key={item.dataKey}>
                  {dataKeyTitle}:{' '}
                  {unit === 'bytes'
                    ? formatBytes(item.payload[item.dataKey])
                    : `${item.payload[item.dataKey]}${unit}`}
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
