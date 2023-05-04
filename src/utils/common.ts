import {Movie} from '../types/movie.type.js';
import {isRightGenre} from '../types/genre.type.js';
import crypto from 'crypto';

export const createMovie = (row: string) : Movie => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    title,
    description,
    createdDate,
    genre,
    releaseYear,
    rating,
    moviePreview,
    movie,
    actors,
    producer,
    movieDuration,
    commentsCount,
    userName,
    email,
    avatarPath,
    poster,
    backgroundImage,
    backgroundColor
  ] = tokens;
  return {
    name: title,
    description,
    postDate: new Date(createdDate),
    genre: isRightGenre(genre),
    releaseYear : Number.parseInt(releaseYear, 10),
    rating: parseFloat(rating),
    moviePreview,
    movie,
    actors: actors.split(';')
      .map((name) => ({name})),
    producer,
    movieDuration: Number.parseInt(movieDuration, 10),
    commentsCount: Number.parseInt(commentsCount, 10),
    user: {userName, email, avatarPath},
    poster,
    backgroundImage,
    backgroundColor
  };
};

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
