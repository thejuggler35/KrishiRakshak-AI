import { Language } from '../translations';

export interface CropScanRecord {
  id: string;
  crop: string;
  date: string;
  status: string;
  severity: 'low' | 'medium' | 'high';
  confidence: 'low' | 'medium' | 'high';
  confidenceReason?: string;
  observations: string[];
  possibleIssues: string[];
  recommendedActions: string[];
  weatherImpact?: string;
  soilImpact?: string | null;
  whatToWatchNext?: string;
  regenerativeTip?: string;
  photoUrl?: string;
  locationName?: string;
}

export interface SavedAdviceItem {
  id: string;
  title: string;
  crop: string;
  why: string;
  steps: string[];
  priority: 'high' | 'medium' | 'normal';
  completed: boolean;
  date: string;
}

export interface FarmerLocation {
  name: string;
  lat?: number;
  lon?: number;
}

const STORAGE_KEYS = {
  SCANS: 'krishi_recent_scans_v1',
  ADVICE: 'krishi_saved_advice_v1',
  LOCATION: 'krishi_location_v1',
  SELECTED_CROP: 'krishi_selected_crop_v1',
  LANGUAGE: 'krishi_language_v1',
};

const isClient = typeof window !== 'undefined';

export const storage = {
  // Scans
  getScans(): CropScanRecord[] {
    if (!isClient) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCANS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('LocalStorage corrupted in getScans, returning empty array', e);
      return [];
    }
  },

  saveScan(scan: Omit<CropScanRecord, 'id' | 'date'> & { id?: string; date?: string }): CropScanRecord {
    const records = this.getScans();
    const newRecord: CropScanRecord = {
      ...scan,
      id: scan.id || 'scan_' + Date.now(),
      date: scan.date || new Date().toISOString(),
    };
    const updated = [newRecord, ...records.slice(0, 19)]; // Keep latest 20
    if (isClient) {
      try {
        localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage saveScan failed', e);
      }
    }
    return newRecord;
  },

  deleteScan(id: string): void {
    if (!isClient) return;
    try {
      const filtered = this.getScans().filter((s) => s && s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  },

  clearScans(): void {
    if (!isClient) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.SCANS);
    } catch {
      // ignore
    }
  },

  // Saved Advice
  getAdvice(): SavedAdviceItem[] {
    if (!isClient) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADVICE);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('LocalStorage corrupted in getAdvice, returning empty array', e);
      return [];
    }
  },

  saveAdvice(item: Omit<SavedAdviceItem, 'id' | 'date' | 'completed'>): SavedAdviceItem {
    const list = this.getAdvice();
    const newItem: SavedAdviceItem = {
      ...item,
      id: 'adv_' + Date.now(),
      date: new Date().toISOString(),
      completed: false,
    };
    const updated = [newItem, ...list];
    if (isClient) {
      try {
        localStorage.setItem(STORAGE_KEYS.ADVICE, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage saveAdvice failed', e);
      }
    }
    return newItem;
  },

  toggleAdviceCompleted(id: string): void {
    if (!isClient) return;
    try {
      const list = this.getAdvice().map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      localStorage.setItem(STORAGE_KEYS.ADVICE, JSON.stringify(list));
    } catch {
      // ignore
    }
  },

  deleteAdvice(id: string): void {
    if (!isClient) return;
    try {
      const filtered = this.getAdvice().filter((item) => item && item.id !== id);
      localStorage.setItem(STORAGE_KEYS.ADVICE, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  },

  // Location
  getLocation(): FarmerLocation | null {
    if (!isClient) return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object' && typeof parsed.name === 'string') {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },

  setLocation(location: FarmerLocation): void {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location));
    } catch {
      // ignore
    }
  },

  // Selected crop preference
  getSelectedCrop(): string {
    if (!isClient) return 'गेहूं';
    try {
      return localStorage.getItem(STORAGE_KEYS.SELECTED_CROP) || 'गेहूं';
    } catch {
      return 'गेहूं';
    }
  },

  setSelectedCrop(crop: string): void {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CROP, crop);
    } catch {
      // ignore
    }
  },

  // Language
  getLanguage(): Language {
    if (!isClient) return 'hi';
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
      return lang === 'en' ? 'en' : 'hi';
    } catch {
      return 'hi';
    }
  },

  setLanguage(lang: Language): void {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch {
      // ignore
    }
  },
};
