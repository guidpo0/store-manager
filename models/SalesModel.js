// const { ObjectId } = require('mongodb');
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

// const getAll = async () => (
//   mongoConnection.getConnection().then(
//     (db) => db.collection('products').find().toArray(),
//   )
// );

// const getById = async (_id) => {
//   if (ObjectId.isValid(_id)) {
//     return mongoConnection.getConnection().then(
//       (db) => db.collection('products').findOne(ObjectId(_id)),
//     );
//   }
//   return null;
// };

// const update = async ({ _id, name, quantity }) => {
//   if (ObjectId.isValid(_id)) {
//     return mongoConnection.getConnection().then(
//       (db) => db.collection('products').updateOne(
//         { _id: Object(_id) },
//         { $set: { name, quantity } },
//       ),
//     ).then(() => getById(_id));
//   }
//   return null;
// };

// const remove = async (_id) => {
//   if (ObjectId.isValid(_id)) {
//     const product = await getById(_id);
//     return mongoConnection.getConnection().then(
//       (db) => db.collection('products').deleteOne(
//         { _id: ObjectId(_id) },
//       ),
//     ).then(() => product);
//   }
//   return null;
// };

module.exports = {
  create,
  // getAll,
  // getById,
  // update,
  // remove,
};
