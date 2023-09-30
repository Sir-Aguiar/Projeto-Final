class ResponseHandler {
  constructor(response) {
    this.response = response;
  }

  /**
   * @param {number} status Status da requisição
   * @param {object | undefined} body Corpo a ser atribuído na requisição
   * @returns Retorna uma resposta json
   */
  sendJson(status, body) {
    return this.response.status(status).json(body || {});
  }

  /**
   * @param {object | undefined} body
   * @returns Retorna um status 200, indicando que tudo ocorreu bem
   */
  ok(body) {
    return this.sendJson(200, body || {});
  }

  /**
   * @param {object | undefined} body
   * @returns Retorna status 201, para requisições de criação (POST)
   */
  created(body) {
    return this.sendJson(201, body || {});
  }

  /**
   * @param {string} message
   * @returns Retorna status 400, usado para uma requisição que não foi feita corretamente
   */
  clientError(message) {
    return this.sendJson(400, { error: { message } });
  }

  /**
   * @param {string} message
   * @returns Retorna status 401, usado para uma requisição que não tem acesso aos serviços
   */
  unauthorized(message) {
    return this.sendJson(401, { error: { message } });
  }

  /**
   * @param {string} message
   * @returns Retorna status 403, usado para uma requisição que não lfoi permitida
   */
  forbidden(message) {
    return this.sendJson(403, { error: { message } });
  }

  /**
   * @param {string} message
   * @returns Retorna status 404, usado para uma requisição que não levou a resultados
   */
  notFound(message) {
    return this.sendJson(404, { error: { message } });
  }

  /**
   * @param {string} message
   * @param {Error} error
   * @returns Usado para erros internos, geralmente erros desconhecidos
   */
  fail(message, error) {
    console.log(error);
    return this.sendJson(500, {
      error: {
        message: message || "Houve um erro desconhecido, isto foi um problema interno. Aguarde aguns instantes",
      },
    });
  }

  databaseConnectionFail(message, error) {
    console.log(error);
    return this.sendJson(500, {
      error: {
        message:
          message || "Nosso banco de dados se encontra fora do ar neste momento, tente novamente em alguns instantes",
      },
    });
  }

  databaseTimeout(message, error) {
    console.log(error);
    return this.sendJson(500, {
      error: {
        message: message || "Nosso banco de dados esta sobrecarregado, aguarde alguns instantes",
      },
    });
  }
}

module.exports = ResponseHandler;
