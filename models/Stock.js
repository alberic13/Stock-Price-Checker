'use strict';

const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true, unique: true },
  likes: { type: [String], default: [] }
});

const Stock = mongoose.models.Stock || mongoose.model('Stock', stockSchema);

// In-memory fallback store when MongoDB is not connected
const memoryStore = new Map();

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

async function getLikesCount(symbol) {
  const sym = symbol.toUpperCase();
  if (isDbConnected()) {
    const doc = await Stock.findOne({ symbol: sym });
    return doc ? doc.likes.length : 0;
  }
  const set = memoryStore.get(sym);
  return set ? set.size : 0;
}

async function addLike(symbol, hashedIP) {
  const sym = symbol.toUpperCase();
  if (isDbConnected()) {
    const doc = await Stock.findOneAndUpdate(
      { symbol: sym },
      { $addToSet: { likes: hashedIP } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return doc.likes.length;
  }

  let set = memoryStore.get(sym);
  if (!set) {
    set = new Set();
    memoryStore.set(sym, set);
  }
  if (hashedIP) {
    set.add(hashedIP);
  }
  return set.size;
}

module.exports = {
  Stock,
  getLikesCount,
  addLike,
  isDbConnected
};
