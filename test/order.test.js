require('dotenv').config({
	path: './test.env',
});

const mongoose = require('mongoose');
const Order = require('../models/order.model');
const jwt = require('jsonwebtoken');
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../models/users.model');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('api/order', () => {
	/*
	 * Test the /GET route
	 */
	describe('/POST', () => {
		beforeEach((done) => {
			//Before each test we empty the database
			Order.deleteMany({}).then(() => {
				done();
			});
		});
		it('它應該依產品ID建立訂單', (done) => {
			(async () => {
				const user = await User.findOne();
				const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_DAY,
				});

				const body = {
					productId: '628f4384ed7cdd7d4d735444',
				};
				chai
					.request(app)
					.post('/api/order')
					.set('authorization', token)
					.send(body)
					.end((err, res) => {
						res.should.have.status(201);
						res.body.should.be.a('object');
						res.body.status.should.be.eql('success');
						res.body.data.should.be.a('object');
						done();
					});
			})();
		});
	});
	describe('/GET status', () => {
		it('它應該依訂單ID查詢狀態', (done) => {
			(async () => {
				const order = await Order.findOne();
				chai
					.request(app)
					.get(`/api/order/status?orderId=${order.id}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('status');
						res.body.should.have.property('data');
						res.body.data.should.have.property('status');
						res.body.data.should.have.property('message');
						done();
					});
			})();
		});
	});
});
