const sinon = require('sinon');
const { expect } = require('chai');
const ProductsModel = require('../../models/ProductsModel');
const ProductsService = require('../../services/ProductsService');
const SalesModel = require('../../models/SalesModel');
const SalesService = require('../../services/SalesService');

const payloadProduct = {
  name: 'Example Product',
  quantity: 2000,
};
const newProduct = {
  name: 'New Product',
  quantity: 2000,
};
const ID_EXAMPLE = '604ab554311d68f491ba5781';
const payloadSales = [
  {
    productId: ID_EXAMPLE,
    quantity: payloadProduct.quantity,
  },
];

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

describe('3 - Service - Atualiza um produto no BD', () => {
  describe('em caso de falha', () => {
    before(async () => {
      sinon.stub(ProductsModel, 'update').resolves(null);
    });
  
    after(() => {
      ProductsModel.update.restore();
    });
    
    it('retorna um objeto', async () => {
      const response = await ProductsService.update({ _id: ID_EXAMPLE, ...payloadProduct });
      expect(response).to.be.a('object');
    });
    
    it('o objeto error contém "code" e "message"', async () => {
      const response = await ProductsService.update({ _id: ID_EXAMPLE, ...payloadProduct });
      expect(response.err).to.have.a.property('code');
      expect(response.err).to.have.a.property('message');
    });

    it('"code" é "invalid_data"', async () => {
      const response = await ProductsService.update({ _id: ID_EXAMPLE, ...payloadProduct });
      expect(response.err.code).to.be.a('string', 'invalid_data');
    });

    it('"message" é "Wrong id format"', async () => {
      const response = await ProductsService.update({ _id: ID_EXAMPLE, ...payloadProduct });
      expect(response.err.message).to.be.a('string', 'Wrong id format');
    });
  });

  describe('em caso de sucesso', () => {
    before(async () => {
      sinon.stub(ProductsModel, 'update').resolves({ _id: ID_EXAMPLE, ...payloadProduct });
    });
  
    after(() => {
      ProductsModel.update.restore();
    });

    it('retorna um objeto', async () => {
      const response = await ProductsService.update({ _id: ID_EXAMPLE, ...payloadProduct });
      expect(response).to.be.a('object');
    });
    
    it('o objeto possui _id, name e quantity.', async () => {
      const response = await ProductsService.update({ _id: ID_EXAMPLE, ...payloadProduct });
      expect(response).to.have.a.property('_id');
      expect(response).to.have.a.property('name');
      expect(response).to.have.a.property('quantity');
    });
  });
});

describe('4 - Service - Exclui um produto no BD', () => {
  describe('em caso de falha', () => {
    before(async () => {
      sinon.stub(ProductsModel, 'remove').resolves(null);
    });
  
    after(() => {
      ProductsModel.remove.restore();
    });
    
    it('retorna um objeto', async () => {
      const response = await ProductsService.remove(ID_EXAMPLE);
      expect(response).to.be.a('object');
    });
    
    it('o objeto error contém "code" e "message"', async () => {
      const response = await ProductsService.remove(ID_EXAMPLE);
      expect(response.err).to.have.a.property('code');
      expect(response.err).to.have.a.property('message');
    });

    it('"code" é "invalid_data"', async () => {
      const response = await ProductsService.remove(ID_EXAMPLE);
      expect(response.err.code).to.be.a('string', 'invalid_data');
    });

    it('"message" é "Wrong id format"', async () => {
      const response = await ProductsService.remove(ID_EXAMPLE);
      expect(response.err.message).to.be.a('string', 'Wrong id format');
    });
  });

  describe('em caso de sucesso', () => {
    before(async () => {
      sinon.stub(ProductsModel, 'remove').resolves({ _id: ID_EXAMPLE, ...payloadProduct });
    });
  
    after(() => {
      ProductsModel.remove.restore();
    });

    it('retorna um objeto', async () => {
      const response = await ProductsService.remove(ID_EXAMPLE);
      expect(response).to.be.a('object');
    });
    
    it('o objeto possui _id, name e quantity.', async () => {
      const response = await ProductsService.remove(ID_EXAMPLE);
      expect(response).to.have.a.property('_id');
      expect(response).to.have.a.property('name');
      expect(response).to.have.a.property('quantity');
    });
  });
});

