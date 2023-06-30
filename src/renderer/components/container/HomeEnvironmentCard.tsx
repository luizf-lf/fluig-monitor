import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

import { EnvironmentWithRelatedData } from '../../../common/interfaces/EnvironmentControllerInterface';
import EnvironmentFavoriteButton from '../base/EnvironmentFavoriteButton';
import SmallTag from '../base/SmallTag';

interface Props {
  environment: EnvironmentWithRelatedData;
}

function HomeEnvironmentCard({ environment }: Props) {
  // TODO: Listen for environment pings to update the httpResponses graph
  return (
    <div className="EnvironmentCard" key={environment.id}>
      <div className="heading">
        <div className="EnvironmentName">
          <Link to={`/environment/${environment.id}/summary`}>
            <h3>{environment.name}</h3>
            <small>{environment.baseUrl}</small>
          </Link>
        </div>
        <div className="actionButtons">
          <EnvironmentFavoriteButton
            environmentId={environment.id}
            isFavorite={environment.isFavorite}
          />
          <Link to={`/environment/${environment.id}/edit`}>
            <FiSettings />
          </Link>
        </div>
      </div>
      <div className="graphContainer">
        {environment.httpResponses.length >= 2 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={environment.httpResponses.reverse()}>
              <Line
                type="monotone"
                dot={false}
                dataKey="responseTimeMs"
                stroke={
                  environment.httpResponses[
                    environment.httpResponses.length - 1
                  ].responseTimeMs > 0
                    ? 'var(--blue)'
                    : 'var(--red)'
                }
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <></>
        )}
      </div>
      <div className="footer">
        <SmallTag kind={environment.kind} expanded />
      </div>
    </div>
  );
}

export default HomeEnvironmentCard;
