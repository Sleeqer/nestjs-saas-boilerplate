import EntityHandlers from '../../../modules/entity/handler/entity.handler';
import ApplicationHandlers from '../../../modules/application/handler/application.handler';
import OrganizationHandlers from '../../../modules/organization/handler/organization.handler';

/**
 * Handlers of messages
 */
export default [
  ...EntityHandlers,
  ...ApplicationHandlers,
  ...OrganizationHandlers,
];
