import { expect } from 'chai';
import * as Sinon from 'sinon';
import { describe, it } from 'mocha';
import CarService from '../../../services/Car';
import { validCarMock, coverageCarMock, updatedCarMock } from '../mocks';

const carService = new CarService();

describe('Testa os métodos do service para a rota /cars', () => {
  let result;
  describe('Testa se é possível listar todos os veículos (GET /cars)', () => {

    before(async () => {
      Sinon.stub(carService, 'read')
        .resolves([validCarMock]);
    });

    after(() => Sinon.restore());

    it('Deve retornar um array com os veículos', async () => {
      result = await carService.read();

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.an('object');
      expect(result[0]).to.be.deep.equal(validCarMock);
    });
  });

  describe('Testa se é possível listar um veículo (GET /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carService, 'readOne')
        .resolves(validCarMock);
    });

    after(() => Sinon.restore());

    it('Deve retornar um objeto com as informações do veículo', async () => {
      result = await carService.readOne(validCarMock._id);

      expect(result).to.be.an('object');
      expect(result).to.be.deep.equal(validCarMock);
    });
  });

  describe('Testa se é possível adicionar um veículo (POST /cars)', () => {

    before(async () => {
      Sinon.stub(carService, 'create')
        .resolves(validCarMock);
    });

    after(() => Sinon.restore());

    it('Deve retornar um objeto com as informações do veículo', async () => {
      result = await carService.create(coverageCarMock);

      expect(result).to.be.an('object');
      expect(result).to.be.deep.equal(validCarMock);
    });
  });

  describe('Testa se é possível editar/atualizar um veículo (PUT /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carService, 'update')
        .resolves(updatedCarMock);
    });

    after(() => Sinon.restore());

    it('Deve retornar um objeto com as informações do veículo', async () => {
      result = await carService.update(validCarMock._id, { ...validCarMock, buyValue: 4000 });

      expect(result).to.be.an('object');
      expect(result).to.be.deep.equal(updatedCarMock);
    });
  });

  describe('Testa se é possível deletar um veículo (DELETE /cars/:id)', () => {

    before(async () => {
      Sinon.stub(carService, 'delete')
        .resolves(validCarMock);
    });

    after(() => Sinon.restore());

    it('Deve retornar um objeto com as informações do veículo', async () => {
      result = await carService.delete(validCarMock._id);

      expect(result).to.be.an('object');
      expect(result).to.be.deep.equal(validCarMock);
    });
  });
});