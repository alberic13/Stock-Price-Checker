'use strict';

const stockService = require('../services/stockService');

function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';
}

exports.getStockPrices = async (req, res) => {
  try {
    const { stock, like } = req.query;
    if (!stock) {
      return res.status(400).json({ error: 'stock query parameter is required' });
    }

    const isLike = like === true || like === 'true' || like === '1';
    const clientIP = getClientIP(req);

    if (Array.isArray(stock)) {
      if (stock.length < 2) {
        const stockData = await stockService.getSingleStock(stock[0], isLike, clientIP);
        return res.json({ stockData });
      }
      const stockData = await stockService.getTwoStocks(stock[0], stock[1], isLike, clientIP);
      return res.json({ stockData });
    }

    const stockData = await stockService.getSingleStock(stock, isLike, clientIP);
    return res.json({ stockData });
  } catch (error) {
    console.error('Error in getStockPrices:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
