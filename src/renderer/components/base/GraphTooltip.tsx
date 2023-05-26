import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts/types/component/Tooltip';
import { useTranslation } from 'react-i18next';

import '../../assets/styles/components/GraphTooltip.scss';
import formatBytes from '../../../common/utils/formatBytes';

interface Props {
  content: TooltipProps<ValueType, NameType>;
  unit: string;
}

export default function GraphTooltip({ content, unit }: Props) {
  const { t } = useTranslation();

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
                  dataKeyTitle = t('components.GraphTooltip.unitTitles.ms');
                  break;
                case 'bytes':
                  dataKeyTitle = t('components.GraphTooltip.unitTitles.bytes');
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
