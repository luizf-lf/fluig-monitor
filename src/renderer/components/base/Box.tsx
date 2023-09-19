/* eslint-disable react/prop-types */

const Box: React.FC = ({ ...props }) => {
  return <div className="card">{props.children}</div>;
};

export default Box;
