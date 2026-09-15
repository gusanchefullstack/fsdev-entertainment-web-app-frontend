import type { Category, Rating, Show, User } from '../../src/api/types';
import data from './data.json';

interface RawShow {
  title: string;
  year: number;
  category: string;
  rating: string;
  isTrending: boolean;
  thumbnail: {
    trending?: { small: string; large: string };
    regular: { small: string; medium: string; large: string };
  };
}

const toPath = (raw: string) => raw.replace('./assets/thumbnails/', '/thumbnails/');

export const shows: Show[] = (data as RawShow[]).map((raw) => {
  const id = raw.thumbnail.regular.small.split('/')[3] ?? raw.title;
  return {
    id,
    title: raw.title,
    year: raw.year,
    category: raw.category as Category,
    rating: raw.rating as Rating,
    isTrending: raw.isTrending,
    thumbnail: {
      ...(raw.thumbnail.trending
        ? {
            trending: {
              small: toPath(raw.thumbnail.trending.small),
              large: toPath(raw.thumbnail.trending.large),
            },
          }
        : {}),
      regular: {
        small: toPath(raw.thumbnail.regular.small),
        medium: toPath(raw.thumbnail.regular.medium),
        large: toPath(raw.thumbnail.regular.large),
      },
    },
  };
});

export function showById(id: string): Show {
  const show = shows.find((candidate) => candidate.id === id);
  if (!show) throw new Error(`No fixture show ${id}`);
  return show;
}

export const user: User = { id: '00000000-0000-4000-8000-000000000001', email: 'qa1@example.com' };
