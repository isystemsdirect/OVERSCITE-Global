
import { collection, getDocs, Firestore } from 'firebase/firestore';
import { getDb } from './firebase';
import type { Inspector, MarketplaceService, MarketplaceIntegration, Client } from './types';

export async function getInspectors(): Promise<Inspector[]> {
  const db = getDb();
  const inspectorsCol = collection(db as Firestore, 'inspectors');
  const inspectorSnapshot = await getDocs(inspectorsCol);
  const inspectorList = inspectorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inspector));
  return inspectorList;
}

export async function getMarketplaceServices(): Promise<MarketplaceService[]> {
  const db = getDb();
  const servicesCol = collection(db as Firestore, 'marketplaceServices');
  const serviceSnapshot = await getDocs(servicesCol);
  const serviceList = serviceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MarketplaceService));
  return serviceList;
}

export async function getMarketplaceIntegrations(): Promise<MarketplaceIntegration[]> {
  const db = getDb();
  const integrationsCol = collection(db as Firestore, 'marketplaceIntegrations');
  const integrationSnapshot = await getDocs(integrationsCol);
  const integrationList = integrationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MarketplaceIntegration));
  return integrationList;
}

export async function getClients(): Promise<Client[]> {
  const db = getDb();
  const clientsCol = collection(db as Firestore, 'clients');
  const clientSnapshot = await getDocs(clientsCol);
  const clientList = clientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
  return clientList;
}
