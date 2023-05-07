import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {Types} from 'mongoose';
import { TaskEntity } from '../task/task.entity.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends  defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public text!: string;

  @prop({
    ref: TaskEntity,
    required: true
  })
  public taskId!: Ref<TaskEntity>;

  @prop({
    type: Types.ObjectId,
    ref: UserEntity,
    required: true
  })
  public user!: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
