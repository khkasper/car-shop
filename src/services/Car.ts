import { Car, CarSchema } from '../interfaces';
import Service, { ServiceError } from '.';
import CarModel from '../models/Car';

class CarService extends Service<Car> {
  constructor(public model = new CarModel()) {
    super(model);
  }

  create = async (obj: Car): Promise<Car | ServiceError | null> => {
    const parsed = CarSchema.safeParse(obj);

    if (!parsed.success) return { error: parsed.error };

    return this.model.create(obj);
  };
}

export default CarService;