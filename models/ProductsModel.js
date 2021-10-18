const mongoConnection = require('./connection');

const create = async ({ name, quantity }) => {
  const productsCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('products'));
  const { insertedId: id } = await productsCollection
    .insertOne({ name, quantity });
  return {
    id,
  };
};

module.exports = {
  create,
};
