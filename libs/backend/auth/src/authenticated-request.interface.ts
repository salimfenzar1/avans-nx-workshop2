import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    user_id: string;
    name: string; 
    email?: string; // E-mailadres van de gebruiker
    profileImgUrl?: string; // Profielfoto-URL van de gebruiker
    role?: string; // Rol van de gebruiker (bijvoorbeeld 'Admin' of 'User')
    [key: string]: any; // Voor andere velden in de payload

  };
}
