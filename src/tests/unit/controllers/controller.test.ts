import chai from 'chai';
import chaiHttp = require('chai-http');
import * as Sinon from 'sinon';
import { describe, it } from 'mocha';
import server from '../../../server';
import CarModel from '../../../models/Car';
import { validCarMock, coverageCarMock } from '../mocks';
import { Car } from '../../../interfaces';
import { Document } from 'mongoose';

const { expect } = chai;
const app = server.getApp();
let carModel = new CarModel();

interface IValidCarMock extends Car {
  _id: string;
};

type IResponse = IValidCarMock & Document;

chai.use(chaiHttp);

describe('Testa os métodos do controller para a rota /cars', () => {
  let chaiHttpResponse;
  describe('Testa se é possível listar todos os veículos (GET /cars)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'find')
        .resolves([validCarMock] as IResponse[]);
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
        .resolves(validCarMock as IResponse);
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
        .resolves(validCarMock as IResponse);
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
        .resolves(validCarMock as IResponse);
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status 200 e um objeto com as informações do veículo', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .put('/cars/625748f82d58a7817a3afc49')
        .send(coverageCarMock);

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.be.deep.equal(validCarMock);
    });
  });

  describe('Testa se é possível deletar um veículo (DELETE /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'findOneAndDelete')
        .resolves(validCarMock as IResponse);
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