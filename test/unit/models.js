const { expect } = require('chai');
const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const sinon = require('sinon');
const mongoConnection = require('../../models/connection');
const ProductsModel = require('../../models/ProductsModel');

let connectionMock;
const mongoConnectionStub = async () => {
  const DB_NAME = 'StoreManager';
  const DBServer = new MongoMemoryServer();
  const URLMock = await DBServer.getUri();
  connectionMock = await MongoClient
    .connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => conn.db(DB_NAME));      
  sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
};

describe('1 - Model - Insere um novo produto no BD', () => {
  const payloadProduct = {
    name: 'Example Product',
    quantity: 2000,
  };
  
  describe('quando é inserido com sucesso', () => {
    before(mongoConnectionStub);
  
    after(() => {
      mongoConnection.getConnection.restore();
    });

    it('retorna um objeto', async () => {
      const response = await ProductsModel.create(payloadProduct);
      expect(response).to.be.a('object');
    });

    it('tal objeto possui o "_id" do novo produto inserido', async () => {
      const response = await ProductsModel.create(payloadProduct);
      expect(response).to.have.a.property('_id');
    });

    it('deve existir um produto com o nome cadastrado!', async () => {
      await ProductsModel.create(payloadProduct);
      const productsCollection = await connectionMock.collection('products');
      const productCreated = await productsCollection.findOne({ name: payloadProduct.name });
      expect(productCreated).to.be.not.null;
    });
  });
});

describe('2 - Model - Busca produtos no BD,', () => {
  describe('trazendo todos cadastrados.', () => {
    before(async () => {
      const payloadProduct = {
        name: 'Example Product',
        quantity: 2000,
      };
      await mongoConnectionStub();
      await ProductsModel.create(payloadProduct);
    });
  
    after(() => {
      mongoConnection.getConnection.restore();
    });

    it('retorna um array', async () => {
      const response = await ProductsModel.getAll();
      expect(response).to.be.a('array');
    });

    it('é um array de objetos com _id, name e quantity', async () => {
      const response = await ProductsModel.getAll();
      expect(response[0]).to.have.a.property('_id');
      expect(response[0]).to.have.a.property('name');
      expect(response[0]).to.have.a.property('quantity');
    });

    it('deve existir um produto com o nome cadastrado!', async () => {
      const response = await ProductsModel.getAll();
      const responseContaisProduct = response.some(({ name }) => name === 'Example Product');
      expect(responseContaisProduct).to.be.equal(true);
    });
  });

  describe('trazendo um produto pelo ID', () => {
    let id;

    before(async () => {
      const payloadProduct = {
        name: 'Example Product',
        quantity: 2000,
      };
      await mongoConnectionStub();
      const response = await ProductsModel.create(payloadProduct);
      id = response._id;
    });
  
    after(() => {
      mongoConnection.getConnection.restore();
    });

    it('retorna um objeto.', async () => {
      const response = await ProductsModel.getById(id);
      expect(response).to.be.a('object');
    });

    it('é um objeto com _id, name e quantity.', async () => {
      const response = await ProductsModel.getById(id);
      expect(response).to.have.a.property('_id');
      expect(response).to.have.a.property('name');
      expect(response).to.have.a.property('quantity');
    });

    it('deve existir um produto com o id com o nome cadastrado.', async () => {
      const response = await ProductsModel.getById(id);
      const responseContaisProduct = response.name === 'Example Product';
      expect(responseContaisProduct).to.be.equal(true);
    });

    it('se o id passado não estiver cadastrado retorna null', async () => {
      const response = await ProductsModel.getById('example');
      expect(response).to.be.equal(null);
    });
  });
});

describe('3 - Model - Atualiza um produto no BD', () => {
  const payloadProduct = {
    name: 'Example Product',
    quantity: 2000,
  };
  let id;
  
  describe('quando é atualizado com sucesso', () => {
    before(async ()=> {
      await mongoConnectionStub();
      const productId = await ProductsModel.create({ name: 'Example', quantity: 1 });
      id = productId._id;
    });
  
    after(() => {
      mongoConnection.getConnection.restore();
    });

    it('retorna um objeto', async () => {
      const response = await ProductsModel.update({ _id: id, ...payloadProduct });
      expect(response).to.be.a('object');
    });

    it('tal objeto possui o "_id", "name" e "quantity" do produto atualizado', async () => {
      const response = await ProductsModel.update({ _id: id, ...payloadProduct });
      expect(response).to.have.a.property('_id');
      expect(response).to.have.a.property('name');
      expect(response).to.have.a.property('quantity');
    });

    it('deve existir um produto com o nome atualizado', async () => {
      await ProductsModel.update({ _id: id, ...payloadProduct });
      const productsCollection = await connectionMock.collection('products');
      const productUpdated = await productsCollection.findOne({ name: payloadProduct.name });
      expect(productUpdated).to.be.not.null;
    });
  });
});

describe('4 - Model - Exclui um produto no BD', () => {
  const payloadProduct = {
    name: 'Example Product',
    quantity: 2000,
  };
  let id;
  
  describe('quando é excluído com sucesso', () => {
    beforeEach(async ()=> {
      const productId = await ProductsModel.create(payloadProduct);
      id = productId._id;
    });

    before(mongoConnectionStub);
  
    after(() => {
      mongoConnection.getConnection.restore();
    });

    it('retorna um objeto', async () => {
      const response = await ProductsModel.remove(id);
      expect(response).to.be.a('object');
    });

    it('tal objeto possui o "_id", "name" e "quantity" do produto excluído', async () => {
      const response = await ProductsModel.remove(id);
      expect(response).to.have.a.property('_id');
      expect(response).to.have.a.property('name');
      expect(response).to.have.a.property('quantity');
    });

    it('não deve existir um produto com o id excluído', async () => {
      await ProductsModel.remove(id);
      const productsCollection = await connectionMock.collection('products');
      const product = await productsCollection.findOne(ObjectId(id));
      expect(product).to.be.null;
    });
  });
});
