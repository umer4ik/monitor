import Dexie, { type EntityTable } from 'dexie';

export interface Question {
  id: number;
  question: string;
  description: string;
  positive: string;
  negative: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | 0;
}


export const db = new Dexie('MonitorDatabase') as Dexie & {
  questions: EntityTable<Question, 'id'>;
};

db.version(1).stores({
  questions: '++id, question, description, positive, negative, createdAt, updatedAt, archivedAt',
});
