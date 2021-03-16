import { Routes } from 'nest-router';

/**
 * Import local objects
 */
import { UserModule } from '../user';
import { MemberModule } from '../member';
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
        module: MemberModule,
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
  },
];
