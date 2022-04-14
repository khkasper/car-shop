import * as Sinon from 'sinon';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Request, Response } from 'express';

import CarController from '../../../controllers/Car';
import { RequestWithBody } from '../../../controllers';
import { validCarMock, coverageCarMock, updatedCarMock } from '../mocks';
import { Car } from '../../../interfaces';

const carController = new CarController();

interface Id extends Request { params: { id: string } };

describe('Testa os métodos do controller para a rota /cars', () => {
  describe('Testa se é possível listar todos os veículos (GET /cars)', () => {

    const response = {} as Response;
    const request = {} as Request;

    before(async () => {
      response.status = Sinon.stub()
        .returns(response);
      response.json = Sinon.stub()
        .returns([validCarMock]);

      Sinon.stub(carController.service, 'read').resolves([validCarMock]);
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status OK e um array com os veículos', async () => {
      await carController.read(request, response);

      expect((response.status as Sinon.SinonStub).calledWith(200)).to.be.eq(true);
      expect((response.json as Sinon.SinonStub).calledWith([validCarMock])).to.be.eq(true);
    });
  });

  describe('Testa se é possível adicionar um veículo (POST /cars)', () => {

    const response = {} as Response;
    const request = {} as RequestWithBody<Car>;

    before(async () => {
      response.status = Sinon.stub()
        .returns(response);
      response.json = Sinon.stub()
        .returns(validCarMock);

      Sinon.stub(carController.service, 'create').resolves(validCarMock);
    });

    after(() => Sinon.restore());

    it('Deve retornar um http status CREATED e um array com os veículos', async () => {
      await carController.create(request, response);

      expect((response.status as Sinon.SinonStub).calledWith(201)).to.be.eq(true);
      expect((response.json as Sinon.SinonStub).calledWith(validCarMock)).to.be.eq(true);
    });
  });
});