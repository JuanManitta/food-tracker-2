import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function useStats() {
  const [stats, setStats] = useState({
    healthy: 0,
    moderate: 0,
    unhealthy: 0,
    junk: 0,
    daysTracked: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'foodChoices'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return;

        // Calculate counts
        const counts = {
          healthy: 0,
          moderate: 0,
          unhealthy: 0,
          junk: 0
        };

        const dates = new Set<string>();
        
        querySnapshot.forEach(doc => {
          const data = doc.data();
          counts[data.type as keyof typeof counts]++;
          dates.add(new Date(data.date).toISOString().split('T')[0]);
        });

        // Calculate days tracked
        const dateArray = Array.from(dates);
        const firstDate = new Date(dateArray[0]);
        const today = new Date();
        const daysTracked = Math.ceil(
          (today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

        setStats({
          ...counts,
          daysTracked
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  const total = stats.healthy + stats.moderate + stats.unhealthy + stats.junk;
  const percentages = {
    healthy: total > 0 ? Math.round((stats.healthy / total) * 100) : 0,
    moderate: total > 0 ? Math.round((stats.moderate / total) * 100) : 0,
    unhealthy: total > 0 ? Math.round((stats.unhealthy / total) * 100) : 0,
    junk: total > 0 ? Math.round((stats.junk / total) * 100) : 0
  };

  return { stats, percentages };
}