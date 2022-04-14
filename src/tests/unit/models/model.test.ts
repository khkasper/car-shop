import * as Sinon from 'sinon';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import CarModel from '../../../models/Car';
import { validCarMock, coverageCarMock, updatedCarMock } from '../mocks';
import { Car } from '../../../interfaces';
import { Document } from 'mongoose';

const carModel = new CarModel();

interface IValidCarMock extends Car {
  _id: string;
};

type IResponse = IValidCarMock & Document;

describe('Testa os métodos do model para a rota /cars', () => {
  let result;
  describe('Testa se é possível listar todos os veículos (GET /cars)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'find')
        .resolves([validCarMock] as IResponse[]);
    });

    after(() => Sinon.restore());

    it('Deve retornar um array com os veículos', async () => {
      result = await carModel.read();
      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('object');
      expect(result[0]).to.be.deep.equal(validCarMock);
    });
  });

  describe('Testa se é possível listar um veículo (GET /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'findOne')
        .resolves(validCarMock as IResponse);
    });

    after(() => Sinon.restore());

    it('Deve retornar um objeto com as informações do veículo', async () => {
      result = await carModel.readOne(validCarMock._id);

      expect(result).to.be.an('object');
      expect(result).to.be.deep.equal(validCarMock);
    });
  });

  describe('Testa se é possível adicionar um veículo (POST /cars)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'create')
        .resolves(validCarMock);
    });

    after(() => Sinon.restore());

    it('Deve retornar um objeto com as informações do veículo', async () => {
      result = await carModel.create(coverageCarMock);

      expect(result).to.be.an('object');
      expect(result).to.be.deep.equal(validCarMock);
    });
  });

  describe('Testa se é possível editar/atualizar um veículo (PUT /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'findOneAndUpdate')
        .resolves(updatedCarMock as IResponse);
    });

    after(() => Sinon.restore());

    it('Deve retornar um objeto com as informações do veículo', async () => {
      result = await carModel.update(validCarMock._id, { ...validCarMock, buyValue: 4000 });

      expect(result).to.be.an('object');
      expect(result).to.be.deep.equal(updatedCarMock);
    });
  });

  describe('Testa se é possível deletar um veículo (DELETE /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carModel.model, 'findOneAndDelete')
        .resolves(validCarMock as IResponse);
    });

    after(() => Sinon.restore());

    it('Deve retornar um objeto com as informações do veículo', async () => {
      result = await carModel.delete(validCarMock._id);

      expect(result).to.be.an('object');
      expect(result).to.be.deep.equal(validCarMock);
    });
  });
});