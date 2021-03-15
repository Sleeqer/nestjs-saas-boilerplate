import { Routes } from 'nest-router';

/**
 * Import local objects
 */
import { MemberModule } from '../member/member.module';
import { ApplicationModule } from '../application/application.module';
import { OrganizationModule } from '../organization/organization.module';

/**
 * Defining & exporting routes
 */
export const routes: Routes = [
  {
    path: '/organizations',
    module: OrganizationModule,
    children: [
      {
        path: '/:organization/members',
        module: MemberModule,
      },
      {
        path: '/:organization/applications',
        module: ApplicationModule,
      },
    ],
  },
];
