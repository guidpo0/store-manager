const sinon = require('sinon');
const { expect } = require('chai');
const ProductsModel = require('../../models/ProductsModel');
const ProductsService = require('../../services/ProductsService');

const payloadProduct = {
  name: 'Example Product',
  quantity: 2000,
};
const newProduct = {
  name: 'New Product',
  quantity: 2000,
};
const ID_EXAMPLE = '604cb554311d68f491ba5781';

describe('1 - Service - Insere um novo produto no BD', () => {
  before(() => {
    sinon.stub(ProductsModel, 'create').resolves({ _id: ID_EXAMPLE });
    sinon.stub(ProductsModel, 'getAll').resolves([{ _id: ID_EXAMPLE, ...payloadProduct }]);
  });
  
  after(() => {
    ProductsModel.create.restore();
    ProductsModel.getAll.restore();
  });

  describe('quando o nome passado no payload já está cadastrado', () => {
    it('retorna um objeto', async () => {
      const response = await ProductsService.create(payloadProduct);
      expect(response).to.be.a('object');
    });

    it('o objeto error contém "code" e "message"', async () => {
      const response = await ProductsService.create(payloadProduct);
      expect(response.err).to.have.a.property('code');
      expect(response.err).to.have.a.property('message');
    });

    it('"code" é "invalid_data"', async () => {
      const response = await ProductsService.create(payloadProduct);
      expect(response.err.code).to.be.a('string', 'invalid_data');
    });

    it('"message" é "Product already exists"', async () => {
      const response = await ProductsService.create(payloadProduct);
      expect(response.err.message).to.be.a('string', 'Product already exists');
    });
  });

  describe('quando é inserido com sucesso', () => {
    it('retorna um objeto', async () => {
      const response = await ProductsService.create(newProduct);
      expect(response).to.be.a('object');
    });

    it('tal objeto possui o "_id" do novo produto inserido', async () => {
      const response = await ProductsService.create(newProduct);
      expect(response).to.have.a.property('_id');
    });
  });
});

describe('2 - Service - Busca produtos no BD,', () => {
  describe('trazendo todos cadastrados.', () => {
    before(async () => {
      sinon.stub(ProductsModel, 'getAll').resolves([{ ...payloadProduct, _id: ID_EXAMPLE }]);
    });
  
    after(() => {
      ProductsModel.getAll.restore();
    });

    it('retorna um array', async () => {
      const response = await ProductsService.getAll();
      expect(response).to.be.a('array');
    });

    it('tal array, possui um objeto com _id, name e quantity', async () => {
      const response = await ProductsService.getAll();
      expect(response[0]).to.have.a.property('_id');
      expect(response[0]).to.have.a.property('name');
      expect(response[0]).to.have.a.property('quantity');
    });

    it('tal objeto corresponde ao que está cadastrado no BD', async () => {
      const response = await ProductsService.getAll();
      expect(response[0]._id).to.be.equal(ID_EXAMPLE);
      expect(response[0].name).to.be.equal(payloadProduct.name);
      expect(response[0].quantity).to.be.equal(payloadProduct.quantity);
    });
  });

  describe('trazendo um produto pelo ID', () => {
    describe('em caso de falha', () => {
      before(async () => {
        sinon.stub(ProductsModel, 'getById').resolves(null);
      });
    
      after(() => {
        ProductsModel.getById.restore();
      });
      
      it('retorna um objeto', async () => {
        const response = await ProductsService.getById(ID_EXAMPLE);
        expect(response).to.be.a('object');
      });
      
      it('o objeto error contém "code" e "message"', async () => {
        const response = await ProductsService.getById(ID_EXAMPLE);
        expect(response.err).to.have.a.property('code');
        expect(response.err).to.have.a.property('message');
      });
  
      it('"code" é "invalid_data"', async () => {
        const response = await ProductsService.getById(ID_EXAMPLE);
        expect(response.err.code).to.be.a('string', 'invalid_data');
      });
  
      it('"message" é "Wrong id format"', async () => {
        const response = await ProductsService.getById(ID_EXAMPLE);
        expect(response.err.message).to.be.a('string', 'Wrong id format');
      });
    });

    describe('em caso de sucesso', () => {
      before(async () => {
        sinon.stub(ProductsModel, 'getById').resolves({ ...payloadProduct, _id: ID_EXAMPLE });
      });
    
      after(() => {
        ProductsModel.getById.restore();
      });

      it('retorna um objeto', async () => {
        const response = await ProductsService.getById(ID_EXAMPLE);
        expect(response).to.be.a('object');
      });
      
      it('o objeto possui _id, name e quantity.', async () => {
        const response = await ProductsService.getById(ID_EXAMPLE);
        expect(response).to.have.a.property('_id');
        expect(response).to.have.a.property('name');
        expect(response).to.have.a.property('quantity');
      });
  
      it('deve existir um produto com o id com o nome cadastrado.', async () => {
        const response = await ProductsService.getById(ID_EXAMPLE);
        const responseContaisProduct = response.name === payloadProduct.name;
        expect(responseContaisProduct).to.be.equal(true);
      });
    });

  });
});
