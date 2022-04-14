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
        .resolves([validCarMock] as IResponseCar[]);
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
  });

  describe('Testa se é possível listar um veículo (GET /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'findOne')
        .resolves(validCarMock as IResponseCar);
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
  });

  describe('Testa se é possível adicionar um veículo (POST /cars)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'create')
        .resolves(validCarMock as IResponseCar);
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
  });

  describe('Testa se é possível editar/atualizar um veículo (PUT /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'findOneAndUpdate')
        .resolves(updatedCarMock as IResponseCar);
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
  });

  describe('Testa se é possível deletar um veículo (DELETE /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'findOneAndDelete')
        .resolves(validCarMock as IResponseCar);
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
  });
});

describe('Testa a rota /motorcycle', () => {
  let chaiHttpResponse;
  describe('Testa se é possível listar todas as motos (GET /motorcycles)', () => {

    before(async () => {
      Sinon.stub(motorcycleModel.model, 'find')
        .resolves([validMotorcycleMock] as IResponseMotorcycle[]);
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 200 e um array com as motos', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/motorcycles');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('array');
      expect(chaiHttpResponse.body).to.have.lengthOf(1);
      expect(chaiHttpResponse.body[0]).to.be.an('object');
      expect(chaiHttpResponse.body[0]).to.be.deep.equal(validMotorcycleMock);
    });
  });

  describe('Testa se é possível listar uma moto (GET /motorcycles/:id)', () => {

    before(async () => {
      Sinon.stub(motorcycleModel.model, 'findOne')
        .resolves(validMotorcycleMock as IResponseMotorcycle);
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 200 e um objeto com as informações da moto', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/motorcycles/625748f82d58a7817a3afc49');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal(validMotorcycleMock);
    });
  });

  describe('Testa se é possível adicionar uma moto (POST /motorcycles)', () => {

    before(async () => {
      Sinon.stub(motorcycleModel.model, 'create')
        .resolves(validMotorcycleMock as IResponseMotorcycle);
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 201 e um objeto com as informações da moto', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/motorcycles')
        .send(coverageMotorcycleMock);

      expect(chaiHttpResponse).to.have.status(201);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal(validMotorcycleMock);
    });
  });

  describe('Testa se é possível editar/atualizar uma moto (PUT /motorcycles/:id)', () => {

    before(async () => {
      Sinon.stub(motorcycleModel.model, 'findOneAndUpdate')
        .resolves(updatedMotorcycleMock as IResponseMotorcycle);
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 200 e um objeto com as informações da moto', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/motorcycles/625748f82d58a7817a3afc49')
        .send({ ...coverageMotorcycleMock, buyValue: 4000 });

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal(updatedMotorcycleMock);
    });
  });

  describe('Testa se é possível deletar uma moto (DELETE /motorcycle/:id)', () => {

    before(async () => {
      Sinon.stub(motorcycleModel.model, 'findOneAndDelete')
        .resolves(validMotorcycleMock as IResponseMotorcycle);
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
  });
});