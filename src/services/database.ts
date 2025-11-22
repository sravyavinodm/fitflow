// New Database Service with Proper Schema Structure
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Common interfaces
export interface BaseEntry {
  id: string;
  userId: string;
  entryDate: Date; // Use proper date field instead of string
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

// Activity interfaces
export interface Activity extends BaseEntry {
  name: string;
  duration: number; // in minutes
  time: string; // time of day
  caloriesBurned?: number;
  actualDuration?: number; // in seconds for stopwatch
}

// Diet interfaces
export interface Diet extends BaseEntry {
  mealType: string;
  foodItems: string;
  calories: number;
  time: string;
  imageUrl?: string;
}

// Hobby interfaces
export interface Hobby extends BaseEntry {
  name?: string;
  type?: string; // for backward compatibility
  duration: number; // in minutes
  time: string;
  startTime?: string;
  endTime?: string;
  frequency?: string;
  category?: string;
}

// Mood interfaces
export interface Mood extends BaseEntry {
  moodLevel: number; // 1-5 scale
  moodType: string;
  time: string;
  factors?: string[];
}

// Water interfaces
export interface Water extends BaseEntry {
  amount: number; // in ml
  liters?: number; // for backward compatibility
  time: string;
  goal?: number;
}

// Sleep interfaces
export interface Sleep extends BaseEntry {
  bedTime?: string;
  wakeTime?: string;
  duration?: number; // in hours
  hours?: number; // for backward compatibility
  quality?: number; // 1-5 scale
  goal?: number;
}

// Database service class
export class DatabaseService {
  // Activity methods
  static async createActivity(userId: string, activity: Omit<Activity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('Creating activity in new schema:', { userId, activity }); // Debug log
    const activitiesRef = collection(db, 'users', userId, 'activities');
    console.log('Activities collection path:', `users/${userId}/activities`); // Debug log
    
    const docRef = await addDoc(activitiesRef, {
      ...activity,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Activity created with ID:', docRef.id); // Debug log
    return docRef.id;
  }

  static async getActivities(userId: string, date: Date): Promise<Activity[]> {
    console.log('Getting activities for user:', userId, 'date:', date); // Debug log
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('Date range:', { startOfDay, endOfDay }); // Debug log

    const activitiesRef = collection(db, 'users', userId, 'activities');
    const q = query(
      activitiesRef,
      where('entryDate', '>=', Timestamp.fromDate(startOfDay)),
      where('entryDate', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('entryDate', 'desc')
    );

    console.log('Querying activities collection...'); // Debug log
    const querySnapshot = await getDocs(q);
    console.log('Found', querySnapshot.size, 'activities'); // Debug log
    
    const activities = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Activity data:', data); // Debug log
      return {
        id: doc.id,
        ...data,
        entryDate: data.entryDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }) as Activity[];
    
    console.log('Total activities found:', activities.length); // Debug log
    return activities;
  }

  static async deleteActivity(userId: string, activityId: string): Promise<void> {
    const activityRef = doc(db, 'users', userId, 'activities', activityId);
    await deleteDoc(activityRef);
  }

  static async getActivity(userId: string, activityId: string): Promise<Activity | null> {
    const activityRef = doc(db, 'users', userId, 'activities', activityId);
    const docSnap = await getDoc(activityRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        entryDate: data.entryDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Activity;
    }
    return null;
  }

  static async updateActivity(userId: string, activityId: string, updates: Partial<Activity>): Promise<void> {
    const activityRef = doc(db, 'users', userId, 'activities', activityId);
    await updateDoc(activityRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Diet methods
  static async createDiet(userId: string, diet: Omit<Diet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('Creating diet in new schema:', { userId, diet }); // Debug log
    const dietsRef = collection(db, 'users', userId, 'diets');
    console.log('Diets collection path:', `users/${userId}/diets`); // Debug log
    
    const docRef = await addDoc(dietsRef, {
      ...diet,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Diet created with ID:', docRef.id); // Debug log
    return docRef.id;
  }

  static async getDiets(userId: string, date: Date): Promise<Diet[]> {
    console.log('Getting diets for user:', userId, 'date:', date); // Debug log
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('Date range:', { startOfDay, endOfDay }); // Debug log

    const dietsRef = collection(db, 'users', userId, 'diets');
    console.log('Querying collection path:', `users/${userId}/diets`); // Debug log
    
    const q = query(
      dietsRef,
      where('entryDate', '>=', Timestamp.fromDate(startOfDay)),
      where('entryDate', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('entryDate', 'desc')
    );

    console.log('Querying diets collection...'); // Debug log
    const querySnapshot = await getDocs(q);
    console.log('Found', querySnapshot.size, 'diets in query result'); // Debug log
    
    // Also try querying all diets to see what's in the collection
    const allDietsQuery = query(dietsRef, orderBy('createdAt', 'desc'));
    const allDietsSnapshot = await getDocs(allDietsQuery);
    console.log('Total diets in collection:', allDietsSnapshot.size); // Debug log
    
    allDietsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`All diets [${index}]:`, {
        id: doc.id,
        entryDate: data.entryDate?.toDate(),
        mealType: data.mealType,
        createdAt: data.createdAt?.toDate()
      });
    });
    
    const diets = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Filtered diet data:', {
        id: doc.id,
        entryDate: data.entryDate?.toDate(),
        mealType: data.mealType,
        createdAt: data.createdAt?.toDate()
      }); // Debug log
      return {
        id: doc.id,
        ...data,
        entryDate: data.entryDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }) as Diet[];
    
    console.log('Total filtered diets found:', diets.length); // Debug log
    return diets;
  }

  static async deleteDiet(userId: string, dietId: string): Promise<void> {
    const dietRef = doc(db, 'users', userId, 'diets', dietId);
    await deleteDoc(dietRef);
  }

  static async getDiet(userId: string, dietId: string): Promise<Diet | null> {
    const dietRef = doc(db, 'users', userId, 'diets', dietId);
    const docSnap = await getDoc(dietRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        entryDate: data.entryDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Diet;
    }
    return null;
  }

  static async updateDiet(userId: string, dietId: string, updates: Partial<Diet>): Promise<void> {
    const dietRef = doc(db, 'users', userId, 'diets', dietId);
    await updateDoc(dietRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Hobby methods
  static async createHobby(userId: string, hobby: Omit<Hobby, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const hobbiesRef = collection(db, 'users', userId, 'hobbies');
    const docRef = await addDoc(hobbiesRef, {
      ...hobby,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getHobbies(userId: string, date: Date): Promise<Hobby[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const hobbiesRef = collection(db, 'users', userId, 'hobbies');
    const q = query(
      hobbiesRef,
      where('entryDate', '>=', Timestamp.fromDate(startOfDay)),
      where('entryDate', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('entryDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      entryDate: doc.data().entryDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Hobby[];
  }

  static async getHobby(userId: string, hobbyId: string): Promise<Hobby | null> {
    const hobbyRef = doc(db, 'users', userId, 'hobbies', hobbyId);
    const docSnap = await getDoc(hobbyRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        entryDate: data.entryDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Hobby;
    }
    return null;
  }

  static async updateHobby(userId: string, hobbyId: string, updates: Partial<Hobby>): Promise<void> {
    const hobbyRef = doc(db, 'users', userId, 'hobbies', hobbyId);
    await updateDoc(hobbyRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteHobby(userId: string, hobbyId: string): Promise<void> {
    const hobbyRef = doc(db, 'users', userId, 'hobbies', hobbyId);
    await deleteDoc(hobbyRef);
  }

  // Mood methods
  static async createMood(userId: string, mood: Omit<Mood, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const moodRef = collection(db, 'users', userId, 'mood');
    const docRef = await addDoc(moodRef, {
      ...mood,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getMood(userId: string, date: Date): Promise<Mood[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const moodRef = collection(db, 'users', userId, 'mood');
    const q = query(
      moodRef,
      where('entryDate', '>=', Timestamp.fromDate(startOfDay)),
      where('entryDate', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('entryDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      entryDate: doc.data().entryDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Mood[];
  }

  static async getMoodEntry(userId: string, moodId: string): Promise<Mood | null> {
    const moodRef = doc(db, 'users', userId, 'mood', moodId);
    const docSnap = await getDoc(moodRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        entryDate: data.entryDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Mood;
    }
    return null;
  }

  static async updateMood(userId: string, moodId: string, updates: Partial<Mood>): Promise<void> {
    const moodRef = doc(db, 'users', userId, 'mood', moodId);
    await updateDoc(moodRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteMood(userId: string, moodId: string): Promise<void> {
    const moodRef = doc(db, 'users', userId, 'mood', moodId);
    await deleteDoc(moodRef);
  }

  // Water methods
  static async createWater(userId: string, water: Omit<Water, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const waterRef = collection(db, 'users', userId, 'water');
    const docRef = await addDoc(waterRef, {
      ...water,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getWater(userId: string, date: Date): Promise<Water[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const waterRef = collection(db, 'users', userId, 'water');
    const q = query(
      waterRef,
      where('entryDate', '>=', Timestamp.fromDate(startOfDay)),
      where('entryDate', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('entryDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      entryDate: doc.data().entryDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Water[];
  }

  // Sleep methods
  static async createSleep(userId: string, sleep: Omit<Sleep, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const sleepRef = collection(db, 'users', userId, 'sleep');
    const docRef = await addDoc(sleepRef, {
      ...sleep,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  static async getSleep(userId: string, date: Date): Promise<Sleep[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const sleepRef = collection(db, 'users', userId, 'sleep');
    const q = query(
      sleepRef,
      where('entryDate', '>=', Timestamp.fromDate(startOfDay)),
      where('entryDate', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('entryDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      entryDate: doc.data().entryDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Sleep[];
  }

  // Date range methods for Insights
  static async getSleepRange(userId: string, startDate: Date, endDate: Date): Promise<Sleep[]> {
    const startOfRange = new Date(startDate);
    startOfRange.setHours(0, 0, 0, 0);
    
    const endOfRange = new Date(endDate);
    endOfRange.setHours(23, 59, 59, 999);

    const sleepRef = collection(db, 'users', userId, 'sleep');
    const q = query(
      sleepRef,
      where('entryDate', '>=', Timestamp.fromDate(startOfRange)),
      where('entryDate', '<=', Timestamp.fromDate(endOfRange)),
      orderBy('entryDate', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      entryDate: doc.data().entryDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Sleep[];
  }

  static async getWaterRange(userId: string, startDate: Date, endDate: Date): Promise<Water[]> {
    const startOfRange = new Date(startDate);
    startOfRange.setHours(0, 0, 0, 0);
    
    const endOfRange = new Date(endDate);
    endOfRange.setHours(23, 59, 59, 999);

    const waterRef = collection(db, 'users', userId, 'water');
    const q = query(
      waterRef,
      where('entryDate', '>=', Timestamp.fromDate(startOfRange)),
      where('entryDate', '<=', Timestamp.fromDate(endOfRange)),
      orderBy('entryDate', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      entryDate: doc.data().entryDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Water[];
  }

  // Activity range methods for Insights
  static async getActivitiesRange(userId: string, startDate: Date, endDate: Date): Promise<Activity[]> {
    const startOfRange = new Date(startDate);
    startOfRange.setHours(0, 0, 0, 0);
    
    const endOfRange = new Date(endDate);
    endOfRange.setHours(23, 59, 59, 999);

    const activitiesRef = collection(db, 'users', userId, 'activities');
    const q = query(
      activitiesRef,
      where('entryDate', '>=', Timestamp.fromDate(startOfRange)),
      where('entryDate', '<=', Timestamp.fromDate(endOfRange)),
      orderBy('entryDate', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      entryDate: doc.data().entryDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Activity[];
  }

  // Diet range methods for Insights
  static async getDietsRange(userId: string, startDate: Date, endDate: Date): Promise<Diet[]> {
    const startOfRange = new Date(startDate);
    startOfRange.setHours(0, 0, 0, 0);
    
    const endOfRange = new Date(endDate);
    endOfRange.setHours(23, 59, 59, 999);

    const dietsRef = collection(db, 'users', userId, 'diets');
    const q = query(
      dietsRef,
      where('entryDate', '>=', Timestamp.fromDate(startOfRange)),
      where('entryDate', '<=', Timestamp.fromDate(endOfRange)),
      orderBy('entryDate', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      entryDate: doc.data().entryDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Diet[];
  }
}
