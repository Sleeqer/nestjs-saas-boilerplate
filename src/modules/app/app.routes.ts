import { Routes } from 'nest-router';

/**
 * Import local objects
 */
import { MemberModule } from '../member';
import { ProfileModule } from '../profile';
import { ApplicationModule } from '../application';
import { OrganizationModule } from '../organization';
import { ConversationModule } from '../conversation';

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
        module: ProfileModule,
      },
      {
        path: '/:organization/applications',
        module: ApplicationModule,
      },
    ],
  },
  {
    path: '/conversations',
    module: ConversationModule,
    children: [
      {
        path: '/:conversation/members',
        module: MemberModule,
      },
    ],
  },
];
