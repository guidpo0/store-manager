const { ObjectId } = require('mongodb');
const mongoConnection = require('./connection');

const create = async (products) => {
  const salesCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('sales'));
  const { insertedId: _id } = await salesCollection
    .insertOne({ itensSold: products });
  return {
    _id,
    itensSold: products,
  };
};

const getAll = async () => (
  mongoConnection.getConnection().then(
    (db) => db.collection('sales').find().toArray(),
  )
);

const getById = async (_id) => {
  if (ObjectId.isValid(_id)) {
    return mongoConnection.getConnection().then(
      (db) => db.collection('sales').findOne(ObjectId(_id)),
    );
  }
  return null;
};

const update = async ({ _id, itensSold }) => {
  if (ObjectId.isValid(_id)) {
    return mongoConnection.getConnection().then(
      (db) => db.collection('sales').updateOne(
        { _id: ObjectId(_id) },
        { $set: { itensSold } },
      ),
    ).then(() => getById(_id));
  }
  return null;
};

const remove = async (_id) => {
  if (ObjectId.isValid(_id)) {
    const sale = await getById(_id);
    return mongoConnection.getConnection().then(
      (db) => db.collection('sales').deleteOne(
        { _id: ObjectId(_id) },
      ),
    ).then(() => sale);
  }
  return null;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
