export interface Question {
  id: number;
  question: string;
  description: string;
  positive: string;
  negative: string;
  createdAt: Date;
  updatedAt: Date | 0;
  archivedAt: Date | 0;
}

export interface Answer {
  poll: number; // poll id
  answers: {
    question: number;
    answer: 'positive' | 'negative'
  }
  createdAt: Date; // answered at
  updatedAt: Date | 0; // maybe show that it was updated
}

export interface Poll {
  questions: number[]; // question ids
  name: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | 0
}
