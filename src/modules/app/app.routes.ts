import { Routes } from 'nest-router';

/**
 * Import local objects
 */
import { OrganizationModule } from '../organization';
import { ConversationModule } from '../conversation';
import { ApplicationModule } from '../application';
import { MessageModule } from '../message';
import { ProfileModule } from '../profile';
import { MemberModule } from '../member';

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
        path: '/:conversation/messages',
        module: MessageModule,
      },
      {
        path: '/:conversation/members',
        module: MemberModule,
      },
    ],
  },
];