describe('5 - Service - Insere uma nova venda no BD', () => {
  describe('quando algum productId passado não existe', () => {
    before(() => {
      sinon.stub(ProductsModel, 'getById').resolves(null);
    });
    
    after(() => {
      ProductsModel.getById.restore();
    });

    it('retorna um objeto', async () => {
      const response = await SalesService.create(payloadSales);
      expect(response).to.be.a('object');
    });

    it('o objeto error contém "code" e "message"', async () => {
      const response = await SalesService.create(payloadSales);
      expect(response.err).to.have.a.property('code');
      expect(response.err).to.have.a.property('message');
    });

    it('"code" é "invalid_data"', async () => {
      const response = await SalesService.create(payloadSales);
      expect(response.err.code).to.be.a('string', 'invalid_data');
    });

    it('"message" é "Wrong Product Id or invalid quantity"', async () => {
      const response = await SalesService.create(payloadSales);
      expect(response.err.message).to.be.a('string', 'Wrong Product Id or invalid quantity');
    });
  });

  describe('quando é inserido com sucesso', () => {
    before(() => {
      sinon.stub(SalesModel, 'create').resolves({ _id: ID_EXAMPLE, itensSold: payloadSales });
      sinon.stub(ProductsModel, 'getById').resolves({ _id: ID_EXAMPLE, ...payloadProduct });
    });
    
    after(() => {
      SalesModel.create.restore();
      ProductsModel.getById.restore();
    });

    it('retorna um objeto', async () => {
      const response = await SalesService.create(payloadSales);
      expect(response).to.be.a('object');
    });

    it('tal objeto possuem o "_id" e "itensSold"', async () => {
      const response = await SalesService.create(payloadSales);
      expect(response).to.have.a.property('_id');
      expect(response).to.have.a.property('itensSold');
    });

    it('"itensSold" deve ser um array de objetos com as chaves "productId" e "quantity"', async () => {
      const response = await SalesService.create(payloadSales);
      expect(response.itensSold[0]).to.have.a.property('productId');
      expect(response.itensSold[0]).to.have.a.property('quantity');
    });
  });
});

describe('6 - Service - Busca vendas no BD,', () => {
  describe('trazendo todas cadastradas.', () => {
    before(async () => {
      sinon.stub(SalesModel, 'getAll').resolves([{ itensSold:payloadSales, _id: ID_EXAMPLE }]);
    });
  
    after(() => {
      SalesModel.getAll.restore();
    });

    it('retorna um array', async () => {
      const response = await SalesService.getAll();
      expect(response).to.be.a('array');
    });

    it('tal array, possui um objeto com _id e itensSold', async () => {
      const response = await SalesService.getAll();
      expect(response[0]).to.have.a.property('_id');
      expect(response[0]).to.have.a.property('itensSold');
    });

    it('tal objeto corresponde ao que está cadastrado no BD', async () => {
      const response = await SalesService.getAll();
      expect(response[0]._id).to.be.equal(ID_EXAMPLE);
      expect(response[0].itensSold).to.be.equal(payloadSales);
    });
  });

  describe('trazendo uma venda pelo ID', () => {
    describe('em caso de falha', () => {
      before(async () => {
        sinon.stub(SalesModel, 'getById').resolves(null);
      });
    
      after(() => {
        SalesModel.getById.restore();
      });
      
      it('retorna um objeto', async () => {
        const response = await SalesService.getById(ID_EXAMPLE);
        expect(response).to.be.a('object');
      });
      
      it('o objeto error contém "code" e "message"', async () => {
        const response = await SalesService.getById(ID_EXAMPLE);
        expect(response.err).to.have.a.property('code');
        expect(response.err).to.have.a.property('message');
      });
  
      it('"code" é "not_found"', async () => {
        const response = await SalesService.getById(ID_EXAMPLE);
        expect(response.err.code).to.be.a('string', 'not_found');
      });
  
      it('"message" é "Sale not found"', async () => {
        const response = await SalesService.getById(ID_EXAMPLE);
        expect(response.err.message).to.be.a('string', 'Sale not found');
      });
    });

    describe('em caso de sucesso', () => {
      before(async () => {
        sinon.stub(SalesModel, 'getById').resolves({ itensSold: payloadSales, _id: ID_EXAMPLE });
      });
    
      after(() => {
        SalesModel.getById.restore();
      });

      it('retorna um objeto', async () => {
        const response = await SalesService.getById(ID_EXAMPLE);
        expect(response).to.be.a('object');
      });
      
      it('o objeto possui _id e itensSold', async () => {
        const response = await SalesService.getById(ID_EXAMPLE);
        expect(response).to.have.a.property('_id');
        expect(response).to.have.a.property('itensSold');
      });
    });
  });
});

