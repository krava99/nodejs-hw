import { Joi, Segments } from 'celebrate';

export const createUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(1).max(20),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required(),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).max(50).required(),
  }),
};
