import { db } from "$lib/db";
import type { Question } from "$lib/types/db-entities";

export const addQuestion = async (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'archivedAt'>) => {
  try {
    const id = await db.questions.add({
      ...question,
      createdAt: new Date(),
      updatedAt: 0,
      archivedAt: 0,
    });
    return { id, ...question };
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
}

export const updateQuestion = async (id: number, question: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'archivedAt'>) => {
  try {
    await db.questions.update(id, {
      ...question,
      updatedAt: new Date(),
    });
    return { question: await getQuestionById(id) };
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
}

export const archiveQuestion = async (id: number) => {
  try {
    await db.questions.update(id, {
      archivedAt: new Date(),
    });
    return { question: await getQuestionById(id) };
  } catch (error) {
    console.error("Error archiving question:", error);
    throw error;
  }
}

export const unarchiveQuestion = async (id: number) => {
  try {
    await db.questions.update(id, {
      archivedAt: 0,
    });
    return { question: await getQuestionById(id) };
  } catch (error) {
    console.error("Error unarchiving question:", error);
    throw error;
  }
}

export const getQuestionById = async (id: number): Promise<Question | undefined> => {
  try {
    return await db.questions.get(id);
  } catch (error) {
    console.error("Error getting question by ID:", error);
    throw error;
  }
}

export const getUnArchivedQuestions = () => db.questions.where('archivedAt').equals(0).toArray();
export const getArchivedQuestions = () => db.questions.where('archivedAt').notEqual(0).toArray();
