import { RolesBuilder } from 'nest-access-control';

/**
 * App Roles Enum
 */
export enum AppRoles {
  DEFAULT = 'DEFAULT',
  ADMIN = 'ADMIN',
}

/**
 * Roles Builder
 */
export const roles: RolesBuilder = new RolesBuilder();

/**
 * Roles permissions grants
 */
roles
  .grant(AppRoles.DEFAULT)
  .readAny('entity')
  .updateAny('entity')
  .deleteAny('entity')
  .grant(AppRoles.ADMIN)
  .readAny('entity')
  .updateAny('entity')
  .deleteAny('entity');
