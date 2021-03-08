import { Entity, ObjectIdColumn, Column, ManyToOne } from 'typeorm';

/**
 * Import local objects
 */

import { ObjectID } from 'mongodb';
import { AppRoles } from './app.roles';
import { Profile } from '../profile/profile.entity';

/**
 * Roles Entity Class
 */
@Entity()
export class Roles {
  /**
   * Id column
   */
  @ObjectIdColumn()
  _id: number | string | ObjectID;

  /**
   * Column for role based access
   * Beware this default app role will permit every created profile to delete other profiles
   */
  @Column({
    type: 'enum',
    enum: AppRoles,
    default: AppRoles.DEFAULT,
  })
  role: AppRoles = AppRoles.DEFAULT;
}
