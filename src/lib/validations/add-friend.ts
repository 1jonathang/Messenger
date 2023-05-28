// allows us to define schemas that validate the user input
import { z } from 'zod';

export const addFriendValidator = z.object({
    email: z.string().email(),
})
