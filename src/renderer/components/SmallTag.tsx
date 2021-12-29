import '../assets/styles/components/SmallTag.scss';

interface SmallTagInterface {
  kind: string;
}

export default function SmallTag({ kind }: SmallTagInterface) {
  return <div className="small-tag">{kind}</div>;
}
