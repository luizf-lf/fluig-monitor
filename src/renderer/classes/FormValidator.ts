export default class FormValidator {
  /**
   * Last helper message from the validator
   */
  lastMessage: string;

  /**
   * If the form is valid
   */
  isValid: boolean;

  constructor() {
    this.isValid = false;
    this.lastMessage = 'Form not properly validated';
  }
}
