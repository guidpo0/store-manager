const mongoConnection = require('./connection');

const create = async ({ name, quantity }) => {
  const productsCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('products'));
  const { insertedId: _id } = await productsCollection
    .insertOne({ name, quantity });
  return {
    _id,
  };
};

const getAll = async () => (
  mongoConnection.getConnection().then(
    (db) => db.collection('products').find().toArray(),
  )
);

const getById = async (id) => (
  mongoConnection.getConnection().then(
    (db) => db.collection('products').findOne({ id }).toArray(),
  )
);

module.exports = {
  create,
  getAll,
  getById,
};
