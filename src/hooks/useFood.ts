import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

type FoodType = 'healthy' | 'moderate' | 'unhealthy' | 'junk';

export default function useFood() {
  const [counts, setCounts] = useState({
    healthy: 0,
    moderate: 0,
    unhealthy: 0,
    junk: 0
  });

  const recordFoodChoice = async (type: FoodType) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, 'foodChoices'), {
        userId: user.uid,
        type,
        date: new Date().toISOString()
      });

      setCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
    } catch (error) {
      console.error('Error recording food choice:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadCounts = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'foodChoices'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        const newCounts = { healthy: 0, moderate: 0, unhealthy: 0, junk: 0 };
        querySnapshot.forEach(doc => {
          const type = doc.data().type as FoodType;
          newCounts[type]++;
        });

        setCounts(newCounts);
      } catch (error) {
        console.error('Error loading counts:', error);
      }
    };

    loadCounts();
  }, []);

  return { counts, recordFoodChoice };
}