const sinon = require('sinon');
const { expect } = require('chai');
const ProductsService = require('../../services/ProductsService');
const ProductsController = require('../../controllers/ProductsController');
const ErrorController = require('../../controllers/ErrorController');

describe('1 - Controller - Ao chamar o controller de create para produtos', () => {
  describe('quando o payload informado não é válido', () => {
    const response = {};
    const request = {};
    let next;

    before(() => {
      request.body = {};
      response.status = sinon.stub()
      .returns(response);
      response.json = sinon.stub()
      .returns();
      next = (error) => ErrorController(error, request, response);
      // sinon.stub(ProductsService, 'create')
      //   .resolves(false);
    });

    // after(() => {
    //   MoviesService.create.restore();
    // });

    it('é chamado o status com o código 400', async () => {
      await ProductsController.create(request, response, next);
      expect(response.status.calledWith(400)).to.be.equal(true);
    });

    it('é chamado o json com a mensagem "Dados inválidos"', async () => {
      await ProductsController.create(request, response, next);
      expect(response.json.calledWith({ message: 'Dados inválidos' })).to.be.equal(true);
    });
  });

  // describe('quando é inserido com sucesso', () => {
  //   const response = {};
  //   const request = {};

  //   before(() => {
  //     request.body = {
  //       name: 'Example Product',
  //       quantity: 2000,
  //     };
  //     response.status = sinon.stub()
  //       .returns(response);
  //     response.json = sinon.stub()
  //       .returns();
  //   });

  //   it('é chamado o status com o código 201', async () => {
  //     await ProductsController.create(request, response);
  //     expect(response.status.calledWith(201)).to.be.equal(true);
  //   });

  //   it('é chamado o json com a mensagem "Filme criado com sucesso!"', async () => {
  //     await ProductsController.create(request, response);
  //     expect(response.json.calledWith({ message: 'Producto criado com sucesso!' })).to.be.equal(true);
  //   });
  // });
});
