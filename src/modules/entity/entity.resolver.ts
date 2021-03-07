import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { Entity } from './entity.entity';
import { EntityService } from './entity.service';

/**
 * Entity Resolver Class
 */
@Resolver((of) => Entity)
export class EntityResolver {
  /**
   * Constructor of Entity Resolver Class
   * @param {EntityService} service Entity Service
   */
  constructor(private readonly service: EntityService) {}

  /**
   *
   * @returns
   */
  @Query((returns) => [Entity], { name: 'entities', nullable: false })
  async entities() {
    return this.service.all();
  }
}
