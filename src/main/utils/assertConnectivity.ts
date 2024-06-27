import dns from 'dns';

/**
 * Checks if the device is online by resolving some high availability domains.
 * @returns {Promise<boolean>}
 */
const assertConnectivity = async (): Promise<boolean> => {
  try {
    const domains = ['cloudflare.com', 'google.com', 'github.com'];
    const results = await Promise.all(
      domains.map((domain) => {
        return new Promise((resolve, reject) => {
          dns.resolve(domain, (err, address) => {
            if (err) {
              reject(err);
            } else {
              resolve(address);
            }
          });
        });
      })
    );

    return results.some((result) => result);
  } catch (error) {
    return false;
  }
};

export default assertConnectivity;
