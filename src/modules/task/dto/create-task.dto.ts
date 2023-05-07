export default class CreateMovieDto {
  title!: string;
  description!: string;

  executor!: string; // исполнитель
  author!: string; // автор задачи

  deadline!: string; // дедлайн
}
