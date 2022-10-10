interface Props {
  environmentId: number;
}

export default function EnvironmentStatusSummary({ environmentId }: Props) {
  return (
    <div>
      <h3>Environment Name</h3>
      <div>
        <div>status</div>
        <div>disk</div>
        <div>memory</div>
        <div>database</div>
      </div>
    </div>
  );
}
