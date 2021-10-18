const { expect } = require('chai');
const { MongoClient } = require('mongodb');
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
      useUnifiedTopology: true
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
      expect(response).to.be.a('object')
    });

    it('tal objeto possui o "id" do novo produto inserido', async () => {
      const response = await ProductsModel.create(payloadProduct);
      expect(response).to.have.a.property('id');
    });

    it('deve existir um produto com o nome cadastrado!', async () => {
      await ProductsModel.create(payloadProduct);
      const productCreated = await connectionMock.collection(
        'products',
      ).findOne({ name: productCreated.name });
      expect(productCreated).to.be.not.null;
    });
  });
});
