import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  RepairRequest, 
  OrderStatus, 
  ProofOfPickup, 
  ProofOfDelivery, 
  CourierUser, 
  InAppNotification,
  OrderAuditLog 
} from '../types';
import { DEFAULT_INITIAL_ORDERS } from './orderService';
import { INITIAL_COURIERS } from './courierService';

export interface DatabaseSyncState {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
}

// Global subscribers for connection & sync status
type SyncStateListener = (state: DatabaseSyncState) => void;
const syncListeners: Set<SyncStateListener> = new Set();

let currentSyncState: DatabaseSyncState = {
  isConnected: true,
  isSyncing: false,
  lastSyncedAt: null,
  error: null,
};

function updateSyncState(patch: Partial<DatabaseSyncState>) {
  currentSyncState = { ...currentSyncState, ...patch };
  syncListeners.forEach((listener) => {
    try {
      listener(currentSyncState);
    } catch {
      // ignore
    }
  });
}

export function subscribeToDatabaseSyncState(listener: SyncStateListener): () => void {
  syncListeners.add(listener);
  listener(currentSyncState);
  return () => {
    syncListeners.delete(listener);
  };
}

// Cache initialization flag
let isSeeded = false;

export const DatabaseService = {
  getSyncState(): DatabaseSyncState {
    return currentSyncState;
  },

  // 1. Initial Seed to Firestore if database is empty
  async seedInitialDataIfEmpty(): Promise<void> {
    if (isSeeded) return;
    try {
      updateSyncState({ isSyncing: true, error: null });
      const ordersCol = collection(db, 'orders');
      const snapshot = await getDocs(ordersCol);

      if (snapshot.empty) {
        // Seed initial orders
        for (const order of DEFAULT_INITIAL_ORDERS) {
          const docRef = doc(db, 'orders', order.id);
          await setDoc(docRef, {
            ...order,
            updatedAt: new Date().toISOString(),
          });
        }

        // Seed initial couriers
        for (const courier of INITIAL_COURIERS) {
          const courierDocRef = doc(db, 'couriers', courier.id);
          await setDoc(courierDocRef, {
            ...courier,
            updatedAt: new Date().toISOString(),
          });
        }
      }
      isSeeded = true;
      updateSyncState({ isConnected: true, isSyncing: false, lastSyncedAt: new Date(), error: null });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Database sync error';
      updateSyncState({ isSyncing: false, error: errorMsg });
      console.warn('Firestore initial seeding fallback to local cache:', errorMsg);
    }
  },

  // 2. Realtime Listener for Orders with optional role-based filtering
  subscribeToOrders(
    callback: (orders: RepairRequest[]) => void,
    filters?: { courierId?: string; customerPhone?: string }
  ): Unsubscribe {
    const ordersCol = collection(db, 'orders');

    const unsubscribe = onSnapshot(
      ordersCol,
      (snapshot) => {
        const list: RepairRequest[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as RepairRequest;
          list.push({ ...data, id: d.id });
        });

        // Sort by creation date descending
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

        let filteredList = list;
        if (filters?.courierId) {
          filteredList = list.filter((o) => o.assignedCourierId === filters.courierId);
        } else if (filters?.customerPhone) {
          filteredList = list.filter(
            (o) =>
              o.phoneNumber.replace(/\s+/g, '') === filters.customerPhone?.replace(/\s+/g, '')
          );
        }

        updateSyncState({ isConnected: true, isSyncing: false, lastSyncedAt: new Date(), error: null });
        callback(filteredList.length > 0 ? filteredList : (filters?.courierId ? [] : list));
      },
      (error) => {
        console.warn('Firestore orders subscription error:', error.message);
        updateSyncState({ isConnected: false, error: error.message });
      }
    );

    return unsubscribe;
  },

  // 3. Create a new repair order in Firestore
  async createOrder(order: RepairRequest): Promise<RepairRequest> {
    try {
      updateSyncState({ isSyncing: true, error: null });
      const docRef = doc(db, 'orders', order.id);

      const orderPayload = {
        ...order,
        createdAt: order.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, orderPayload);

      // Register or update customer profile
      const customerDocId = order.phoneNumber.replace(/\D/g, '') || `cust-${Date.now()}`;
      const customerDocRef = doc(db, 'customers', customerDocId);
      await setDoc(
        customerDocRef,
        {
          id: customerDocId,
          fullName: order.customerName,
          phoneNumber: order.phoneNumber,
          commune: order.commune,
          address: order.address,
          lastOrderId: order.id,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // Register audit history log
      const historyDocRef = doc(collection(db, 'order_status_history'));
      await setDoc(historyDocRef, {
        id: historyDocRef.id,
        orderId: order.id,
        status: order.status,
        note: 'تم إنشاء الطلب بنجاح في نظام The Fix Point',
        actor: 'CUSTOMER',
        timestamp: order.createdAt,
      });

      // Register notification
      const notifDocRef = doc(collection(db, 'notifications'));
      await setDoc(notifDocRef, {
        id: notifDocRef.id,
        orderId: order.id,
        titleAr: 'طلب صيانة جديد',
        titleFr: 'Nouvelle demande',
        messageAr: `تم استلام طلبك بنجاح برقم ${order.id}`,
        messageFr: `Votre commande ${order.id} a été enregistrée avec succès`,
        status: 'NEW',
        isRead: false,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });

      updateSyncState({ isConnected: true, isSyncing: false, lastSyncedAt: new Date(), error: null });
      return orderPayload;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save order to Firestore';
      updateSyncState({ isSyncing: false, error: errorMsg });
      throw err;
    }
  },

  // 4. Update order status in Firestore (Supports Customer, Courier, Admin roles)
  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    role: 'CUSTOMER' | 'ADMIN' | 'COURIER' | string,
    note?: string,
    proofOfPickup?: ProofOfPickup,
    proofOfDelivery?: ProofOfDelivery,
    internalNotes?: string
  ): Promise<void> {
    try {
      updateSyncState({ isSyncing: true, error: null });
      const docRef = doc(db, 'orders', orderId);

      const updateData: Record<string, unknown> = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      if (proofOfPickup) {
        updateData.proofOfPickup = proofOfPickup;
      }
      if (proofOfDelivery) {
        updateData.proofOfDelivery = proofOfDelivery;
      }
      if (internalNotes) {
        updateData.internalNotes = internalNotes;
      }

      await updateDoc(docRef, updateData);

      // Audit history
      const historyDocRef = doc(collection(db, 'order_status_history'));
      await setDoc(historyDocRef, {
        id: historyDocRef.id,
        orderId,
        status: newStatus,
        note: note || `تحديث الحالة إلى ${newStatus}`,
        actor: role,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });

      updateSyncState({ isConnected: true, isSyncing: false, lastSyncedAt: new Date(), error: null });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update order status in Firestore';
      updateSyncState({ isSyncing: false, error: errorMsg });
      throw err;
    }
  },

  // 5. Update order pricing from Admin
  async updateOrderPricing(
    orderId: string,
    finalPrice: number,
    notes?: string
  ): Promise<void> {
    try {
      updateSyncState({ isSyncing: true, error: null });
      const docRef = doc(db, 'orders', orderId);

      await updateDoc(docRef, {
        finalPrice,
        ...(notes ? { internalNotes: notes } : {}),
        updatedAt: new Date().toISOString(),
      });

      updateSyncState({ isConnected: true, isSyncing: false, lastSyncedAt: new Date(), error: null });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update price in Firestore';
      updateSyncState({ isSyncing: false, error: errorMsg });
      throw err;
    }
  },

  // 6. Assign courier in Firestore
  async assignCourier(
    orderId: string,
    courierId: string,
    courierName: string,
    courierPhone: string
  ): Promise<void> {
    try {
      updateSyncState({ isSyncing: true, error: null });
      const docRef = doc(db, 'orders', orderId);

      await updateDoc(docRef, {
        assignedCourierId: courierId,
        assignedCourierName: courierName,
        assignedCourierPhone: courierPhone,
        status: 'COURIER_ASSIGNED',
        updatedAt: new Date().toISOString(),
      });

      // Audit history
      const historyDocRef = doc(collection(db, 'order_status_history'));
      await setDoc(historyDocRef, {
        id: historyDocRef.id,
        orderId,
        status: 'COURIER_ASSIGNED',
        note: `تم إسناد الطلب لعامل التوصيل: ${courierName}`,
        actor: 'ADMIN',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });

      updateSyncState({ isConnected: true, isSyncing: false, lastSyncedAt: new Date(), error: null });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to assign courier in Firestore';
      updateSyncState({ isSyncing: false, error: errorMsg });
      throw err;
    }
  },

  // 7. Subscribe to couriers
  subscribeToCouriers(callback: (couriers: CourierUser[]) => void): Unsubscribe {
    const couriersCol = collection(db, 'couriers');
    return onSnapshot(
      couriersCol,
      (snapshot) => {
        const list: CourierUser[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as CourierUser);
        });
        callback(list.length > 0 ? list : INITIAL_COURIERS);
      },
      (error) => {
        console.warn('Firestore couriers subscription error:', error.message);
        callback(INITIAL_COURIERS);
      }
    );
  },
};
