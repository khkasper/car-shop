import { Schema, model as createModel, Document } from 'mongoose';
import { Car } from '../interfaces';
import MongoModel from './MongoModel';

interface CarDocument extends Car, Document { }

const carSchema = new Schema<CarDocument>({
  model: String,
  year: Number,
  color: String,
  status: Boolean || undefined,
  buyValue: Number,
  doorsQty: Number,
  seatsQty: Number,
}, { versionKey: false });

class CarModel extends MongoModel<Car> {
  constructor(model = createModel('CarShop', carSchema)) {
    super(model);
  }
}

export default CarModel;