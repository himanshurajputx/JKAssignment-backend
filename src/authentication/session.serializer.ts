import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { User } from '../users/entities/user.entity';
@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(
    user: User,
    done: (err: Error | null, id?: User) => void,
  ): void {
    console.log('Serializing user:', user);
    // @ts-ignore
    delete user.password;
    done(null, user);
  }

  deserializeUser(
    payload: unknown,
    done: (err: Error | null, payload?: unknown) => void,
  ): void {
    console.log('Deserializing user:', payload);

    done(null, payload);
  }
}
