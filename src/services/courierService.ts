import { CourierUser, RepairRequest } from '../types';
import { OrderService } from './orderService';

const STORAGE_KEY_COURIERS = 'the_fix_point_couriers_v1';
const STORAGE_KEY_CURRENT_COURIER = 'the_fix_point_current_courier_v1';

export const DEFAULT_COURIERS: CourierUser[] = [
  {
    id: 'courier-1',
    name: 'أمين دحماني (Amine Dahmani)',
    phoneNumber: '0555 44 33 22',
    pin: '1111',
    vehicleType: 'moto',
    vehiclePlate: '18492-116-31',
    commune: 'وهران (عقيد لطفي / بير الجير)',
    isActive: true,
    createdAt: '2026-01-10',
  },
  {
    id: 'courier-2',
    name: 'رشيد بوعلام (Rachid Boualem)',
    phoneNumber: '0770 12 34 56',
    pin: '2222',
    vehicleType: 'moto',
    vehiclePlate: '09384-118-31',
    commune: 'وهران وسط / السانية',
    isActive: true,
    createdAt: '2026-02-01',
  },
  {
    id: 'courier-3',
    name: 'حمزة سلطاني (Hamza Soltani)',
    phoneNumber: '0661 98 76 54',
    pin: '3333',
    vehicleType: 'car',
    vehiclePlate: '00412-120-31',
    commune: 'عين الترك / ميسونيي',
    isActive: true,
    createdAt: '2026-03-15',
  },
];

export const INITIAL_COURIERS = DEFAULT_COURIERS;

type CourierListener = () => void;
const courierListeners: Set<CourierListener> = new Set();

export const subscribeToCouriers = (listener: CourierListener) => {
  courierListeners.add(listener);
  return () => {
    courierListeners.delete(listener);
  };
};

const notifyCourierSubscribers = () => {
  courierListeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Error in courier subscriber:', e);
    }
  });
};

