import * as Sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import { Document } from 'mongoose';

import server from '../../../server';
import CarModel from '../../../models/Car';
import MotorcycleModel from '../../../models/Motorcycle';
import { validCarMock, coverageCarMock, updatedCarMock, validMotorcycleMock, coverageMotorcycleMock, updatedMotorcycleMock } from '../mocks';
import { Car, Motorcycle } from '../../../interfaces';

const { expect } = chai;
const app = server.getApp();
const carModel = new CarModel();
const motorcycleModel = new MotorcycleModel();

interface IValidCarMock extends Car {
  _id: string;
};

interface IValidMotorcycleMock extends Motorcycle {
  _id: string;
};

type IResponseCar = IValidCarMock & Document;

type IResponseMotorcycle = IValidMotorcycleMock & Document;

chai.use(chaiHttp);

describe('Testa a rota /cars', () => {
  let chaiHttpResponse;
  describe('Testa se é possível listar todos os veículos (GET /cars)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'find')
        .onCall(0).resolves([validCarMock] as IResponseCar[])
        .onCall(1).throws();
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 200 e um array com os veículos', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/cars');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('array');
      expect(chaiHttpResponse.body).to.have.lengthOf(1);
      expect(chaiHttpResponse.body[0]).to.be.an('object');
      expect(chaiHttpResponse.body[0]).to.be.deep.equal(validCarMock);
    });

    it('Deve retornar um http status 500 caso haja algum erro interno', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/cars');

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('Testa se é possível listar um veículo (GET /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'findOne')
        .onCall(0).resolves(validCarMock as IResponseCar)
        .onCall(2).throws();
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 200 e um objeto com as informações do veículo', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/cars/625748f82d58a7817a3afc49');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal(validCarMock);
    });

    it('Deve retornar um http status 400 se o id for inválido', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/cars/625748f82d58a7817a3afc49a');

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.error).to.be.equal('Id must have 24 hexadecimal characters');
    });

    it('Deve retornar um http status 404 se não encontrar um veículo', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/cars/625748f82d58a7817a3afc48');

      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.error).to.be.equal('Object not found');
    });

    it('Deve retornar um http status 500 caso haja algum erro interno', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/cars/625748f82d58a7817a3afc49');

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('Testa se é possível adicionar um veículo (POST /cars)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'create')
        .onCall(0).resolves(validCarMock as IResponseCar)
        .onCall(1).throws()
        .onCall(3).throws();
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 201 e um objeto com as informações do veículo', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/cars')
        .send(coverageCarMock);

      expect(chaiHttpResponse).to.have.status(201);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal(validCarMock);
    });

    it('Deve retornar um http status 500 se não for possível adicionar', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/cars')
        .send(coverageCarMock);

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });

    it('Deve retornar um http status 400 caso falte algum campo', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/cars')
        .send({ ...coverageCarMock, model: undefined });

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.error.name).to.be.equal('ZodError');
    });

    it('Deve retornar um http status 500 caso haja algum erro interno', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/cars')
        .send(coverageCarMock);

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('Testa se é possível editar/atualizar um veículo (PUT /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'findOneAndUpdate')
        .onCall(0).resolves(updatedCarMock as IResponseCar)
        .onCall(2).throws();
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 200 e um objeto com as informações do veículo', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/cars/625748f82d58a7817a3afc49')
        .send({ ...coverageCarMock, buyValue: 4000 });

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal(updatedCarMock);
    });

    it('Deve retornar um http status 400 se o id for inválido', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/cars/625748f82d58a7817a3afc49a')
        .send({ ...coverageCarMock, buyValue: 4000 });

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.error).to.be.equal('Id must have 24 hexadecimal characters');
    });

    it('Deve retornar um http status 404 se não encontrar um veículo ', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/cars/625748f82d58a7817a3afc48')
        .send({ ...coverageCarMock, buyValue: 4000 });

      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.error).to.be.equal('Object not found');
    });

    it('Deve retornar um http status 500 caso haja algum erro interno', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/cars/625748f82d58a7817a3afc49')
        .send({ ...coverageCarMock, buyValue: 4000 });

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('Testa se é possível deletar um veículo (DELETE /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'findOneAndDelete')
        .onCall(0).resolves(validCarMock as IResponseCar)
        .onCall(2).throws();
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 204 e um objeto vazio', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .delete('/cars/625748f82d58a7817a3afc49');

      expect(chaiHttpResponse).to.have.status(204);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal({});
    });

    it('Deve retornar um http status 400 se o id for inválido', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .delete('/cars/625748f82d58a7817a3afc49a');

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.error).to.be.equal('Id must have 24 hexadecimal characters');
    });

    it('Deve retornar um http status 404 se não encontrar um veículo ', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .delete('/cars/625748f82d58a7817a3afc48');

      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.error).to.be.equal('Object not found');
    });

    it('Deve retornar um http status 500 caso haja algum erro interno', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .delete('/cars/625748f82d58a7817a3afc49');

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });
});

