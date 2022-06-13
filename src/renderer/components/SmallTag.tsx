/* eslint-disable react/require-default-props */
import { useTranslation } from 'react-i18next';
import '../assets/styles/components/SmallTag.scss';

interface SmallTagInterface {
  kind: string;
  expanded?: boolean;
}

export default function SmallTag({
  kind,
  expanded = false,
}: SmallTagInterface) {
  let className = 'small-tag';
  const { t } = useTranslation();

  switch (kind) {
    case 'PROD':
      className += ' is-production';
      break;
    case 'HML':
      className += ' is-homolog';
      break;
    case 'DEV':
      className += ' is-dev';
      break;
    default:
      break;
  }

  if (expanded) {
    className += ' is-expanded';
  }

  return (
    <div className={className}>
      {expanded ? t(`global.environmentKinds.${kind}`) : kind}
    </div>
  );
}
