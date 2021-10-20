const sinon = require('sinon');
const { expect } = require('chai');
const ProductsService = require('../../services/ProductsService');
const ProductsController = require('../../controllers/ProductsController');
const ErrorController = require('../../controllers/ErrorController');

describe('1 - Controller - Ao chamar o controller de create para produtos', () => {
  const response = {};
  const request = {};
  let next;
  describe('quando o payload informado não é válido pois', () => {
    describe('o body é enviado sem o name,', () => {
      before(() => {
        request.body = { quantity: 1 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.create(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem "name is required"', async () => {
        await ProductsController.create(request, response, next);
        expect(response.json.calledWith({ error: {
          code: 'invalid_data',
          message: '\"name\" is required',
        }})).to.be.equal(true);
      });
    });

    describe('o body é enviado sem o quantity,', () => {
      before(() => {
        request.body = { name: 'Example' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.create(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem "quantity is required"', async () => {
        await ProductsController.create(request, response, next);
        expect(response.json.calledWith({ error: {
          code: 'invalid_data',
          message: '\"quantity\" is required',
        }})).to.be.equal(true);
      });
    });

    describe('o name possui menos de 5 caracteres,', () => {
      before(() => {
        request.body = { name: 'Exam', quantity: 1 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.create(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem respectiva', async () => {
        await ProductsController.create(request, response, next);
        expect(response.json.calledWith({ error: {
          code: 'invalid_data',
          message: '\"name\" length must be at least 5 characters long',
        }})).to.be.equal(true);
      });
    });

    describe('quantity é menor que 1,', () => {
      before(() => {
        request.body = { name: 'Example', quantity: 0 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.create(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem respectiva', async () => {
        await ProductsController.create(request, response, next);
        expect(response.json.calledWith({ error: {
          code: 'invalid_data',
          message: '\"quantity\" must be larger than or equal to 1',
        }})).to.be.equal(true);
      });
    });

    describe('quantity é uma string,', () => {
      before(() => {
        request.body = { name: 'Example', quantity: 'a' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.create(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem respectiva', async () => {
        await ProductsController.create(request, response, next);
        expect(response.json.calledWith({ error: {
          code: 'invalid_data',
          message: '\"quantity\" must be a number',
        }})).to.be.equal(true);
      });
    });

    describe('o produto já existe,', () => {
      before(() => {
        request.body = { name: 'Example', quantity: 100 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
        sinon.stub(ProductsService, 'create').resolves({
          error: {
            code: 'invalid_data',
            message: 'Product already exists',
          },
        });
      });
  
      after(() => {
        ProductsService.create.restore();
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.create(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem respectiva', async () => {
        await ProductsController.create(request, response, next);
        expect(response.json.calledWith({ error: {
          code: 'invalid_data',
          message: 'Product already exists',
        }})).to.be.equal(true);
      });
    });

  });

  describe('quando é inserido com sucesso', () => {
    before(() => {
      request.body = { name: 'Example Product', quantity: 2000 };
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(ProductsService, 'create').resolves({ id: '55454454' });
    });
  
    after(() => {
      ProductsService.create.restore();
    });

    it('é chamado o status com o código 201', async () => {
      await ProductsController.create(request, response);
      expect(response.status.calledWith(201)).to.be.equal(true);
    });

    it('é chamado o json com as informações do produto', async () => {
      await ProductsController.create(request, response);
      expect(response.json.calledWith({ ...request.body, id: '55454454' })).to.be.equal(true);
    });
  });
});
