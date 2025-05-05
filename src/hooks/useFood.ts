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
  const [loading, setLoading] = useState(true);

  const recordFoodChoice = async (type: FoodType) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");

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
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, 'foodChoices'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        const counts = { healthy: 0, moderate: 0, unhealthy: 0, junk: 0 };
        querySnapshot.forEach(doc => {
          const type = doc.data().type as FoodType;
          counts[type] += 1;
        });

        setCounts(counts);
      } catch (error) {
        console.error('Error loading counts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, []);

  return { counts, recordFoodChoice, loading };
}