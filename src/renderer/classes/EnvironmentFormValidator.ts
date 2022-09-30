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
  update: {
    frequency: string;
    from: string;
    to: string;
    onlyOnWorkDays: boolean;
  };
}

export default class EnvironmentFormValidator extends FormValidator {
  validate(formData: EnvironmentFormData) {
    log.info('EnvironmentFormValidator: Validating form data');

    // TODO: Implement message id's for i18n instead of fixed messages
    if (formData) {
      if (formData.name === '') {
        this.lastMessage = 'Nome do ambiente é obrigatório.';
      } else if (formData.baseUrl === '') {
        this.lastMessage = 'Endereço do ambiente é obrigatório.';
      } else if (formData.auth.consumerKey === '') {
        this.lastMessage = 'Consumer Key é obrigatório.';
      } else if (formData.auth.consumerSecret === '') {
        this.lastMessage = 'Consumer Secret ambiente é obrigatório.';
      } else if (formData.auth.accessToken === '') {
        this.lastMessage = 'Access Token é obrigatório.';
      } else if (formData.auth.tokenSecret === '') {
        this.lastMessage = 'Token Secret é obrigatório.';
      } else if (formData.update.from === '' || formData.update.to === '') {
        this.lastMessage = 'Horário de atualização é obrigatório.';
      } else {
        this.isValid = true;
      }
    }

    return { isValid: this.isValid, lastMessage: this.lastMessage };
  }
}
