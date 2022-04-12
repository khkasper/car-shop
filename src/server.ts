import CustomRouter from './routes/Router';
import App from './app';

import CarController from './controllers/Car';
import MotorcycleController from './controllers/Motorcycle';

import { Car, Motorcycle } from './interfaces';

const server = new App();

const carController = new CarController();
const motorcycleController = new MotorcycleController();

const carRouter = new CustomRouter<Car>();
carRouter.addRoute(carController);

const motorcycleRouter = new CustomRouter<Motorcycle>();
motorcycleRouter.addRoute(motorcycleController);

server.addRouter(carRouter.router);
server.addRouter(motorcycleRouter.router);

export default server;