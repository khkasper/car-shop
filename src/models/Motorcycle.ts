import { Schema, model as createModel, Document } from 'mongoose';
import { Motorcycle } from '../interfaces';
import MongoModel from './MongoModel';

interface MotorcycleDocument extends Motorcycle, Document { }

const MotorcycleSchema = new Schema<MotorcycleDocument>({
  model: String,
  year: Number,
  color: String,
  status: Boolean || undefined,
  buyValue: Number,
  category: String,
  engineCapacity: Number,
}, { versionKey: false });

class MotorcycleModel extends MongoModel<Motorcycle> {
  constructor(model = createModel('MotorcycleShop', MotorcycleSchema)) {
    super(model);
  }
}

export default MotorcycleModel;