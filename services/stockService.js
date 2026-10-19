'use strict';

const crypto = require('crypto');
const { getLikesCount, addLike } = require('../models/Stock');

const quoteCache = new Map();
const CACHE_TTL_MS = 30000;

function anonymizeIP(ip) {
  return crypto.createHash('sha256').update(ip || '127.0.0.1').digest('hex');
}

async function fetchQuote(symbol) {
  const sym = symbol.toUpperCase();
  const cached = quoteCache.get(sym);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.quote;
  }

  const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${encodeURIComponent(sym)}/quote`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock quote: ${response.statusText}`);
  }
  const data = await response.json();
  quoteCache.set(sym, {
    quote: data,
    expiresAt: Date.now() + CACHE_TTL_MS
  });
  return data;
}

function parsePrice(quote) {
  if (typeof quote === 'object' && quote !== null && typeof quote.latestPrice === 'number') {
    return quote.latestPrice;
  }
  const numeric = Number(quote?.latestPrice);
  return isNaN(numeric) ? 0 : numeric;
}

async function getSingleStock(symbol, isLike, clientIP) {
  const sym = String(symbol).trim().toUpperCase();
  const quote = await fetchQuote(sym);
  const price = parsePrice(quote);

  let likes;
  if (isLike) {
    const hashedIP = anonymizeIP(clientIP);
    likes = await addLike(sym, hashedIP);
  } else {
    likes = await getLikesCount(sym);
  }

  return {
    stock: sym,
    price: price,
    likes: likes
  };
}

async function getTwoStocks(symbol1, symbol2, isLike, clientIP) {
  const [data1, data2] = await Promise.all([
    getSingleStock(symbol1, isLike, clientIP),
    getSingleStock(symbol2, isLike, clientIP)
  ]);

  return [
    {
      stock: data1.stock,
      price: data1.price,
      rel_likes: data1.likes - data2.likes
    },
    {
      stock: data2.stock,
      price: data2.price,
      rel_likes: data2.likes - data1.likes
    }
  ];
}

module.exports = {
  fetchQuote,
  getSingleStock,
  getTwoStocks,
  anonymizeIP
};