export const CourierService = {
  // Get all couriers list
  getAllCouriers(): CourierUser[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_COURIERS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading couriers from storage:', e);
    }

    try {
      localStorage.setItem(STORAGE_KEY_COURIERS, JSON.stringify(DEFAULT_COURIERS));
    } catch {
      // ignore
    }
    return DEFAULT_COURIERS;
  },

  // Get active couriers only (for Admin assignment)
  getActiveCouriers(): CourierUser[] {
    return this.getAllCouriers().filter((c) => c.isActive);
  },

  // Save all couriers
  saveAllCouriers(couriers: CourierUser[]) {
    try {
      localStorage.setItem(STORAGE_KEY_COURIERS, JSON.stringify(couriers));
      notifyCourierSubscribers();
    } catch (e) {
      console.error('Failed to save couriers:', e);
    }
  },

  // Get specific courier by ID
  getCourierById(id: string): CourierUser | undefined {
    return this.getAllCouriers().find((c) => c.id === id);
  },

  // Add new courier (Admin only)
  addCourier(data: Omit<CourierUser, 'id' | 'createdAt'>): CourierUser {
    const all = this.getAllCouriers();
    const newCourier: CourierUser = {
      ...data,
      id: `courier-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
      isActive: data.isActive ?? true,
    };

    const updated = [...all, newCourier];
    this.saveAllCouriers(updated);
    return newCourier;
  },

  // Update existing courier
  updateCourier(id: string, updates: Partial<CourierUser>): CourierUser | null {
    const all = this.getAllCouriers();
    const index = all.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updatedCourier = {
      ...all[index],
      ...updates,
    };

    all[index] = updatedCourier;
    this.saveAllCouriers(all);

    // If current logged-in courier was updated, sync session
    const current = this.getCurrentCourier();
    if (current && current.id === id) {
      this.setCurrentCourier(updatedCourier);
    }

    return updatedCourier;
  },

  // Toggle courier active / inactive
  toggleCourierActive(id: string): boolean {
    const courier = this.getCourierById(id);
    if (!courier) return false;
    this.updateCourier(id, { isActive: !courier.isActive });
    return true;
  },

  // Delete courier
  deleteCourier(id: string): boolean {
    const all = this.getAllCouriers();
    const filtered = all.filter((c) => c.id !== id);
    if (filtered.length === all.length) return false;
    this.saveAllCouriers(filtered);
    return true;
  },

  // Authentication: Verify Courier Credentials
  loginCourier(phoneNumberOrId: string, pin: string): CourierUser | null {
    const couriers = this.getAllCouriers();
    const cleanInput = phoneNumberOrId.replace(/\s+/g, '').toLowerCase();

    const matched = couriers.find((c) => {
      const matchPhone = c.phoneNumber.replace(/\s+/g, '').includes(cleanInput) || cleanInput.includes(c.phoneNumber.replace(/\s+/g, ''));
      const matchId = c.id.toLowerCase() === cleanInput;
      return (matchPhone || matchId) && c.pin === pin;
    });

    if (matched && matched.isActive) {
      this.setCurrentCourier(matched);
      return matched;
    }
    return null;
  },

  // Session management
  getCurrentCourier(): CourierUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CURRENT_COURIER);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return null;
  },

  setCurrentCourier(courier: CourierUser | null) {
    try {
      if (courier) {
        localStorage.setItem(STORAGE_KEY_CURRENT_COURIER, JSON.stringify(courier));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_COURIER);
      }
      notifyCourierSubscribers();
    } catch {
      // ignore
    }
  },

  logoutCourier() {
    this.setCurrentCourier(null);
  },

  logout() {
    this.setCurrentCourier(null);
  },

  // Get strictly assigned orders for a specific courier (Security isolation)
  getCourierAssignedOrders(courierId: string): RepairRequest[] {
    const allOrders = OrderService.getAllOrders();
    const courier = this.getCourierById(courierId);
    const courierName = courier?.name || '';
    const courierShortName = courierName.split(' ')[0]; // e.g. 'أمين'

    return allOrders.filter((order) => {
      // Direct ID match
      if (order.assignedCourierId === courierId) return true;

      // Match by assignedDriver name string in pickupDeliveryDetails for demo/initial data
      if (order.pickupDeliveryDetails?.assignedDriver) {
        const driverStr = order.pickupDeliveryDetails.assignedDriver.toLowerCase();
        if (driverStr.includes(courierId.toLowerCase())) return true;
        if (courierShortName && driverStr.includes(courierShortName)) return true;
      }

      return false;
    });
  },

  // Calculate Courier Statistics
  getCourierStats(courierId: string) {
    const orders = this.getCourierAssignedOrders(courierId);

    // In-progress statuses
    const inProgressStatuses = [
      'CONFIRMED',
      'COURIER_ASSIGNED',
      'COURIER_ON_WAY',
      'TECHNICIAN_ON_WAY',
      'PHONE_PICKED_UP',
      'RECEIVED_AT_WORKSHOP',
      'DIAGNOSIS',
      'REPAIRING',
      'READY_FOR_RETURN',
      'COURIER_RETURNING',
      'READY',
    ];

    const todayStr = new Date().toISOString().substring(0, 10);
    const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr) || o.preferredDate === 'اليom' || o.preferredDate === 'اليوم').length;

    const inProgressOrders = orders.filter((o) => inProgressStatuses.includes(o.status)).length;
    const completedOrders = orders.filter((o) => o.status === 'DELIVERED').length;

    // Pickup tasks count
    const pickupTasks = orders.filter((o) =>
      ['COURIER_ASSIGNED', 'COURIER_ON_WAY', 'TECHNICIAN_ON_WAY', 'CONFIRMED'].includes(o.status)
    ).length;

    // Return tasks count
    const returnTasks = orders.filter((o) =>
      ['READY_FOR_RETURN', 'COURIER_RETURNING', 'READY'].includes(o.status)
    ).length;

    return {
      total: orders.length,
      today: todayOrders || orders.length,
      inProgress: inProgressOrders,
      completed: completedOrders,
      pickupTasks,
      returnTasks,
    };
  },
};
