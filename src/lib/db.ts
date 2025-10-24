import Dexie, { type EntityTable } from 'dexie';
import type { Question } from './types/db-entities';

export const db = new Dexie('MonitorDatabase') as Dexie & {
  questions: EntityTable<Question, 'id'>;
};

db.version(1).stores({
  questions: '++id, question, description, positive, negative, createdAt, updatedAt, archivedAt',
});
