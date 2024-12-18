import { IKookclub } from './kookclub.interface'; 

export type UpdateKookclub = Partial<Omit<IKookclub, 'recepten'>> & { recepten: string[] };
