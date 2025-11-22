import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export const firestoreService = {
  // Chat History
  async createChatHistory(
    userId: string,
    chat: Omit<ChatHistory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, 'users', userId, 'chatHistory'),
        {
          ...chat,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  async updateChatHistory(
    userId: string,
    chatId: string,
    updates: Partial<ChatHistory>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId, 'chatHistory', chatId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw error;
    }
  },

  async getChatHistory(
    userId: string,
    chatId: string
  ): Promise<ChatHistory | null> {
    try {
      const docSnap = await getDoc(
        doc(db, 'users', userId, 'chatHistory', chatId)
      );
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          messages: data.messages.map((m: any) => ({
            ...m,
            timestamp: m.timestamp?.toDate() || new Date(),
          })),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as ChatHistory;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  async getChatHistories(userId: string): Promise<ChatHistory[]> {
    try {
      const q = query(
        collection(db, 'users', userId, 'chatHistory'),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          messages: data.messages?.map((m: any) => ({
            ...m,
            timestamp: m.timestamp?.toDate() || new Date(),
          })) || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as ChatHistory;
      });
    } catch (error) {
      throw error;
    }
  },
};
