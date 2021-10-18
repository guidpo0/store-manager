const sinon = require('sinon');
const { expect } = require('chai');
const ProductsModel = require('../../models/ProductsModel');

const ProductsService = {
  create: () => null,
};

describe('1 - Service - Insere um novo produto no BD', () => {
  describe('quando o payload informado não é válido', () => {
    const payloadProduct = {};

    it('retorna um boolean', async () => {
      const response = await ProductsService.create(payloadProduct);
      expect(response).to.be.a('boolean');
    });

    it('o boolean contém "false"', async () => {
      const response = await ProductsService.create(payloadProduct);
      expect(response).to.be.equal(false);
    });
  });

  describe('quando é inserido com sucesso', () => {
    const payloadProduct = {
      name: 'Example Product',
      quantity: 2000,
    };

    before(() => {
      const ID_EXAMPLE = '604cb554311d68f491ba5781';
      sinon.stub(ProductsModel, 'create')
        .resolves({ id: ID_EXAMPLE });
    });

    after(() => {
      ProductsModel.create.restore();
    });

    it('retorna um objeto', async () => {
      const response = await ProductsService.create(payloadProduct);
      expect(response).to.be.a('object');
    });

    it('tal objeto possui o "id" do novo produto inserido', async () => {
      const response = await ProductsService.create(payloadProduct);
      expect(response).to.have.a.property('id');
    });
  });
});
