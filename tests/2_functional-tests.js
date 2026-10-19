const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(10000);

  let likedStockLikes = 0;

  test('Viewing one stock: GET request to /api/stock-prices/', function (done) {
    chai.request(server)
      .keepOpen()
      .get('/api/stock-prices')
      .query({ stock: 'GOOG' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.typeOf(res.body.stockData.price, 'number');
        assert.typeOf(res.body.stockData.likes, 'number');
        done();
      });
  });

  test('Viewing one stock and liking it: GET request to /api/stock-prices/', function (done) {
    chai.request(server)
      .keepOpen()
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.equal(res.body.stockData.stock, 'AAPL');
        assert.typeOf(res.body.stockData.price, 'number');
        assert.typeOf(res.body.stockData.likes, 'number');
        assert.isAtLeast(res.body.stockData.likes, 1);
        likedStockLikes = res.body.stockData.likes;
        done();
      });
  });

  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function (done) {
    chai.request(server)
      .keepOpen()
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.equal(res.body.stockData.stock, 'AAPL');
        assert.typeOf(res.body.stockData.price, 'number');
        assert.typeOf(res.body.stockData.likes, 'number');
        assert.equal(res.body.stockData.likes, likedStockLikes);
        done();
      });
  });

  test('Viewing two stocks: GET request to /api/stock-prices/', function (done) {
    chai.request(server)
      .keepOpen()
      .get('/api/stock-prices')
      .query({ stock: ['GOOG', 'MSFT'] })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData.length, 2);
        assert.equal(res.body.stockData[0].stock, 'GOOG');
        assert.typeOf(res.body.stockData[0].price, 'number');
        assert.property(res.body.stockData[0], 'rel_likes');
        assert.equal(res.body.stockData[1].stock, 'MSFT');
        assert.typeOf(res.body.stockData[1].price, 'number');
        assert.property(res.body.stockData[1], 'rel_likes');
        assert.equal(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 0);
        done();
      });
  });

  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function (done) {
    chai.request(server)
      .keepOpen()
      .get('/api/stock-prices')
      .query({ stock: ['GOOG', 'MSFT'], like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData.length, 2);
        assert.typeOf(res.body.stockData[0].price, 'number');
        assert.property(res.body.stockData[0], 'rel_likes');
        assert.typeOf(res.body.stockData[1].price, 'number');
        assert.property(res.body.stockData[1], 'rel_likes');
        assert.equal(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 0);
        done();
      });
  });
});
