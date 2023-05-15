export class Task {
  public id: number;
  public authorId: number;
  public asigneeId: number;
  public projectId: number;
  public title: string;
  public description: string;
  public deadline: Date;
  public status: number;

  public constructor (
    id: number,
    authorId: number,
    asigneeId: number,
    projectId: number,
    title: string,
    description: string,
    deadline: Date,
    status: number
  ) {
    this.id = id;
    this.authorId = authorId;
    this.asigneeId = asigneeId;
    this.projectId = projectId;
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.status = status;
  }
}
