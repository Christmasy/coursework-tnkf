import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface TaskEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'tasks'
  }
})
export class TaskEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public title!: string;

  @prop({trim: true, required: true})
  public description!: string;

  @prop({required: true})
  public deadline!: string;

  @prop({required: true})
  public author!: string;

  @prop({required: true})
  public executor!: string;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>; //
}

export const TaskModel = getModelForClass(TaskEntity);
