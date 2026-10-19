'use strict';

module.exports = [
  {
    title: 'Viewing one stock: GET request to /api/stock-prices/',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'property', args: ['res.body', "'stockData'"] },
      { method: 'equal', args: ['res.body.stockData.stock', "'GOOG'"] },
      { method: 'typeOf', args: ['res.body.stockData.price', "'number'"] },
      { method: 'typeOf', args: ['res.body.stockData.likes', "'number'"] }
    ]
  },
  {
    title: 'Viewing one stock and liking it: GET request to /api/stock-prices/',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'property', args: ['res.body', "'stockData'"] },
      { method: 'equal', args: ['res.body.stockData.stock', "'AAPL'"] },
      { method: 'typeOf', args: ['res.body.stockData.price', "'number'"] },
      { method: 'typeOf', args: ['res.body.stockData.likes', "'number'"] },
      { method: 'isAtLeast', args: ['res.body.stockData.likes', '1'] }
    ]
  },
  {
    title: 'Viewing the same stock and liking it again: GET request to /api/stock-prices/',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'property', args: ['res.body', "'stockData'"] },
      { method: 'equal', args: ['res.body.stockData.stock', "'AAPL'"] },
      { method: 'typeOf', args: ['res.body.stockData.price', "'number'"] },
      { method: 'typeOf', args: ['res.body.stockData.likes', "'number'"] },
      { method: 'equal', args: ['res.body.stockData.likes', 'likedStockLikes'] }
    ]
  },
  {
    title: 'Viewing two stocks: GET request to /api/stock-prices/',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'property', args: ['res.body', "'stockData'"] },
      { method: 'isArray', args: ['res.body.stockData'] },
      { method: 'equal', args: ['res.body.stockData.length', '2'] },
      { method: 'equal', args: ['res.body.stockData[0].stock', "'GOOG'"] },
      { method: 'typeOf', args: ['res.body.stockData[0].price', "'number'"] },
      { method: 'property', args: ['res.body.stockData[0]', "'rel_likes'"] },
      { method: 'equal', args: ['res.body.stockData[1].stock', "'MSFT'"] },
      { method: 'typeOf', args: ['res.body.stockData[1].price', "'number'"] },
      { method: 'property', args: ['res.body.stockData[1]', "'rel_likes'"] },
      { method: 'equal', args: ['res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes', '0'] }
    ]
  },
  {
    title: 'Viewing two stocks and liking them: GET request to /api/stock-prices/',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      { method: 'equal', args: ['res.status', '200'] },
      { method: 'property', args: ['res.body', "'stockData'"] },
      { method: 'isArray', args: ['res.body.stockData'] },
      { method: 'equal', args: ['res.body.stockData.length', '2'] },
      { method: 'typeOf', args: ['res.body.stockData[0].price', "'number'"] },
      { method: 'property', args: ['res.body.stockData[0]', "'rel_likes'"] },
      { method: 'typeOf', args: ['res.body.stockData[1].price', "'number'"] },
      { method: 'property', args: ['res.body.stockData[1]', "'rel_likes'"] },
      { method: 'equal', args: ['res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes', '0'] }
    ]
  }
];
