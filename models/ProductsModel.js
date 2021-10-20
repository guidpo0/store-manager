const { ObjectId } = require('mongodb');
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

const getById = async (_id) => {
  if (ObjectId.isValid(_id)) {
    return mongoConnection.getConnection().then(
      (db) => db.collection('products').findOne(ObjectId(_id)),
    );
  }
  return null;
};

const update = async ({ _id, name, quantity }) => {
  if (ObjectId.isValid(_id)) {
    return mongoConnection.getConnection().then(
      (db) => db.collection('products').updateOne(
        { _id: Object(_id) },
        { $set: { name, quantity } },
      ),
    ).then(() => getById(_id));
  }
  return null;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
};
