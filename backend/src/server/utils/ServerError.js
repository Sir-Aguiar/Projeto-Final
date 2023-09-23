/**
 * Esta é uma classe que ajuda na identificação e apresentação de erros que acontecem no servidor e devem ser notificados ao usuário
 */
class ServerError {
  /**
   @param {string} message Mensagem de erro que deve ser exibida
   @param {number} status Código do erro, geralmente usado para retornar uma resposta do servidor
   @param {string | undefined} stack Uma trilha de onde ocorreu o erro
   */

  constructor(message, status, stack) {
    this.message = message;
    this.status = status;
    this.stack = stack;
  }
}

module.exports = ServerError;
