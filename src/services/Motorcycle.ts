import { Motorcycle, MotorcycleSchema } from '../interfaces';
import Service, { ServiceError } from '.';
import MotorcycleModel from '../models/Motorcycle';

class MotorcycleService extends Service<Motorcycle> {
  constructor(public model = new MotorcycleModel()) {
    super(model);
  }

  create = async (obj: Motorcycle): 
  Promise<Motorcycle | ServiceError | null> => {
    const parsed = MotorcycleSchema.safeParse(obj);

    if (!parsed.success) return { error: parsed.error };

    return this.model.create(obj);
  };
}

export default MotorcycleService;