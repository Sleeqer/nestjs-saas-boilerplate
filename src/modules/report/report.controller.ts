import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiProperty,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  Patch,
  HttpCode,
  Delete,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

/**
 * Import local objects
 */
import { BaseEntityController } from '../common/entity/controller/entity.controller';
import { ConversationService } from '../conversation/conversation.service';
import { ConversationInterceptor } from '../conversation/interceptor';
import { ApplicationGuard } from '../common/guards/application.guard';
import { ReportPopulateEnum } from './enum/report.populator.enum';
import { Report, ReportDocument } from './report.entity';
import { UserInterceptor } from '../user/interceptor';
import { FastifyRequestInterface } from '../common';
import { ReportService } from './report.service';
import { ParseIdPipe } from '../common/pipes';
import {
  Pagination,
  Query as QueryPagination,
} from '../common/entity/pagination';
import {
  ReportCreatePayload,
  ReportReplacePayload,
  ReportUpdatePayload,
} from './payload';
import { Loader } from './pipe';

/**
 * Report Paginate Response Class
 */
export class ReportPaginateResponse extends Pagination<Report> {
  /**
   * Results field
   */
  @ApiProperty({ type: [Report] })
  results: Report[];
}

/**
 * Report Controller Class
 */
@ApiBearerAuth()
@ApiTags('reports')
@Controller('reports')
export class ReportController extends BaseEntityController<
  Report,
  ReportDocument
> {
  /**
   * Constructor of Report Controller Class
   * @param {ReportService} service Report Service
   */
  constructor(
    protected readonly service: ReportService,
    protected readonly conversation: ConversationService,
  ) {
    super(service);
  }

  /**
   * Paginate Report objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Pagination<Report>>} Paginated Report objects
   */
  @Get('')
  @UseGuards(AuthGuard('application.key'))
  @ApiOperation({ summary: 'Paginate Report objects.' })
  @ApiResponse({
    status: 200,
    description: `Report List Request Received.`,
    type: ReportPaginateResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Report List Request Failed.',
  })
  async index(
    @Query() parameters: QueryPagination,
    @Req() request: FastifyRequestInterface,
  ): Promise<Pagination<Report>> {
    /**
     * Adjusting parameters for finding
     */
    parameters.filter = { application: request.application._id };
    parameters.populator = [
      ReportPopulateEnum.REPORTER,
      ReportPopulateEnum.CONVERSATION,
      ReportPopulateEnum.USER,
      ReportPopulateEnum.CONVERSATION_MEMBERS,
      ReportPopulateEnum.CONVERSATION_AUTHOR,
    ];

    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Report by id
   * @param {number | string} id Report's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Report>} Report's object
   */
  @Get(':id')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Retrieve Report By ID.' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve Report Request Received.',
    type: Report,
  })
  @ApiResponse({
    status: 400,
    description: 'Retrieve Report Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Retrieve Report Request Failed (Not found).',
  })
  async get(
    @Param('id', Loader)
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<Report> {
    return request.locals.report;
  }

  /**
   * Replace Report by id
   * @param {number | string} id Report's id
   * @param {ReportReplacePayload} payload Report's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Report>} Report's object
   */
  @Put(':id')
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Replace Report By ID.',
    description: '**Inserts** Report If It does not exists By ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Report Replace Request Received.',
    type: Report,
  })
  @ApiResponse({
    status: 400,
    description: 'Report Replace Request Failed.',
  })
  async replace(
    @Param('id', ParseIdPipe) id: number | string,
    @Body() payload: ReportReplacePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Report> {
    return await this.service.replace(id, payload);
  }

  /**
   * Update Report by id
   * @param {number | string} id Report's id
   * @param {ReportUpdatePayload} payload Report's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Report>} Report's object
   */
  @Patch(':id')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Update Report by id.' })
  @ApiResponse({
    status: 200,
    description: 'Report Update Request Received.',
    type: Report,
  })
  @ApiResponse({
    status: 400,
    description: 'Report Update Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Report Update Request Failed (Not found).',
  })
  async update(
    @Param('id', Loader) id: number | string,
    @Body() payload: ReportUpdatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Report> {
    return await this.service.update(request.locals.report, payload);
  }

  /**
   * Delete Report by id
   * @param {number | string} id Report's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Report By ID.' })
  @ApiResponse({
    status: 204,
    description: 'Report Delete Request Received.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Report Delete Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Report Delete Request Failed (Not found).',
  })
  async destroy(
    @Param('id', Loader) id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<object> {
    await this.service.destroy(request.locals.report._id);
    return {};
  }

  /**
   * Create Report by payload
   * @param {ReportCreatePayload} payload Report's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Report>} Report object
   */
  @Post()
  @UseInterceptors(ConversationInterceptor, UserInterceptor)
  @UseGuards(ApplicationGuard)
  @ApiOperation({ summary: 'Create Report.' })
  @ApiResponse({
    status: 201,
    description: 'Report Create Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Report Create Request Failed.',
  })
  async create(
    @Body() payload: ReportCreatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Report> {
    const { conversation, user } = request.locals;

    const report = await this.service.create({
      ...payload,
      application: request.application?._id,
      reporter: request.user?._id,
      conversation: conversation?._id,
      user: user?._id,
    });
    return report;
  }
}
