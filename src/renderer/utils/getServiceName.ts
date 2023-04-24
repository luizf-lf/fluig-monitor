enum FluigServices {
  MSOffice = 'MS Office',
  analytics = 'Analytics',
  licenseServer = 'License Server',
  mailServer = 'Mail Server',
  openOffice = 'Open Office',
  realTime = 'Fluig Realtime',
  solrServer = 'Solr Server',
  viewer = 'Fluig Viewer',
  unknown = 'UNKNOWN',
}

/**
 * Returns a string with the name of a Fluig Server service.
 * @since 0.1.0
 */
export default function getServiceName(id: string): FluigServices {
  switch (id) {
    case 'MSOffice':
      return FluigServices.MSOffice;
    case 'analytics':
      return FluigServices.analytics;
    case 'licenseServer':
      return FluigServices.licenseServer;
    case 'mailServer':
      return FluigServices.mailServer;
    case 'openOffice':
      return FluigServices.openOffice;
    case 'realTime':
      return FluigServices.realTime;
    case 'solrServer':
      return FluigServices.solrServer;
    case 'viewer':
      return FluigServices.viewer;
    default:
      return FluigServices.unknown;
  }
}
