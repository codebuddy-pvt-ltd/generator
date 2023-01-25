import * as Joi from 'joi';

export const validate = (
  data: { [id: string]: any },
  schema: Joi.Schema,
  options: Joi.ValidationOptions = {},
) => schema.validate(data, options);
