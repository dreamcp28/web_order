import { User } from '../models/User';
import { Role } from '../models/Role';

// 扩展Express的Request接口，添加user和role属性
declare module 'express' {
  interface Request {
    user?: User;
    role?: Role;
  }
}
