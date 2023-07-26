import './index.scss';

interface StatProps {
  heading: string;
  prefix: string;
  suffix: string;
}

/**
 * Stat component. Ideal for displaying a number on dashboards.
 *  Receives a "heading" property that will display it.
 */
const Stat: React.FC<StatProps> = ({ heading, prefix, suffix }) => {
  return (
    <div className="stat-container">
      <span className="font-soft">{prefix}</span>
      <h3>{heading}</h3>
      <span className="font-soft">{suffix}</span>
    </div>
  );
};

export default Stat;
