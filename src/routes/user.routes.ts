import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema, updateUserSchema, userIdSchema } from '../schemas/user.schema';
import { z } from 'zod';

const router = Router();

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get user by ID
router.get(
  '/:id',
  validate(z.object({ params: userIdSchema })),
  getUserById
);

// POST /api/users - Create new user
router.post(
  '/',
  validate(z.object({ body: createUserSchema })),
  createUser
);

// PUT /api/users/:id - Update user
router.put(
  '/:id',
  validate(z.object({ params: userIdSchema, body: updateUserSchema })),
  updateUser
);

// DELETE /api/users/:id - Delete user
router.delete(
  '/:id',
  validate(z.object({ params: userIdSchema })),
  deleteUser
);

export default router;
