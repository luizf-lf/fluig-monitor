import EnvironmentDataInterface from '../../common/interfaces/EnvironmentDataInterface';

const formUtils = {
  validate(formData: EnvironmentDataInterface) {
    let isValid = false;
    let message = '';
    if (formData) {
      if (formData.name === '') {
        message = 'Nome do ambiente é obrigatório.';
      } else if (formData.baseUrl === '') {
        message = 'Endereço do ambiente é obrigatório.';
      } else if (formData.auth.consumerKey === '') {
        message = 'Consumer Key é obrigatório.';
      } else if (formData.auth.consumerSecret === '') {
        message = 'Consumer Secret ambiente é obrigatório.';
      } else if (formData.auth.accessToken === '') {
        message = 'Access Token é obrigatório.';
      } else if (formData.auth.tokenSecret === '') {
        message = 'Token Secret é obrigatório.';
      } else if (formData.update.from === '' || formData.update.to === '') {
        message = 'Horário de atualização é obrigatório.';
      } else {
        isValid = true;
      }
    }

    return { isValid, message };
  },
};

export default formUtils;
