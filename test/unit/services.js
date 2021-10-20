const sinon = require('sinon');
const { expect } = require('chai');
const ProductsModel = require('../../models/ProductsModel');
const ProductsService = require('../../services/ProductsService');

describe('1 - Service - Insere um novo produto no BD', () => {
  const payloadProduct = {
    repeated: {
      name: 'Example Product',
      quantity: 2000,
    },
    new: {
      name: 'New Product',
      quantity: 2000,
    },
  };
  
  before(() => {
    const ID_EXAMPLE = '604cb554311d68f491ba5781';
    sinon.stub(ProductsModel, 'create')
      .resolves({ id: ID_EXAMPLE });
    sinon.stub(ProductsModel, 'getAll')
      .resolves([payloadProduct.repeated]);
  });
  
  after(() => {
    ProductsModel.create.restore();
    ProductsModel.getAll.restore();
  });

  describe('quando o nome passado no payload já está cadastrado', () => {
    it('retorna um objeto', async () => {
      const response = await ProductsService.create(payloadProduct.repeated);
      expect(response).to.be.a('object');
    });

    it('o objeto error contém "code" e "message"', async () => {
      const response = await ProductsService.create(payloadProduct.repeated);
      expect(response.error).to.have.a.property('code');
      expect(response.error).to.have.a.property('message');
    });

    it('"code" é "invalid_data"', async () => {
      const response = await ProductsService.create(payloadProduct.repeated);
      expect(response.error.code).to.be.a('string', 'invalid_data');
    });

    it('"message" é "Product already exists"', async () => {
      const response = await ProductsService.create(payloadProduct.repeated);
      expect(response.error.message).to.be.a('string', 'Product already exists');
    });
  });

  describe('quando é inserido com sucesso', () => {
    it('retorna um objeto', async () => {
      const response = await ProductsService.create(payloadProduct.new);
      expect(response).to.be.a('object');
    });

    it('tal objeto possui o "id" do novo produto inserido', async () => {
      const response = await ProductsService.create(payloadProduct.new);
      expect(response).to.have.a.property('id');
    });
  });
});
