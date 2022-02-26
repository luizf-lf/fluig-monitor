import '../assets/styles/components/SmallTag.scss';

interface SmallTagInterface {
  kind: string;
}

export default function SmallTag({ kind }: SmallTagInterface) {
  let className = 'small-tag';

  switch (kind) {
    case 'PROD':
      className += ' is-production';
      break;
    case 'HOMOLOG':
      className += ' is-homolog';
      break;
    case 'DEV':
      className += ' is-dev';
      break;
    default:
      break;
  }

  return <div className={className}>{kind}</div>;
}