describe('7 - Service - Atualiza uma venda no BD', () => {
  describe('em caso de falha', () => {
    before(async () => {
      sinon.stub(ProductsModel, 'getById').resolves(null);
      sinon.stub(SalesModel, 'update').resolves(null);
    });
    
    after(() => {
      ProductsModel.getById.restore();
      SalesModel.update.restore();
    });
    
    it('retorna um objeto', async () => {
      const response = await SalesService.update({ _id: ID_EXAMPLE, itensSold: payloadSales });
      expect(response).to.be.a('object');
    });
    
    it('o objeto error contém "code" e "message"', async () => {
      const response = await SalesService.update({ _id: ID_EXAMPLE, itensSold: payloadSales });
      expect(response.err).to.have.a.property('code');
      expect(response.err).to.have.a.property('message');
    });

    it('"code" é "invalid_data"', async () => {
      const response = await SalesService.update({ _id: ID_EXAMPLE, itensSold: payloadSales });
      expect(response.err.code).to.be.a('string', 'invalid_data');
    });

    it('"message" é "Wrong product ID or invalid quantity"', async () => {
      const response = await SalesService.update({ _id: ID_EXAMPLE, itensSold: payloadSales });
      expect(response.err.message).to.be.a('string', 'Wrong product ID or invalid quantity');
    });
  });

  describe('em caso de sucesso', () => {
    before(async () => {
      sinon.stub(SalesModel, 'getById').resolves({ _id: ID_EXAMPLE, itensSold: payloadSales });
      sinon.stub(ProductsModel, 'getById').resolves({ _id: ID_EXAMPLE, ...payloadProduct });
      sinon.stub(ProductsModel, 'update').resolves();
      sinon.stub(SalesModel, 'update').resolves({ _id: ID_EXAMPLE, itensSold: payloadSales });
    });
    
    after(() => {
      SalesModel.getById.restore();
      ProductsModel.getById.restore();
      ProductsModel.update.restore();
      SalesModel.update.restore();
    });

    it('retorna um objeto', async () => {
      const response = await SalesService.update({ _id: ID_EXAMPLE, itensSold: payloadSales });
      expect(response).to.be.a('object');
    });
    
    it('o objeto possui _id e itensSold', async () => {
      const response = await SalesService.update({ _id: ID_EXAMPLE, itensSold: payloadSales });
      expect(response).to.have.a.property('_id');
      expect(response).to.have.a.property('itensSold');
    });
  });
});

describe('8 - Service - Exclui uma venda no BD', () => {
  describe('em caso de falha', () => {
    before(async () => {
      sinon.stub(SalesModel, 'getById').resolves(null);
      sinon.stub(SalesModel, 'remove').resolves(null);
    });
  
    after(() => {
      SalesModel.getById.restore();
      SalesModel.remove.restore();
    });
    
    it('retorna um objeto', async () => {
      const response = await SalesService.remove(ID_EXAMPLE);
      expect(response).to.be.a('object');
    });
    
    it('o objeto error contém "code" e "message"', async () => {
      const response = await SalesService.remove(ID_EXAMPLE);
      expect(response.err).to.have.a.property('code');
      expect(response.err).to.have.a.property('message');
    });

    it('"code" é "invalid_data"', async () => {
      const response = await SalesService.remove(ID_EXAMPLE);
      expect(response.err.code).to.be.a('string', 'invalid_data');
    });

    it('"message" é "Wrong sale ID format"', async () => {
      const response = await SalesService.remove(ID_EXAMPLE);
      expect(response.err.message).to.be.a('string', 'Wrong sale ID format');
    });
  });

  describe('em caso de sucesso', () => {
    before(async () => {
      sinon.stub(SalesModel, 'remove').resolves({ _id: ID_EXAMPLE, itensSold: payloadSales });
      sinon.stub(SalesModel, 'getById').resolves({ _id: ID_EXAMPLE, itensSold: payloadSales });
      sinon.stub(ProductsModel, 'update').resolves();
      sinon.stub(ProductsModel, 'getById').resolves({ _id: ID_EXAMPLE, ...payloadProduct });
    });
  
    after(() => {
      SalesModel.remove.restore();
      SalesModel.getById.restore();
      ProductsModel.update.restore();
      ProductsModel.getById.restore();
    });

    it('retorna um objeto', async () => {
      const response = await SalesService.remove(ID_EXAMPLE);
      expect(response).to.be.a('object');
    });
    
    it('o objeto possui _id e itensSold', async () => {
      const response = await SalesService.remove(ID_EXAMPLE);
      expect(response).to.have.a.property('_id');
      expect(response).to.have.a.property('itensSold');
    });
  });
});
