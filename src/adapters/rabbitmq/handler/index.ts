import OrganizationHandlers from '../../../modules/organization/handler/organization.handler';
import ApplicationHandlers from '../../../modules/application/handler/application.handler';
import EntityHandlers from '../../../modules/entity/handler/entity.handler';

/**
 * Handlers of messages
 */
export default [
  ...EntityHandlers,
  ...ApplicationHandlers,
  ...OrganizationHandlers,
];
