import log from 'electron-log';
import FormValidator from './FormValidator';

interface EnvironmentFormData {
  name: string;
  baseUrl: string;
  kind: string;
  auth: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    tokenSecret: string;
  };
  updateSchedule: {
    scrapeFrequency: string;
    pingFrequency: string;
  };
}

export default class EnvironmentFormValidator extends FormValidator {
  validate(formData: EnvironmentFormData) {
    log.info('EnvironmentFormValidator: Validating form data');

    if (formData) {
      if (formData.name === '') {
        this.lastMessage = 'nameIsRequired';
      } else if (formData.baseUrl === '') {
        this.lastMessage = 'baseUrlIsRequired';
      } else if (formData.auth.consumerKey === '') {
        this.lastMessage = 'consumerKeyIsRequired';
      } else if (formData.auth.consumerSecret === '') {
        this.lastMessage = 'consumerSecretIsRequired';
      } else if (formData.auth.accessToken === '') {
        this.lastMessage = 'accessTokenIsRequired';
      } else if (formData.auth.tokenSecret === '') {
        this.lastMessage = 'tokenSecretIsRequired';
      } else if (formData.updateSchedule.scrapeFrequency === '') {
        this.lastMessage = 'scrapeFrequencyIsRequired';
      } else if (formData.updateSchedule.pingFrequency === '') {
        this.lastMessage = 'pingFrequencyIsRequired';
      } else {
        this.isValid = true;
      }
    }

    return { isValid: this.isValid, lastMessage: this.lastMessage };
  }
}
