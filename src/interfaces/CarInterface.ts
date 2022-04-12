import { z } from 'zod';
import { VehicleSchema } from './VehicleInterface';

const CarSchema = VehicleSchema.extend({
  doorsQty: z
    .number({
      required_error: 'Doors quantity is required',
      invalid_type_error: 'Doors quantity must be a number',
    })
    .min(2, { message: 'Doors quantity must be 2 or higher' })
    .max(4, { message: 'Doors quantity must be 4 or lower' }),
  seatsQty: z
    .number({
      required_error: 'Seats quantity is required',
      invalid_type_error: 'Seats quantity must be a number',
    })
    .min(2, { message: 'Seats quantity must be 2 or higher' })
    .max(7, { message: 'Seats quantity must be 7 or lower' }),
});

type Car = z.infer<typeof CarSchema>;

export { Car, CarSchema };