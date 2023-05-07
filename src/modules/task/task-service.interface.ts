import {DocumentType} from '@typegoose/typegoose';
import {TaskEntity} from './task.entity.js';
import CreateMovieDto from './dto/create-task.dto.js';

export interface TaskServiceInterface {
  create(dto: CreateMovieDto): Promise<DocumentType<TaskEntity>>;
  findById(movieId: string): Promise<DocumentType<TaskEntity> | null>;
  find(): Promise<DocumentType<TaskEntity>[]>;
  deleteById(movieId: string): Promise<void | null>;
  incCommentsCount(movieId: string): Promise<void | null>;
}
