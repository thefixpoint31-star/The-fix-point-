import { ScreenPriceRecord, BatteryPriceRecord, GlobalCatalogRecord } from '../types';

/**
 * THE FIX POINT - OFFICIAL PRICING ENGINE & CATALOG
 * Based on official The Fix Point Excel Sheets:
 * - Catalogue_Global: Global catalog for all parts and repairs
 * - Ecrans: Official Screen replacement catalog
 * - Batteries_Updated: Official Battery replacement catalog
 * 
 * Strict Rules:
 * 1. Screens Labor (الشاشات):
 *    - Part <= 5,000 DZD       --> Labor = 2,000 DZD
 *    - Part 5,001 - 10,000 DZD  --> Labor = 3,000 DZD
 *    - Part 10,001 - 20,000 DZD --> Labor = 5,000 DZD
 *    - Part > 20,000 DZD       --> Labor = 6,000 DZD
 * 
 * 2. Batteries Labor (البطاريات):
 *    - Part <= 3,000 DZD       --> Labor = 1,000 DZD
 *    - Part 3,001 - 5,000 DZD  --> Labor = 2,000 DZD
 *    - Part > 5,000 DZD        --> Labor = 3,000 DZD
 * 
 * 3. Travel in Oran (التنقل داخل وهران):
 *    - Starting from 2,000 DZD (ابتداءً من 2,000 دج)
 * 
 * 4. Display:
 *    - "السعر التقريبي" (Prix indicatif)
 *    - "السعر النهائي يحدد بعد فحص الهاتف." (Le prix final est fixé après diagnostic)
 *    - If model/part is not found: "السعر يحدد بعد التشخيص." (Prix fixé après diagnostic)
 */

export const BASE_TRAVEL_FEE = 2000;

