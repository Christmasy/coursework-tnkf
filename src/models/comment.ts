export class Comment {
  public id: number;
  public taskId: number;
  public authorId: number;
  public createTime: Date;
  public content: string;

  public constructor (id: number, taskId: number, authorId: number, createTime: Date, content: string) {
    this.id = id;
    this.taskId = taskId;
    this.authorId = authorId;
    this.createTime = createTime;
    this.content = content;
  }
}
