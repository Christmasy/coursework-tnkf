import {types} from '@typegoose/typegoose';
import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import {inject, injectable} from 'inversify';
import {COMPONENT} from '../../types/component.type.js';
import { TaskServiceInterface } from '../task/task-service.interface.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(@inject(COMPONENT.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
              @inject(COMPONENT.TaskServiceInterface) private readonly taskService: TaskServiceInterface) {}

  public async create(dto: CreateCommentDto, user: string): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({...dto, user});
    await this.taskService.incCommentsCount(dto.taskId);
    return comment.populate('user');
  }

  public async findByTaskId(taskId: string): Promise<DocumentType<CommentEntity>[]> {
    const taskComments = await this.commentModel.find({taskId}).sort({createdAt: -1});
    return this.commentModel.populate(taskComments, 'user');
  }
}