// =========================================================================
// 1. ECRANS SHEET (ورقة الشاشات الرسمية)
// =========================================================================
export const ECRANS_SHEET: ScreenPriceRecord[] = [
  // --- APPLE iPHONE ---
  { id: 'scr-apple-16pm', brand: 'Apple', model: 'iPhone 16 Pro Max', screenTypeAr: 'شاشة أصلية Super Retina XDR OLED', screenTypeFr: 'Écran OLED Super Retina XDR Original', partPrice: 52000, warrantyMonths: 3, durationMinutes: 45, inStock: true },
  { id: 'scr-apple-16p', brand: 'Apple', model: 'iPhone 16 Pro', screenTypeAr: 'شاشة أصلية Super Retina XDR OLED', screenTypeFr: 'Écran OLED Super Retina XDR Original', partPrice: 48000, warrantyMonths: 3, durationMinutes: 45, inStock: true },
  { id: 'scr-apple-16', brand: 'Apple', model: 'iPhone 16', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 35000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-apple-15pm', brand: 'Apple', model: 'iPhone 15 Pro Max', screenTypeAr: 'شاشة أصلية Super Retina XDR OLED', screenTypeFr: 'Écran OLED Super Retina XDR Original', partPrice: 46000, warrantyMonths: 3, durationMinutes: 45, inStock: true },
  { id: 'scr-apple-15p', brand: 'Apple', model: 'iPhone 15 Pro', screenTypeAr: 'شاشة أصلية Super Retina XDR OLED', screenTypeFr: 'Écran OLED Super Retina XDR Original', partPrice: 42000, warrantyMonths: 3, durationMinutes: 45, inStock: true },
  { id: 'scr-apple-15plus', brand: 'Apple', model: 'iPhone 15 Plus', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 32000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-apple-15', brand: 'Apple', model: 'iPhone 15', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 28000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-apple-14pm', brand: 'Apple', model: 'iPhone 14 Pro Max', screenTypeAr: 'شاشة أصلية Super Retina XDR OLED', screenTypeFr: 'Écran OLED Super Retina XDR Original', partPrice: 39000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-apple-14p', brand: 'Apple', model: 'iPhone 14 Pro', screenTypeAr: 'شاشة أصلية Super Retina XDR OLED', screenTypeFr: 'Écran OLED Super Retina XDR Original', partPrice: 35000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-apple-14plus', brand: 'Apple', model: 'iPhone 14 Plus', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 22000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-apple-14', brand: 'Apple', model: 'iPhone 14', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 18500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-apple-13pm', brand: 'Apple', model: 'iPhone 13 Pro Max', screenTypeAr: 'شاشة أصلية Super Retina XDR 120Hz', screenTypeFr: 'Écran OLED 120Hz Original', partPrice: 34000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-apple-13p', brand: 'Apple', model: 'iPhone 13 Pro', screenTypeAr: 'شاشة أصلية Super Retina XDR 120Hz', screenTypeFr: 'Écran OLED 120Hz Original', partPrice: 30000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-apple-13', brand: 'Apple', model: 'iPhone 13', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 14500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-apple-13mini', brand: 'Apple', model: 'iPhone 13 Mini', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 15000, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-apple-12pm', brand: 'Apple', model: 'iPhone 12 Pro Max', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 21000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-apple-12', brand: 'Apple', model: 'iPhone 12 / 12 Pro', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 13500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-apple-12mini', brand: 'Apple', model: 'iPhone 12 Mini', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 13000, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-apple-11pm', brand: 'Apple', model: 'iPhone 11 Pro Max', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 12500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-apple-11p', brand: 'Apple', model: 'iPhone 11 Pro', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 11000, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-apple-11', brand: 'Apple', model: 'iPhone 11', screenTypeAr: 'شاشة أصلية Liquid Retina HD', screenTypeFr: 'Écran Liquid Retina HD Original', partPrice: 7500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-apple-xsmax', brand: 'Apple', model: 'iPhone XS Max', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 9500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-apple-x-xs', brand: 'Apple', model: 'iPhone X / XS', screenTypeAr: 'شاشة أصلية OLED', screenTypeFr: 'Écran OLED Original', partPrice: 8500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-apple-xr', brand: 'Apple', model: 'iPhone XR', screenTypeAr: 'شاشة أصلية Liquid Retina', screenTypeFr: 'Écran Liquid Retina Original', partPrice: 6500, warrantyMonths: 3, durationMinutes: 25, inStock: true },
  { id: 'scr-apple-8p', brand: 'Apple', model: 'iPhone 8 Plus / 7 Plus', screenTypeAr: 'شاشة أصلية Retina', screenTypeFr: 'Écran Retina Original', partPrice: 4500, warrantyMonths: 3, durationMinutes: 25, inStock: true },
  { id: 'scr-apple-8', brand: 'Apple', model: 'iPhone 8 / 7 / SE', screenTypeAr: 'شاشة أصلية Retina', screenTypeFr: 'Écran Retina Original', partPrice: 4000, warrantyMonths: 3, durationMinutes: 25, inStock: true },

  // --- SAMSUNG GALAXY ---
  { id: 'scr-sam-s24u', brand: 'Samsung', model: 'Galaxy S24 Ultra', screenTypeAr: 'شاشة أصلية Dynamic AMOLED 2X', screenTypeFr: 'Écran Dynamic AMOLED 2X Original', partPrice: 45000, warrantyMonths: 3, durationMinutes: 45, inStock: true },
  { id: 'scr-sam-s24', brand: 'Samsung', model: 'Galaxy S24 / S24+', screenTypeAr: 'شاشة أصلية Dynamic AMOLED 2X', screenTypeFr: 'Écran Dynamic AMOLED 2X Original', partPrice: 32000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-sam-s23u', brand: 'Samsung', model: 'Galaxy S23 Ultra', screenTypeAr: 'شاشة أصلية Dynamic AMOLED 2X', screenTypeFr: 'Écran Dynamic AMOLED 2X Original', partPrice: 38000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-sam-s23', brand: 'Samsung', model: 'Galaxy S23 / S23+', screenTypeAr: 'شاشة أصلية Dynamic AMOLED 2X', screenTypeFr: 'Écran Dynamic AMOLED 2X Original', partPrice: 27000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-sam-s22u', brand: 'Samsung', model: 'Galaxy S22 Ultra', screenTypeAr: 'شاشة أصلية Dynamic AMOLED 2X', screenTypeFr: 'Écran Dynamic AMOLED 2X Original', partPrice: 33000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-sam-s22', brand: 'Samsung', model: 'Galaxy S22', screenTypeAr: 'شاشة أصلية Dynamic AMOLED 2X', screenTypeFr: 'Écran Dynamic AMOLED 2X Original', partPrice: 22000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-sam-s21fe', brand: 'Samsung', model: 'Galaxy S21 FE', screenTypeAr: 'شاشة أصلية Dynamic AMOLED', screenTypeFr: 'Écran Dynamic AMOLED Original', partPrice: 16000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-sam-n20u', brand: 'Samsung', model: 'Galaxy Note 20 Ultra', screenTypeAr: 'شاشة أصلية Dynamic AMOLED 2X', screenTypeFr: 'Écran Dynamic AMOLED 2X Original', partPrice: 35000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-sam-a55', brand: 'Samsung', model: 'Galaxy A55 5G', screenTypeAr: 'شاشة أصلية Super AMOLED 120Hz', screenTypeFr: 'Écran Super AMOLED 120Hz Original', partPrice: 14000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-sam-a54', brand: 'Samsung', model: 'Galaxy A54 5G', screenTypeAr: 'شاشة أصلية Super AMOLED 120Hz', screenTypeFr: 'Écran Super AMOLED 120Hz Original', partPrice: 12000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-sam-a35', brand: 'Samsung', model: 'Galaxy A35 5G', screenTypeAr: 'شاشة أصلية Super AMOLED 120Hz', screenTypeFr: 'Écran Super AMOLED 120Hz Original', partPrice: 11000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-sam-a34', brand: 'Samsung', model: 'Galaxy A34 5G', screenTypeAr: 'شاشة أصلية Super AMOLED 120Hz', screenTypeFr: 'Écran Super AMOLED 120Hz Original', partPrice: 9500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-sam-a25', brand: 'Samsung', model: 'Galaxy A25 5G', screenTypeAr: 'شاشة أصلية Super AMOLED', screenTypeFr: 'Écran Super AMOLED Original', partPrice: 8500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-sam-a15', brand: 'Samsung', model: 'Galaxy A15', screenTypeAr: 'شاشة أصلية Super AMOLED', screenTypeFr: 'Écran Super AMOLED Original', partPrice: 5500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-sam-a14', brand: 'Samsung', model: 'Galaxy A14', screenTypeAr: 'شاشة أصلية PLS LCD FHD+', screenTypeFr: 'Écran PLS LCD FHD+ Original', partPrice: 4800, warrantyMonths: 3, durationMinutes: 25, inStock: true },
  { id: 'scr-sam-a05s', brand: 'Samsung', model: 'Galaxy A05s', screenTypeAr: 'شاشة أصلية PLS LCD 90Hz', screenTypeFr: 'Écran PLS LCD 90Hz Original', partPrice: 4200, warrantyMonths: 3, durationMinutes: 25, inStock: true },

  // --- XIAOMI & REDMI ---
  { id: 'scr-xiaomi-14u', brand: 'Xiaomi', model: 'Xiaomi 14 Ultra', screenTypeAr: 'شاشة أصلية LTPO AMOLED', screenTypeFr: 'Écran LTPO AMOLED Original', partPrice: 42000, warrantyMonths: 3, durationMinutes: 45, inStock: true },
  { id: 'scr-xiaomi-13t', brand: 'Xiaomi', model: 'Xiaomi 13T / 13T Pro', screenTypeAr: 'شاشة أصلية CrystalRes AMOLED 144Hz', screenTypeFr: 'Écran CrystalRes AMOLED 144Hz Original', partPrice: 18000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-redmi-n13pp', brand: 'Redmi', model: 'Redmi Note 13 Pro+ 5G', screenTypeAr: 'شاشة أصلية AMOLED منحنية 1.5K', screenTypeFr: 'Écran AMOLED Incurvé 1.5K Original', partPrice: 14000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-redmi-n13p', brand: 'Redmi', model: 'Redmi Note 13 Pro', screenTypeAr: 'شاشة أصلية AMOLED 120Hz', screenTypeFr: 'Écran AMOLED 120Hz Original', partPrice: 9500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-redmi-n13', brand: 'Redmi', model: 'Redmi Note 13 4G', screenTypeAr: 'شاشة أصلية AMOLED 120Hz', screenTypeFr: 'Écran AMOLED 120Hz Original', partPrice: 6500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-redmi-n12p', brand: 'Redmi', model: 'Redmi Note 12 Pro', screenTypeAr: 'شاشة أصلية OLED 120Hz', screenTypeFr: 'Écran OLED 120Hz Original', partPrice: 8500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-redmi-n12', brand: 'Redmi', model: 'Redmi Note 12', screenTypeAr: 'شاشة أصلية AMOLED 120Hz', screenTypeFr: 'Écran AMOLED 120Hz Original', partPrice: 5500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-redmi-n11', brand: 'Redmi', model: 'Redmi Note 11', screenTypeAr: 'شاشة أصلية AMOLED 90Hz', screenTypeFr: 'Écran AMOLED 90Hz Original', partPrice: 4800, warrantyMonths: 3, durationMinutes: 25, inStock: true },
  { id: 'scr-redmi-13c', brand: 'Redmi', model: 'Redmi 13C / 12', screenTypeAr: 'شاشة أصلية IPS LCD 90Hz', screenTypeFr: 'Écran IPS LCD 90Hz Original', partPrice: 4200, warrantyMonths: 3, durationMinutes: 25, inStock: true },
  { id: 'scr-redmi-9a', brand: 'Redmi', model: 'Redmi 9A / 9C', screenTypeAr: 'شاشة أصلية HD+', screenTypeFr: 'Écran HD+ Original', partPrice: 3500, warrantyMonths: 3, durationMinutes: 25, inStock: true },

  // --- OPPO ---
  { id: 'scr-oppo-reno11p', brand: 'Oppo', model: 'Oppo Reno 11 Pro', screenTypeAr: 'شاشة أصلية 3D Curved OLED 120Hz', screenTypeFr: 'Écran OLED Incurvé 120Hz Original', partPrice: 18000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-oppo-reno11', brand: 'Oppo', model: 'Oppo Reno 11', screenTypeAr: 'شاشة أصلية OLED 120Hz', screenTypeFr: 'Écran OLED 120Hz Original', partPrice: 15000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-oppo-reno8', brand: 'Oppo', model: 'Oppo Reno 8', screenTypeAr: 'شاشة أصلية AMOLED 90Hz', screenTypeFr: 'Écran AMOLED 90Hz Original', partPrice: 9500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-oppo-a78', brand: 'Oppo', model: 'Oppo A78 4G', screenTypeAr: 'شاشة أصلية AMOLED 90Hz', screenTypeFr: 'Écran AMOLED 90Hz Original', partPrice: 6500, warrantyMonths: 3, durationMinutes: 25, inStock: true },
  { id: 'scr-oppo-a58', brand: 'Oppo', model: 'Oppo A58 / A38 / A18', screenTypeAr: 'شاشة أصلية IPS LCD 90Hz', screenTypeFr: 'Écran IPS LCD 90Hz Original', partPrice: 4500, warrantyMonths: 3, durationMinutes: 25, inStock: true },

  // --- REALME ---
  { id: 'scr-realme-12pp', brand: 'Realme', model: 'Realme 12 Pro+ 5G', screenTypeAr: 'شاشة أصلية OLED 120Hz Curved', screenTypeFr: 'Écran OLED 120Hz Incurvé Original', partPrice: 16000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-realme-11p', brand: 'Realme', model: 'Realme 11 Pro+', screenTypeAr: 'شاشة أصلية OLED 120Hz', screenTypeFr: 'Écran OLED 120Hz Original', partPrice: 12000, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-realme-c67', brand: 'Realme', model: 'Realme C67 / C55 / C53', screenTypeAr: 'شاشة أصلية IPS LCD 90Hz FHD+', screenTypeFr: 'Écran IPS LCD 90Hz Original', partPrice: 4800, warrantyMonths: 3, durationMinutes: 25, inStock: true },

  // --- INFINIX & TECNO ---
  { id: 'scr-inf-n40p', brand: 'Infinix', model: 'Infinix Note 40 Pro', screenTypeAr: 'شاشة أصلية AMOLED 3D Curved 120Hz', screenTypeFr: 'Écran AMOLED 3D Incurvé 120Hz Original', partPrice: 11000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-inf-h40p', brand: 'Infinix', model: 'Infinix Hot 40 Pro / 30', screenTypeAr: 'شاشة أصلية IPS LCD 120Hz', screenTypeFr: 'Écran IPS LCD 120Hz Original', partPrice: 4500, warrantyMonths: 3, durationMinutes: 25, inStock: true },
  { id: 'scr-inf-smart8', brand: 'Infinix', model: 'Infinix Smart 8', screenTypeAr: 'شاشة أصلية HD+ 90Hz', screenTypeFr: 'Écran HD+ 90Hz Original', partPrice: 3800, warrantyMonths: 3, durationMinutes: 25, inStock: true },
  { id: 'scr-tecno-c30p', brand: 'Tecno', model: 'Tecno Camon 30 Pro', screenTypeAr: 'شاشة أصلية AMOLED 144Hz', screenTypeFr: 'Écran AMOLED 144Hz Original', partPrice: 9500, warrantyMonths: 3, durationMinutes: 30, inStock: true },
  { id: 'scr-tecno-sp20', brand: 'Tecno', model: 'Tecno Spark 20 Pro', screenTypeAr: 'شاشة أصلية IPS LCD 120Hz', screenTypeFr: 'Écran IPS LCD 120Hz Original', partPrice: 4500, warrantyMonths: 3, durationMinutes: 25, inStock: true },

  // --- HONOR ---
  { id: 'scr-honor-m6p', brand: 'Honor', model: 'Honor Magic 6 Pro', screenTypeAr: 'شاشة أصلية LTPO OLED 120Hz', screenTypeFr: 'Écran LTPO OLED 120Hz Original', partPrice: 38000, warrantyMonths: 3, durationMinutes: 45, inStock: true },
  { id: 'scr-honor-200', brand: 'Honor', model: 'Honor 200 Pro / 90', screenTypeAr: 'شاشة أصلية OLED 120Hz 1.5K', screenTypeFr: 'Écran OLED 120Hz Original', partPrice: 16000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-honor-x9b', brand: 'Honor', model: 'Honor X9b', screenTypeAr: 'شاشة أصلية AMOLED فائقة المتانة', screenTypeFr: 'Écran AMOLED Ultra-Résistant Original', partPrice: 14000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
  { id: 'scr-honor-x8b', brand: 'Honor', model: 'Honor X8b / X7b / X6a', screenTypeAr: 'شاشة أصلية AMOLED 90Hz', screenTypeFr: 'Écran AMOLED 90Hz Original', partPrice: 5500, warrantyMonths: 3, durationMinutes: 25, inStock: true },

  // --- GOOGLE PIXEL ---
  { id: 'scr-pixel-9p', brand: 'Google', model: 'Pixel 9 Pro XL / 9 Pro', screenTypeAr: 'شاشة أصلية Super Actua OLED', screenTypeFr: 'Écran Super Actua OLED Original', partPrice: 44000, warrantyMonths: 3, durationMinutes: 45, inStock: true },
  { id: 'scr-pixel-8p', brand: 'Google', model: 'Pixel 8 Pro / 8', screenTypeAr: 'شاشة أصلية Actua OLED 120Hz', screenTypeFr: 'Écran Actua OLED 120Hz Original', partPrice: 26000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-pixel-7', brand: 'Google', model: 'Pixel 7 Pro', screenTypeAr: 'شاشة أصلية LTPO OLED 120Hz', screenTypeFr: 'Écran LTPO OLED 120Hz Original', partPrice: 22000, warrantyMonths: 3, durationMinutes: 40, inStock: true },
  { id: 'scr-pixel-7a', brand: 'Google', model: 'Pixel 7 / 7a', screenTypeAr: 'شاشة أصلية OLED 90Hz', screenTypeFr: 'Écran OLED 90Hz Original', partPrice: 14000, warrantyMonths: 3, durationMinutes: 35, inStock: true },
];

// =========================================================================
// 2. BATTERIES_UPDATED SHEET (ورقة البطاريات الرسمية)
// =========================================================================
export const BATTERIES_SHEET: BatteryPriceRecord[] = [
  // --- APPLE iPHONE BATTERIES ---
  { id: 'bat-apple-15pm', brand: 'Apple', model: 'iPhone 15 Pro Max', batteryTypeAr: 'بطارية أصلية عالية الأداء (صحة 100%)', batteryTypeFr: 'Batterie Originale Haute Performance (100% Santé)', capacityMah: 4422, partPrice: 7500, warrantyMonths: 6, durationMinutes: 30, inStock: true },
  { id: 'bat-apple-15p', brand: 'Apple', model: 'iPhone 15 Pro / 15', batteryTypeAr: 'بطارية أصلية عالية الأداء (صحة 100%)', batteryTypeFr: 'Batterie Originale Haute Performance (100% Santé)', capacityMah: 3349, partPrice: 6800, warrantyMonths: 6, durationMinutes: 30, inStock: true },
  { id: 'bat-apple-14pm', brand: 'Apple', model: 'iPhone 14 Pro Max', batteryTypeAr: 'بطارية أصلية عالية الأداء (صحة 100%)', batteryTypeFr: 'Batterie Originale Haute Performance', capacityMah: 4323, partPrice: 6500, warrantyMonths: 6, durationMinutes: 30, inStock: true },
  { id: 'bat-apple-14p', brand: 'Apple', model: 'iPhone 14 Pro / 14', batteryTypeAr: 'بطارية أصلية عالية الأداء', batteryTypeFr: 'Batterie Originale Haute Performance', capacityMah: 3200, partPrice: 5800, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-apple-13pm', brand: 'Apple', model: 'iPhone 13 Pro Max', batteryTypeAr: 'بطارية أصلية عالية الأداء (صحة 100%)', batteryTypeFr: 'Batterie Originale Haute Performance', capacityMah: 4352, partPrice: 5500, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-apple-13', brand: 'Apple', model: 'iPhone 13 / 13 Pro', batteryTypeAr: 'بطارية أصلية مع شريحة تحكم ذكية', batteryTypeFr: 'Batterie Originale avec BMS', capacityMah: 3227, partPrice: 4800, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-apple-12pm', brand: 'Apple', model: 'iPhone 12 Pro Max', batteryTypeAr: 'بطارية أصلية مع شريحة تحكم ذكية', batteryTypeFr: 'Batterie Originale avec BMS', capacityMah: 3687, partPrice: 4500, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-apple-12', brand: 'Apple', model: 'iPhone 12 / 12 Pro', batteryTypeAr: 'بطارية أصلية', batteryTypeFr: 'Batterie Originale Haute Capacité', capacityMah: 2815, partPrice: 4200, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-apple-11pm', brand: 'Apple', model: 'iPhone 11 Pro Max', batteryTypeAr: 'بطارية أصلية', batteryTypeFr: 'Batterie Originale Haute Capacité', capacityMah: 3969, partPrice: 4200, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-apple-11p', brand: 'Apple', model: 'iPhone 11 Pro', batteryTypeAr: 'بطارية أصلية', batteryTypeFr: 'Batterie Originale Haute Capacité', capacityMah: 3046, partPrice: 3800, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-apple-11', brand: 'Apple', model: 'iPhone 11', batteryTypeAr: 'بطارية أصلية', batteryTypeFr: 'Batterie Originale Haute Capacité', capacityMah: 3110, partPrice: 3500, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-apple-x-xs', brand: 'Apple', model: 'iPhone X / XS / XR', batteryTypeAr: 'بطارية أصلية ممتازة', batteryTypeFr: 'Batterie Originale Certifiée', capacityMah: 2716, partPrice: 3200, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-apple-8-7', brand: 'Apple', model: 'iPhone 8 / 7 / SE', batteryTypeAr: 'بطارية أصلية', batteryTypeFr: 'Batterie Originale', capacityMah: 1821, partPrice: 2500, warrantyMonths: 6, durationMinutes: 20, inStock: true },

  // --- SAMSUNG GALAXY BATTERIES ---
  { id: 'bat-sam-s24u', brand: 'Samsung', model: 'Galaxy S24 Ultra', batteryTypeAr: 'بطارية Samsung Service Pack أصلية 5000mAh', batteryTypeFr: 'Batterie Originale Samsung Service Pack 5000mAh', capacityMah: 5000, partPrice: 6500, warrantyMonths: 6, durationMinutes: 30, inStock: true },
  { id: 'bat-sam-s23u', brand: 'Samsung', model: 'Galaxy S23 Ultra', batteryTypeAr: 'بطارية Samsung Service Pack أصلية 5000mAh', batteryTypeFr: 'Batterie Originale Samsung Service Pack 5000mAh', capacityMah: 5000, partPrice: 5500, warrantyMonths: 6, durationMinutes: 30, inStock: true },
  { id: 'bat-sam-s23', brand: 'Samsung', model: 'Galaxy S23 / S22', batteryTypeAr: 'بطارية Samsung أصلية', batteryTypeFr: 'Batterie Originale Samsung', capacityMah: 3900, partPrice: 4500, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-sam-s21fe', brand: 'Samsung', model: 'Galaxy S21 FE / S21', batteryTypeAr: 'بطارية Samsung أصلية 4500mAh', batteryTypeFr: 'Batterie Originale Samsung 4500mAh', capacityMah: 4500, partPrice: 4200, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-sam-n20u', brand: 'Samsung', model: 'Galaxy Note 20 Ultra', batteryTypeAr: 'بطارية Samsung أصلية 4500mAh', batteryTypeFr: 'Batterie Originale Samsung 4500mAh', capacityMah: 4500, partPrice: 4500, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-sam-a55', brand: 'Samsung', model: 'Galaxy A55 5G / A54 5G', batteryTypeAr: 'بطارية Samsung Service Pack أصلية 5000mAh', batteryTypeFr: 'Batterie Originale Samsung Service Pack 5000mAh', capacityMah: 5000, partPrice: 3800, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-sam-a34', brand: 'Samsung', model: 'Galaxy A34 5G / A35 5G', batteryTypeAr: 'بطارية Samsung أصلية 5000mAh', batteryTypeFr: 'Batterie Originale Samsung 5000mAh', capacityMah: 5000, partPrice: 3500, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-sam-a15', brand: 'Samsung', model: 'Galaxy A15 / A14 / A05s', batteryTypeAr: 'بطارية Samsung أصلية 5000mAh', batteryTypeFr: 'Batterie Originale Samsung 5000mAh', capacityMah: 5000, partPrice: 2800, warrantyMonths: 6, durationMinutes: 25, inStock: true },

  // --- XIAOMI & REDMI BATTERIES ---
  { id: 'bat-xiaomi-13t', brand: 'Xiaomi', model: 'Xiaomi 13T / 13T Pro / 12', batteryTypeAr: 'بطارية Xiaomi أصلية 5000mAh Turbo Charge', batteryTypeFr: 'Batterie Originale Xiaomi 5000mAh Turbo Charge', capacityMah: 5000, partPrice: 4500, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-redmi-n13', brand: 'Redmi', model: 'Redmi Note 13 Pro+ / 13 Pro / 13', batteryTypeAr: 'بطارية Redmi أصلية 5000mAh Fast Charge', batteryTypeFr: 'Batterie Originale Redmi 5000mAh Fast Charge', capacityMah: 5000, partPrice: 3500, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-redmi-n12', brand: 'Redmi', model: 'Redmi Note 12 Pro / 12 / 11', batteryTypeAr: 'بطارية Redmi أصلية 5000mAh', batteryTypeFr: 'Batterie Originale Redmi 5000mAh', capacityMah: 5000, partPrice: 3200, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-redmi-13c', brand: 'Redmi', model: 'Redmi 13C / 12 / 10C / 9A', batteryTypeAr: 'بطارية Redmi أصلية 5000mAh', batteryTypeFr: 'Batterie Originale Redmi 5000mAh', capacityMah: 5000, partPrice: 2500, warrantyMonths: 6, durationMinutes: 25, inStock: true },

  // --- OPPO BATTERIES ---
  { id: 'bat-oppo-reno', brand: 'Oppo', model: 'Oppo Reno 11 Pro / 11 / 8', batteryTypeAr: 'بطارية Oppo أصلية تدعم SuperVOOC', batteryTypeFr: 'Batterie Originale Oppo SuperVOOC', capacityMah: 5000, partPrice: 4200, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-oppo-a', brand: 'Oppo', model: 'Oppo A78 / A58 / A38 / A18', batteryTypeAr: 'بطارية Oppo أصلية 5000mAh', batteryTypeFr: 'Batterie Originale Oppo 5000mAh', capacityMah: 5000, partPrice: 3000, warrantyMonths: 6, durationMinutes: 25, inStock: true },

  // --- REALME BATTERIES ---
  { id: 'bat-realme-12', brand: 'Realme', model: 'Realme 12 Pro+ / 11 Pro+', batteryTypeAr: 'بطارية Realme أصلية Dart Charge', batteryTypeFr: 'Batterie Originale Realme Dart Charge', capacityMah: 5000, partPrice: 3800, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-realme-c', brand: 'Realme', model: 'Realme C67 / C55 / C53', batteryTypeAr: 'بطارية Realme أصلية 5000mAh', batteryTypeFr: 'Batterie Originale Realme 5000mAh', capacityMah: 5000, partPrice: 2800, warrantyMonths: 6, durationMinutes: 25, inStock: true },

  // --- INFINIX & TECNO BATTERIES ---
  { id: 'bat-inf-note', brand: 'Infinix', model: 'Infinix Note 40 Pro / 30', batteryTypeAr: 'بطارية Infinix أصلية All-Round FastCharge', batteryTypeFr: 'Batterie Originale Infinix FastCharge', capacityMah: 5000, partPrice: 3200, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-inf-hot', brand: 'Infinix', model: 'Infinix Hot 40 Pro / Smart 8', batteryTypeAr: 'بطارية Infinix أصلية 5000mAh', batteryTypeFr: 'Batterie Originale Infinix 5000mAh', capacityMah: 5000, partPrice: 2500, warrantyMonths: 6, durationMinutes: 25, inStock: true },
  { id: 'bat-tecno-sp', brand: 'Tecno', model: 'Tecno Camon 30 / Spark 20', batteryTypeAr: 'بطارية Tecno أصلية 5000mAh', batteryTypeFr: 'Batterie Originale Tecno 5000mAh', capacityMah: 5000, partPrice: 2800, warrantyMonths: 6, durationMinutes: 25, inStock: true },

  // --- HONOR BATTERIES ---
  { id: 'bat-honor-m6', brand: 'Honor', model: 'Honor Magic 6 Pro / 200 Pro', batteryTypeAr: 'بطارية Honor Silicon-Carbon أصلية', batteryTypeFr: 'Batterie Originale Honor Silicon-Carbon', capacityMah: 5600, partPrice: 5800, warrantyMonths: 6, durationMinutes: 30, inStock: true },
  { id: 'bat-honor-x9', brand: 'Honor', model: 'Honor X9b / X8b / X7b', batteryTypeAr: 'بطارية Honor أصلية طويلة العمر 5800mAh', batteryTypeFr: 'Batterie Originale Honor 5800mAh', capacityMah: 5800, partPrice: 3500, warrantyMonths: 6, durationMinutes: 25, inStock: true },

  // --- GOOGLE PIXEL BATTERIES ---
  { id: 'bat-pixel-9', brand: 'Google', model: 'Pixel 9 Pro XL / 9 / 8 Pro / 8', batteryTypeAr: 'بطارية Google Pixel أصلية', batteryTypeFr: 'Batterie Originale Google Pixel', capacityMah: 5060, partPrice: 5200, warrantyMonths: 6, durationMinutes: 30, inStock: true },
  { id: 'bat-pixel-7', brand: 'Google', model: 'Pixel 7 Pro / 7 / 7a', batteryTypeAr: 'بطارية Google Pixel أصلية', batteryTypeFr: 'Batterie Originale Google Pixel', capacityMah: 4926, partPrice: 4200, warrantyMonths: 6, durationMinutes: 25, inStock: true },
];

// =========================================================================
// 3. CATALOGUE_GLOBAL SHEET (الكتالوج الشامل لجميع القطع والأعطال)
// =========================================================================
export const GLOBAL_CATALOG_SHEET: GlobalCatalogRecord[] = [
  // --- Charging Ports (مدخل الشحن) ---
  { id: 'glob-ch-ip15', category: 'charging', brand: 'Apple', model: 'iPhone 15 / 15 Pro / 16', itemNameAr: 'تغيير فلكس مدخل الشحن Type-C أصلي', itemNameFr: 'Remplacement Nappe Connecteur Type-C Original', partPrice: 4500, warrantyMonths: 3, durationMinutes: 35 },
  { id: 'glob-ch-ip13', category: 'charging', brand: 'Apple', model: 'iPhone 13 / 14 / 12 / 11', itemNameAr: 'تغيير فلكس مدخل الشحن Lightning أصلي', itemNameFr: 'Remplacement Nappe Connecteur Lightning Original', partPrice: 3500, warrantyMonths: 3, durationMinutes: 30 },
  { id: 'glob-ch-sams', category: 'charging', brand: 'Samsung', model: 'Galaxy S24 / S23 / S22 / S21', itemNameAr: 'تغيير بطاقة الشحن السريع Type-C أصلية', itemNameFr: 'Remplacement Sub-Board Charge Type-C Original', partPrice: 3500, warrantyMonths: 3, durationMinutes: 25 },
  { id: 'glob-ch-sama', category: 'charging', brand: 'Samsung', model: 'Galaxy A55 / A54 / A34 / A15 / A14', itemNameAr: 'تغيير بطاقة مدخل الشحن Type-C أصلية', itemNameFr: 'Remplacement Carte Connecteur Charge Type-C', partPrice: 2200, warrantyMonths: 3, durationMinutes: 25 },
  { id: 'glob-ch-redmi', category: 'charging', brand: 'Redmi', model: 'Redmi Note 13 / 12 / 11 / 13C', itemNameAr: 'تغيير كارت الشحن السريع Type-C', itemNameFr: 'Remplacement Connecteur Charge Type-C Original', partPrice: 2000, warrantyMonths: 3, durationMinutes: 25 },
  { id: 'glob-ch-oppo', category: 'charging', brand: 'Oppo', model: 'Oppo Reno & A Series', itemNameAr: 'تغيير بطاقة الشحن السريع SuperVOOC Type-C', itemNameFr: 'Remplacement Connecteur Charge SuperVOOC', partPrice: 2200, warrantyMonths: 3, durationMinutes: 25 },
  { id: 'glob-ch-realme', category: 'charging', brand: 'Realme', model: 'Realme 12 / 11 / C Series', itemNameAr: 'تغيير بطاقة مدخل الشحن Type-C', itemNameFr: 'Remplacement Connecteur Charge Type-C', partPrice: 2000, warrantyMonths: 3, durationMinutes: 25 },
  { id: 'glob-ch-inf', category: 'charging', brand: 'Infinix', model: 'Infinix & Tecno All Models', itemNameAr: 'تغيير بطاقة الشحن Type-C', itemNameFr: 'Remplacement Carte Connecteur Charge', partPrice: 1800, warrantyMonths: 3, durationMinutes: 25 },

  // --- Camera (الكاميرا) ---
  { id: 'glob-cam-ip14', category: 'camera', brand: 'Apple', model: 'iPhone 15 Pro / 14 Pro / 13 Pro', itemNameAr: 'تغيير وحدة الكاميرا الخلفية الأصلية مع ضبط OIS', itemNameFr: 'Remplacement Module Caméra Arrière Original avec OIS', partPrice: 16000, warrantyMonths: 3, durationMinutes: 35 },
  { id: 'glob-cam-ip13', category: 'camera', brand: 'Apple', model: 'iPhone 13 / 12 / 11', itemNameAr: 'تغيير وحدة الكاميرا الخلفية الأصلية', itemNameFr: 'Remplacement Module Caméra Arrière Original', partPrice: 8500, warrantyMonths: 3, durationMinutes: 30 },
  { id: 'glob-cam-sam', category: 'camera', brand: 'Samsung', model: 'Galaxy S24 / S23 / S22 Ultra', itemNameAr: 'تغيير وحدة الكاميرا 200MP / 108MP الأصلية', itemNameFr: 'Remplacement Module Caméra Original', partPrice: 14000, warrantyMonths: 3, durationMinutes: 35 },
  { id: 'glob-cam-glass', category: 'camera', brand: 'All', model: 'Tous modèles', itemNameAr: 'تغيير زجاج عدسة الكاميرا الخارجية المكسور', itemNameFr: 'Remplacement Lentille Verre Caméra', partPrice: 1500, warrantyMonths: 3, durationMinutes: 20 },

  // --- Speaker & Micro (الصوت والميكروفون) ---
  { id: 'glob-spk-ip', category: 'speaker', brand: 'Apple', model: 'iPhone All Models', itemNameAr: 'تغيير مكبر الصوت أو سماعة المكالمات الأذن الأصلية', itemNameFr: 'Remplacement Haut-Parleur / Écouteur Appel Original', partPrice: 2800, warrantyMonths: 3, durationMinutes: 25 },
  { id: 'glob-spk-sam', category: 'speaker', brand: 'Samsung', model: 'Samsung & Xiaomi Models', itemNameAr: 'تغيير مكبر الصوت السلكي أو الميكروفون', itemNameFr: 'Remplacement Haut-Parleur ou Micro Original', partPrice: 2000, warrantyMonths: 3, durationMinutes: 25 },

  // --- Software / Flashing (النظام) ---
  { id: 'glob-soft-all', category: 'software', brand: 'All', model: 'Tous modèles', itemNameAr: 'فلاش رسمي وتحديث نظام، حل مشكلة الشعار (Bootloop)', itemNameFr: 'Flashage officiel & Restauration Système', partPrice: 2000, warrantyMonths: 1, durationMinutes: 30 },
];

// Storage keys for custom technicians pricing modifications
const SCREEN_STORAGE_KEY = 'the_fix_point_screen_prices_v2';
const BATTERY_STORAGE_KEY = 'the_fix_point_battery_prices_v2';

/**
 * Get all screen prices (localStorage overrides or official defaults)
 */
export function getAllScreenPrices(): ScreenPriceRecord[] {
  try {
    const raw = localStorage.getItem(SCREEN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return ECRANS_SHEET;
}

/**
 * Get all battery prices (localStorage overrides or official defaults)
 */
export function getAllBatteryPrices(): BatteryPriceRecord[] {
  try {
    const raw = localStorage.getItem(BATTERY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return BATTERIES_SHEET;
}

/**
 * Save / Update a screen price record
 */
export function saveScreenPrice(record: ScreenPriceRecord): void {
  const current = getAllScreenPrices();
  const index = current.findIndex((r) => r.id === record.id);
  let updated: ScreenPriceRecord[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = record;
  } else {
    updated = [record, ...current];
  }
  localStorage.setItem(SCREEN_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Delete a screen price record
 */
export function deleteScreenPrice(id: string): void {
  const current = getAllScreenPrices();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(SCREEN_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Reset all screen prices back to official Ecrans sheet
 */
export function resetScreenPricesToDefault(): void {
  localStorage.removeItem(SCREEN_STORAGE_KEY);
}

/**
 * Save / Update a battery price record
 */
export function saveBatteryPrice(record: BatteryPriceRecord): void {
  const current = getAllBatteryPrices();
  const index = current.findIndex((r) => r.id === record.id);
  let updated: BatteryPriceRecord[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = record;
  } else {
    updated = [record, ...current];
  }
  localStorage.setItem(BATTERY_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Delete a battery price record
 */
export function deleteBatteryPrice(id: string): void {
  const current = getAllBatteryPrices();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(BATTERY_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Reset all battery prices back to official Batteries_Updated sheet
 */
export function resetBatteryPricesToDefault(): void {
  localStorage.removeItem(BATTERY_STORAGE_KEY);
}

// =========================================================================
// LABOR RULES (قواعد اليد العاملة الدقيقة)
// =========================================================================

/**
 * RULE: Screens Labor (الشاشات)
 * - Part <= 5,000 DZD       --> 2,000 DZD
 * - Part 5,001 - 10,000 DZD  --> 3,000 DZD
 * - Part 10,001 - 20,000 DZD --> 5,000 DZD
 * - Part > 20,000 DZD       --> 6,000 DZD
 */
export function calculateScreenLaborFee(partPrice: number | null | undefined): number | null {
  if (partPrice === null || partPrice === undefined || isNaN(partPrice) || partPrice <= 0) {
    return null;
  }
  if (partPrice <= 5000) return 2000;
  if (partPrice <= 10000) return 3000;
  if (partPrice <= 20000) return 5000;
  return 6000;
}

/**
 * RULE: Batteries Labor (البطاريات)
 * - Part <= 3,000 DZD       --> 1,000 DZD
 * - Part 3,001 - 5,000 DZD  --> 2,000 DZD
 * - Part > 5,000 DZD        --> 3,000 DZD
 */
export function calculateBatteryLaborFee(partPrice: number | null | undefined): number | null {
  if (partPrice === null || partPrice === undefined || isNaN(partPrice) || partPrice <= 0) {
    return null;
  }
  if (partPrice <= 3000) return 1000;
  if (partPrice <= 5000) return 2000;
  return 3000;
}

/**
 * Backward compatibility labor fee calculation
 */
export function calculateLaborFee(partPrice: number | null | undefined): number | null {
  return calculateScreenLaborFee(partPrice);
}

/**
 * Labor for general parts in Catalogue_Global
 */
export function calculateGeneralLaborFee(partPrice: number | null | undefined): number | null {
  if (partPrice === null || partPrice === undefined || isNaN(partPrice) || partPrice <= 0) {
    return null;
  }
  if (partPrice <= 3000) return 1500;
  if (partPrice <= 8000) return 2500;
  return 3500;
}

/**
 * Normalized string helper for accurate lookup
 */
function normalizeModelString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Lookup exact Screen in Ecrans Sheet.
 * If model is NOT in database, returns null. NEVER fabricates a price.
 */
export function findScreenPrice(brandName: string, modelName: string): ScreenPriceRecord | null {
  if (!modelName || !modelName.trim()) return null;
  const list = getAllScreenPrices();

  const normModel = normalizeModelString(modelName);
  const normBrand = normalizeModelString(brandName || '');

  // 1. Exact model match within brand
  const exact = list.find((item) => {
    const itemModelNorm = normalizeModelString(item.model);
    const itemBrandNorm = normalizeModelString(item.brand);
    
    if (normBrand && itemBrandNorm !== normBrand) {
      if (!normModel.includes(itemBrandNorm)) return false;
    }

    return itemModelNorm === normModel;
  });

  if (exact) return exact;

  // 2. Substring match (e.g. 'iPhone 13 128GB' -> matches 'iPhone 13')
  const matched = list.find((item) => {
    const itemModelNorm = normalizeModelString(item.model);
    const itemBrandNorm = normalizeModelString(item.brand);

    if (normBrand && itemBrandNorm !== normBrand && !normModel.includes(itemBrandNorm)) {
      return false;
    }

    return normModel.includes(itemModelNorm) || itemModelNorm.includes(normModel);
  });

  return matched || null;
}

/**
 * Lookup exact Battery in Batteries_Updated Sheet.
 * If model is NOT in database, returns null. NEVER fabricates a price.
 */
export function findBatteryPrice(brandName: string, modelName: string): BatteryPriceRecord | null {
  if (!modelName || !modelName.trim()) return null;
  const list = getAllBatteryPrices();

  const normModel = normalizeModelString(modelName);
  const normBrand = normalizeModelString(brandName || '');

  // 1. Exact model match
  const exact = list.find((item) => {
    const itemModelNorm = normalizeModelString(item.model);
    const itemBrandNorm = normalizeModelString(item.brand);

    if (normBrand && itemBrandNorm !== normBrand) {
      if (!normModel.includes(itemBrandNorm)) return false;
    }

    return itemModelNorm === normModel;
  });

  if (exact) return exact;

  // 2. Substring match
  const matched = list.find((item) => {
    const itemModelNorm = normalizeModelString(item.model);
    const itemBrandNorm = normalizeModelString(item.brand);

    if (normBrand && itemBrandNorm !== normBrand && !normModel.includes(itemBrandNorm)) {
      return false;
    }

    return normModel.includes(itemModelNorm) || itemModelNorm.includes(normModel);
  });

  return matched || null;
}

/**
 * Lookup other parts in Catalogue_Global Sheet.
 */
export function findGlobalCatalogPrice(brandName: string, modelName: string, category: string): GlobalCatalogRecord | null {
  if (!category) return null;
  const list = GLOBAL_CATALOG_SHEET.filter((item) => item.category === category);
  if (list.length === 0) return null;

  const normModel = normalizeModelString(modelName || '');
  const normBrand = normalizeModelString(brandName || '');

  // Exact or category match
  const matched = list.find((item) => {
    if (item.brand === 'All') return true;
    const itemModelNorm = normalizeModelString(item.model);
    const itemBrandNorm = normalizeModelString(item.brand);

    if (normBrand && itemBrandNorm === normBrand) {
      if (normModel.includes(itemModelNorm) || itemModelNorm.includes(normModel)) return true;
    }

    return false;
  });

  return matched || list.find((item) => item.brand === 'All') || null;
}

export interface RepairEstimateResult {
  isPriceKnown: boolean;
  problemId: string;
  screenRecord: ScreenPriceRecord | null;
  batteryRecord: BatteryPriceRecord | null;
  globalRecord: GlobalCatalogRecord | null;
  partPrice: number | null;
  laborFee: number | null;
  estimatedRepairPrice: number | null; // partPrice + laborFee
  travelFee: number; // 2000 DZD starting base
  estimatedTotal: number | null; // estimatedRepairPrice + travelFee
  unknownNoticeAr: string;
  unknownNoticeFr: string;
  disclaimerAr: string;
  disclaimerFr: string;
}

/**
 * Computes repair estimate according to strict The Fix Point business rules.
 * Does NOT fabricate any unknown price.
 */
export function calculateRepairEstimate(
  brand: string,
  model: string,
  problemId: string,
  travelFee: number = BASE_TRAVEL_FEE
): RepairEstimateResult {
  const disclaimerAr = 'السعر النهائي يحدد بعد فحص الهاتف.';
  const disclaimerFr = 'Le prix final est confirmé après diagnostic.';
  const unknownNoticeAr = 'السعر يحدد بعد التشخيص.';
  const unknownNoticeFr = 'Le prix est fixé après diagnostic.';

  // 1. ECRANS (Screens)
  if (problemId === 'screen') {
    const record = findScreenPrice(brand, model);
    if (record && record.partPrice > 0) {
      const partPrice = record.partPrice;
      const laborFee = calculateScreenLaborFee(partPrice) || 2000;
      const estimatedRepairPrice = partPrice + laborFee;
      const estimatedTotal = estimatedRepairPrice + travelFee;

      return {
        isPriceKnown: true,
        problemId: 'screen',
        screenRecord: record,
        batteryRecord: null,
        globalRecord: null,
        partPrice,
        laborFee,
        estimatedRepairPrice,
        travelFee,
        estimatedTotal,
        unknownNoticeAr,
        unknownNoticeFr,
        disclaimerAr,
        disclaimerFr,
      };
    }

    // Screen model not in database -> NEVER invent a price
    return {
      isPriceKnown: false,
      problemId: 'screen',
      screenRecord: null,
      batteryRecord: null,
      globalRecord: null,
      partPrice: null,
      laborFee: null,
      estimatedRepairPrice: null,
      travelFee,
      estimatedTotal: null,
      unknownNoticeAr,
      unknownNoticeFr,
      disclaimerAr,
      disclaimerFr,
    };
  }

  // 2. BATTERIES_UPDATED (Batteries)
  if (problemId === 'battery') {
    const record = findBatteryPrice(brand, model);
    if (record && record.partPrice > 0) {
      const partPrice = record.partPrice;
      const laborFee = calculateBatteryLaborFee(partPrice) || 2000;
      const estimatedRepairPrice = partPrice + laborFee;
      const estimatedTotal = estimatedRepairPrice + travelFee;

      return {
        isPriceKnown: true,
        problemId: 'battery',
        screenRecord: null,
        batteryRecord: record,
        globalRecord: null,
        partPrice,
        laborFee,
        estimatedRepairPrice,
        travelFee,
        estimatedTotal,
        unknownNoticeAr,
        unknownNoticeFr,
        disclaimerAr,
        disclaimerFr,
      };
    }

    // Battery model not in database -> NEVER invent a price
    return {
      isPriceKnown: false,
      problemId: 'battery',
      screenRecord: null,
      batteryRecord: null,
      globalRecord: null,
      partPrice: null,
      laborFee: null,
      estimatedRepairPrice: null,
      travelFee,
      estimatedTotal: null,
      unknownNoticeAr,
      unknownNoticeFr,
      disclaimerAr,
      disclaimerFr,
    };
  }

  // 3. CATALOGUE_GLOBAL (Charging, Camera, Software, Speaker, etc.)
  const globalRecord = findGlobalCatalogPrice(brand, model, problemId);
  if (globalRecord && globalRecord.partPrice !== null && globalRecord.partPrice > 0) {
    const partPrice = globalRecord.partPrice;
    const laborFee = calculateGeneralLaborFee(partPrice) || 2000;
    const estimatedRepairPrice = partPrice + laborFee;
    const estimatedTotal = estimatedRepairPrice + travelFee;

    return {
      isPriceKnown: true,
      problemId,
      screenRecord: null,
      batteryRecord: null,
      globalRecord,
      partPrice,
      laborFee,
      estimatedRepairPrice,
      travelFee,
      estimatedTotal,
      unknownNoticeAr,
      unknownNoticeFr,
      disclaimerAr,
      disclaimerFr,
    };
  }

  // General unknown problem / unlisted model -> Diagnostic required
  return {
    isPriceKnown: false,
    problemId,
    screenRecord: null,
    batteryRecord: null,
    globalRecord: null,
    partPrice: null,
    laborFee: null,
    estimatedRepairPrice: null,
    travelFee,
    estimatedTotal: null,
    unknownNoticeAr,
    unknownNoticeFr,
    disclaimerAr,
    disclaimerFr,
  };
}
