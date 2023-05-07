import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {TaskServiceInterface} from './task-service.interface.js';
import CreateTaskDto from './dto/create-task.dto.js';
import {TaskEntity} from './task.entity.js';
import {COMPONENT} from '../../types/component.type.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';

@injectable()
export default class TaskService implements TaskServiceInterface {
  constructor(@inject(COMPONENT.LoggerInterface) private readonly logger: LoggerInterface,
              @inject(COMPONENT.TaskModel) private readonly taskModel: types.ModelType<TaskEntity>) {}

  async create(dto: CreateTaskDto): Promise<DocumentType<TaskEntity>> {
    const task = await this.taskModel.create(dto);
    this.logger.info(`New task created: ${dto.title}`);

    return task;
  }

  async findById(taskId: string): Promise<DocumentType<TaskEntity> | null> {
    return this.taskModel.findById(taskId).populate('userId');
  }

  async find(): Promise<DocumentType<TaskEntity>[]> {
    return this.taskModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: {taskId: '$_id'},
          pipeline: [
            {$match: {$expr: {$in: ['$$taskId', '$tasks']}}},
            {$project: {_id: 1}}
          ],
          as: 'comments'
        },
      },
      {
        $addFields: {
          id: {$toString: '$_id'},
          commentsCount: {$size: '$comments'},
          rating: {$avg: '$comments.rating'}
        }
      },
      {$unset: 'comments'}
    ]);
  }

  async deleteById(taskId: string): Promise<void | null> {
    return this.taskModel.findByIdAndDelete(taskId);
  }

  async incCommentsCount(taskId: string): Promise<void | null> {
    return this.taskModel.findByIdAndUpdate(taskId, {$inc: {commentsCount: 1}});
  }
}
