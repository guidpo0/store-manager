const sinon = require('sinon');
const { expect } = require('chai');
const ProductsService = require('../../services/ProductsService');
const ProductsController = require('../../controllers/ProductsController');
const ErrorController = require('../../controllers/ErrorController');

const response = {};
const request = {};
const products = [{
  _id: '55454454',
  name: 'Example Product',
  quantity: 2000,
}];
const ID_EXAMPLE = '604cb554311d68f491ba5781';
let next = {};

describe('1 - Controller - Ao chamar o controller de create para produtos', () => {
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
        expect(response.json.calledWith({ err: {
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
        expect(response.json.calledWith({ err: {
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
        expect(response.json.calledWith({ err: {
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
        expect(response.json.calledWith({ err: {
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
        expect(response.json.calledWith({ err: {
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
          err: {
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
        expect(response.json.calledWith({ err: {
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
      sinon.stub(ProductsService, 'create').resolves({ _id: '55454454' });
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
      expect(response.json.calledWith({ ...request.body, _id: '55454454' })).to.be.equal(true);
    });
  });
});

describe('2 - Controller - Ao chamar o controller de busca de produtos', () => {
  describe('pelo getAll', () => {
    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(ProductsService, 'getAll').resolves(products);
    });

    after(() => {
      ProductsService.getAll.restore();
    });

    it('é chamado o status com o código 200', async () => {
      await ProductsController.getAll(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
    });

    it('é chamado o json com os produtos', async () => {
      await ProductsController.getAll(request, response);
      expect(response.json.calledWith({ products })).to.be.equal(true);
    });
  });

  describe('pelo getById', () => {
    describe('quando o id não é válido', () => {
      before(() => {
        request.params = { id: products[0]._id };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(ProductsService, 'getById').resolves({ err: {
          code: 'invalid_data',
          message: 'Wrong id format',
        }});
        next = (error) => ErrorController(error, request, response);
      });

      after(() => {
        ProductsService.getById.restore();
      });

      it('é chamado o status com o código 422', async () => {
        await ProductsController.getById(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });

      it('é chamado o json com os produtos', async () => {
        await ProductsController.getById(request, response, next);
        expect(response.json.calledWith({ err: {
          code: 'invalid_data',
          message: 'Wrong id format',
        }})).to.be.equal(true);
      });
    });

    describe('quando o id é válido', () => {
      before(() => {
        request.params = { id: products[0]._id };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(ProductsService, 'getById').resolves(products[0]);
      });

      after(() => {
        ProductsService.getById.restore();
      });

      it('é chamado o status com o código 200', async () => {
        await ProductsController.getById(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('é chamado o json com o produto', async () => {
        await ProductsController.getById(request, response);
        expect(response.json.calledWith(products[0])).to.be.equal(true);
      });
    });
  });
});

describe('3 - Controller - Ao chamar o controller de update para produtos', () => {
  describe('quando o payload informado não é válido pois', () => {
    describe('o body é enviado sem o name,', () => {
      before(() => {
        request.body = { quantity: 2 };
        request.params = { id: ID_EXAMPLE };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.update(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem "name is required"', async () => {
        await ProductsController.update(request, response, next);
        expect(response.json.calledWith({ err: {
          code: 'invalid_data',
          message: '\"name\" is required',
        }})).to.be.equal(true);
      });
    });

    describe('o body é enviado sem o quantity,', () => {
      before(() => {
        request.body = { name: 'New Example' };
        request.params = { id: ID_EXAMPLE };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.update(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem "quantity is required"', async () => {
        await ProductsController.update(request, response, next);
        expect(response.json.calledWith({ err: {
          code: 'invalid_data',
          message: '\"quantity\" is required',
        }})).to.be.equal(true);
      });
    });

    describe('o name possui menos de 5 caracteres,', () => {
      before(() => {
        request.body = { name: 'Exa', quantity: 1 };
        request.params = { id: ID_EXAMPLE };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.update(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem respectiva', async () => {
        await ProductsController.update(request, response, next);
        expect(response.json.calledWith({ err: {
          code: 'invalid_data',
          message: '\"name\" length must be at least 5 characters long',
        }})).to.be.equal(true);
      });
    });

    describe('quantity é menor que 1,', () => {
      before(() => {
        request.body = { name: 'Example', quantity: -1 };
        request.params = { id: ID_EXAMPLE };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.update(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem respectiva', async () => {
        await ProductsController.update(request, response, next);
        expect(response.json.calledWith({ err: {
          code: 'invalid_data',
          message: '\"quantity\" must be larger than or equal to 1',
        }})).to.be.equal(true);
      });
    });

    describe('quantity é uma string,', () => {
      before(() => {
        request.body = { name: 'Example', quantity: 'b' };
        request.params = { id: ID_EXAMPLE };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.update(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem respectiva', async () => {
        await ProductsController.create(request, response, next);
        expect(response.json.calledWith({ err: {
          code: 'invalid_data',
          message: '\"quantity\" must be a number',
        }})).to.be.equal(true);
      });
    });

    describe('o id não é válido', () => {
      before(() => {
        request.body = { name: 'Example', quantity: 100 };
        request.params = { id: 'dffd4545' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = (error) => ErrorController(error, request, response);
        sinon.stub(ProductsService, 'update').resolves({
          err: {
            code: 'invalid_data',
            message: 'Wrong id format',
          },
        });
      });
  
      after(() => {
        ProductsService.update.restore();
      });
  
      it('é chamado o status com o código 422', async () => {
        await ProductsController.update(request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });
  
      it('é chamado o json com o código "invalid_data" e a mensagem respectiva', async () => {
        await ProductsController.update(request, response, next);
        expect(response.json.calledWith({ err: {
          code: 'invalid_data',
          message: 'Wrong id format',
        }})).to.be.equal(true);
      });
    });
  });

  describe('quando é atualizado com sucesso', () => {
    before(() => {
      request.body = { name: 'Example Product', quantity: 2000 };
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(ProductsService, 'update').resolves({ _id: ID_EXAMPLE, ...request.body });
    });
  
    after(() => {
      ProductsService.update.restore();
    });

    it('é chamado o status com o código 200', async () => {
      await ProductsController.update(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
    });

    it('é chamado o json com as informações do produto', async () => {
      await ProductsController.update(request, response);
      expect(response.json.calledWith({ ...request.body, _id: ID_EXAMPLE })).to.be.equal(true);
    });
  });
});
