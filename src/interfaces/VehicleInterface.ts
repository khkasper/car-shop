import { z } from 'zod';

const VehicleSchema = z.object({
  model: z
    .string({
      required_error: 'Model is required',
      invalid_type_error: 'Model must be a string',
    })
    .min(3, { message: 'Model must be 3 or more characters long' }),
  year: z
    .number({
      required_error: 'Year is required',
      invalid_type_error: 'Year must be a number',
    })
    .min(1900, { message: 'Year must be 1900 or higher' })
    .max(2022, { message: 'Year must be 2002 or lower' }),
  color: z
    .string({
      required_error: 'Color is required',
      invalid_type_error: 'Color must be a string',
    })
    .min(3, { message: 'Model must be 3 or more characters long' }),
  status: z.boolean().optional(),
  buyValue: z
    .number({
      required_error: 'buyValue is required',
      invalid_type_error: 'buyValue must be an integer',
    }),
});

  type Vehicle = z.infer<typeof VehicleSchema>;

export { Vehicle, VehicleSchema };