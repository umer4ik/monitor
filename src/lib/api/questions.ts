import { db, type Question } from "$lib/db";

export const addQuestion = async (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'archivedAt'>) => {
  try {
    const id = await db.questions.add({
      ...question,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archivedAt: '',
    });
    return { id, ...question };
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
}
