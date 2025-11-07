/**
 * Cursor-based pagination helpers.
 * Cursor is base64 encoded JSON: { createdAt: ISOString, _id: idString }
 */

const encodeCursor = (doc) => {
  if (!doc) return null;
  const payload = {
    createdAt: doc.createdAt.toISOString(),
    _id: doc._id.toString(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

const decodeCursor = (cursor) => {
  if (!cursor) return null;
  try {
    const json = Buffer.from(cursor, 'base64').toString('utf8');
    const obj = JSON.parse(json);
    return { createdAt: new Date(obj.createdAt), _id: obj._id };
  } catch (err) {
    return null;
  }
};

module.exports = {
  encodeCursor,
  decodeCursor,
};
