import { z } from 'zod';
import { VehicleSchema } from './VehicleInterface';

const MotorcycleSchema = VehicleSchema.extend({
  category: z
    .enum(['Street', 'Custom', 'Trail']),
  engineCapacity: z
    .number({
      required_error: 'Engine capacity is required',
      invalid_type_error: 'Engine capacity must be a number',
    })
    .min(1, 'Engine capacity must be 1 or higher')
    .max(2500, 'Engine capacity must be 2500 or lower'),
});

type Motorcycle = z.infer<typeof MotorcycleSchema>;

export { Motorcycle, MotorcycleSchema };