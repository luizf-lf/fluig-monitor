import { useState } from 'react';
import SpinnerLoader from './Loaders/Spinner';

interface Props {
  imgSrc: string;
  altName: string;
  fallback: string;
}

export default function DynamicImageLoad({ imgSrc, altName, fallback }: Props) {
  const [imageIsLoaded, setImageIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      <img
        src={imgSrc}
        style={
          imageIsLoaded && !hasError ? { width: '100%' } : { display: 'none' }
        }
        className="server-logo"
        onLoad={() => setImageIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setImageIsLoaded(true);
        }}
        alt={altName}
      />
      <span style={!imageIsLoaded ? {} : { display: 'none' }}>
        <SpinnerLoader />
      </span>
      <img
        src={fallback}
        style={hasError ? {} : { display: 'none' }}
        className="server-logo"
        alt="Fallback"
      />
    </>
  );
}