describe('Testa a rota /motorcycles', () => {
  let chaiHttpResponse;
  describe('Testa se é possível listar todos os veículos (GET /motorcycles)', () => {

    before(async () => {
      Sinon.stub(motorcycleModel.model, 'find')
        .onCall(0).resolves([validMotorcycleMock] as IResponseMotorcycle[])
        .onCall(1).throws();
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 200 e um array com os veículos', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/motorcycles');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('array');
      expect(chaiHttpResponse.body).to.have.lengthOf(1);
      expect(chaiHttpResponse.body[0]).to.be.an('object');
      expect(chaiHttpResponse.body[0]).to.be.deep.equal(validMotorcycleMock);
    });

    it('Deve retornar um http status 500 caso haja algum erro interno', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/motorcycles');

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('Testa se é possível listar um veículo (GET /motorcycles/:id)', () => {

    before(async () => {
      Sinon.stub(motorcycleModel.model, 'findOne')
        .onCall(0).resolves(validMotorcycleMock as IResponseMotorcycle)
        .onCall(2).throws();
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 200 e um objeto com as informações do veículo', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/motorcycles/625748f82d58a7817a3afc49');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal(validMotorcycleMock);
    });

    it('Deve retornar um http status 400 se o id for inválido', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/motorcycles/625748f82d58a7817a3afc49a');

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.error).to.be.equal('Id must have 24 hexadecimal characters');
    });

    it('Deve retornar um http status 404 se não encontrar um veículo', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/motorcycles/625748f82d58a7817a3afc48');

      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.error).to.be.equal('Object not found');
    });

    it('Deve retornar um http status 500 caso haja algum erro interno', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/motorcycles/625748f82d58a7817a3afc49');

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('Testa se é possível adicionar um veículo (POST /motorcycles)', () => {

    before(async () => {
      Sinon.stub(motorcycleModel.model, 'create')
        .onCall(0).resolves(validMotorcycleMock as IResponseMotorcycle)
        .onCall(1).throws()
        .onCall(3).throws();
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 201 e um objeto com as informações do veículo', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/motorcycles')
        .send(coverageMotorcycleMock);

      expect(chaiHttpResponse).to.have.status(201);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal(validMotorcycleMock);
    });

    it('Deve retornar um http status 500 se não for possível adicionar', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/motorcycles')
        .send(coverageMotorcycleMock);

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });

    it('Deve retornar um http status 400 caso falte algum campo', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/motorcycles')
        .send({ ...coverageMotorcycleMock, model: undefined });

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.error.name).to.be.equal('ZodError');
    });

    it('Deve retornar um http status 500 caso haja algum erro interno', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/motorcycles')
        .send(coverageMotorcycleMock);

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('Testa se é possível editar/atualizar um veículo (PUT /motorcycles/:id)', () => {

    before(async () => {
      Sinon.stub(motorcycleModel.model, 'findOneAndUpdate')
        .onCall(0).resolves(updatedMotorcycleMock as IResponseMotorcycle)
        .onCall(2).throws();
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 200 e um objeto com as informações do veículo', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/motorcycles/625748f82d58a7817a3afc49')
        .send({ ...coverageMotorcycleMock, buyValue: 4000 });

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal(updatedMotorcycleMock);
    });

    it('Deve retornar um http status 400 se o id for inválido', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/motorcycles/625748f82d58a7817a3afc49a')
        .send({ ...coverageMotorcycleMock, buyValue: 4000 });

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.error).to.be.equal('Id must have 24 hexadecimal characters');
    });

    it('Deve retornar um http status 404 se não encontrar um veículo ', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/motorcycles/625748f82d58a7817a3afc48')
        .send({ ...coverageMotorcycleMock, buyValue: 4000 });

      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.error).to.be.equal('Object not found');
    });

    it('Deve retornar um http status 500 caso haja algum erro interno', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/motorcycles/625748f82d58a7817a3afc49')
        .send({ ...coverageMotorcycleMock, buyValue: 4000 });

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });

  describe('Testa se é possível deletar um veículo (DELETE /motorcycles/:id)', () => {

    before(async () => {
      Sinon.stub(motorcycleModel.model, 'findOneAndDelete')
        .onCall(0).resolves(validMotorcycleMock as IResponseMotorcycle)
        .onCall(2).throws();
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 204 e um objeto vazio', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .delete('/motorcycles/625748f82d58a7817a3afc49');

      expect(chaiHttpResponse).to.have.status(204);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal({});
    });

    it('Deve retornar um http status 400 se o id for inválido', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .delete('/motorcycles/625748f82d58a7817a3afc49a');

      expect(chaiHttpResponse).to.have.status(400);
      expect(chaiHttpResponse.body.error).to.be.equal('Id must have 24 hexadecimal characters');
    });

    it('Deve retornar um http status 404 se não encontrar um veículo ', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .delete('/motorcycles/625748f82d58a7817a3afc48');

      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.error).to.be.equal('Object not found');
    });

    it('Deve retornar um http status 500 caso haja algum erro interno', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .delete('/motorcycles/625748f82d58a7817a3afc49');

      expect(chaiHttpResponse).to.have.status(500);
      expect(chaiHttpResponse.body.error).to.be.equal('Internal Server Error');
    });
  });
});