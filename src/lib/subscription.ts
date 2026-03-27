
import { doc, getDoc } from 'firebase/firestore';
import { getDb } from './firebase';

export const subscriptionPlans = {
  free: {
    name: 'Free',
    features: ['Basic inspection tools', 'Limited AI analysis'],
  },
  basic: {
    name: 'Basic',
    features: ['Advanced inspection tools', 'Full AI analysis', 'Team collaboration'],
  },
  pro: {
    name: 'Pro',
    features: ['All Basic features', 'Priority support', 'Advanced reporting'],
  },
};

export async function getUserSubscription(userId: string) {
  const db = getDb();
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    return userData.subscription || 'free';
  } else {
    return 'free';
  }
}
