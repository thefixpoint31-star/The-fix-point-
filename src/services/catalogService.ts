import { PriceCatalogProduct, ScreenPriceRecord, BatteryPriceRecord, GlobalCatalogRecord } from '../types';
import { 
  ECRANS_SHEET, BATTERIES_SHEET, GLOBAL_CATALOG_SHEET,
  getAllScreenPrices, getAllBatteryPrices,
  calculateScreenLaborFee, calculateBatteryLaborFee, calculateGeneralLaborFee,
  BASE_TRAVEL_FEE 
} from './pricingService';

const CATALOG_STORAGE_KEY = 'the_fix_point_price_catalog_v3';
const CATALOG_DISCOUNTS_KEY = 'the_fix_point_catalog_discounts_v3';
const CATALOG_CUSTOM_LABOR_KEY = 'the_fix_point_custom_labor_v3';

/**
 * Builds standard PriceCatalogProduct items from the official sheets
 */
export function buildOfficialCatalog(): PriceCatalogProduct[] {
  const products: PriceCatalogProduct[] = [];

  // 1. Screens from ECRANS_SHEET
  const screenRecords = getAllScreenPrices();
  screenRecords.forEach((s) => {
    const labor = calculateScreenLaborFee(s.partPrice) || 2000;
    const servicePrice = s.partPrice + labor;
    const travel = BASE_TRAVEL_FEE;
    const discount = 0;
    const total = servicePrice + travel - discount;

    products.push({
      id: s.id,
      category: 'screen',
      categoryNameAr: 'شاشات أصلية',
      categoryNameFr: 'Écrans Originaux',
      brand: s.brand,
      model: s.model,
      partTypeAr: s.screenTypeAr,
      partTypeFr: s.screenTypeFr,
      partPrice: s.partPrice,
      laborFee: labor,
      servicePrice,
      travelFee: travel,
      discount,
      estimatedTotal: total,
      warrantyMonths: s.warrantyMonths || 3,
      durationMinutes: s.durationMinutes || 35,
      inStock: s.inStock ?? true,
    });
  });

  // 2. Batteries from BATTERIES_SHEET
  const batteryRecords = getAllBatteryPrices();
  batteryRecords.forEach((b) => {
    const labor = calculateBatteryLaborFee(b.partPrice) || 2000;
    const servicePrice = b.partPrice + labor;
    const travel = BASE_TRAVEL_FEE;
    const discount = 0;
    const total = servicePrice + travel - discount;

    products.push({
      id: b.id,
      category: 'battery',
      categoryNameAr: 'بطاريات أصلية',
      categoryNameFr: 'Batteries Originales',
      brand: b.brand,
      model: b.model,
      partTypeAr: `${b.batteryTypeAr}${b.capacityMah ? ` (${b.capacityMah} mAh)` : ''}`,
      partTypeFr: `${b.batteryTypeFr}${b.capacityMah ? ` (${b.capacityMah} mAh)` : ''}`,
      partPrice: b.partPrice,
      laborFee: labor,
      servicePrice,
      travelFee: travel,
      discount,
      estimatedTotal: total,
      warrantyMonths: b.warrantyMonths || 6,
      durationMinutes: b.durationMinutes || 25,
      inStock: b.inStock ?? true,
    });
  });

  // 3. General parts from GLOBAL_CATALOG_SHEET
  GLOBAL_CATALOG_SHEET.forEach((g) => {
    let catNameAr = 'قطع غيار عامة';
    let catNameFr = 'Pièces Générales';
    if (g.category === 'charging') {
      catNameAr = 'مدخل الشحن';
      catNameFr = 'Connecteur de charge';
    } else if (g.category === 'camera') {
      catNameAr = 'الكاميرات والعدسات';
      catNameFr = 'Caméras et Lentilles';
    } else if (g.category === 'speaker') {
      catNameAr = 'الصوت وسماعة الأذن';
      catNameFr = 'Haut-parleur & Écouteur';
    } else if (g.category === 'software') {
      catNameAr = 'النظام والبرمجة';
      catNameFr = 'Système & Logiciel';
    }

    const partPrice = g.partPrice;
    const labor = partPrice !== null ? (calculateGeneralLaborFee(partPrice) || 2000) : null;
    const servicePrice = partPrice !== null && labor !== null ? partPrice + labor : null;
    const travel = BASE_TRAVEL_FEE;
    const discount = 0;
    const estimatedTotal = servicePrice !== null ? servicePrice + travel - discount : null;

    products.push({
      id: g.id,
      category: g.category as any,
      categoryNameAr: catNameAr,
      categoryNameFr: catNameFr,
      brand: g.brand,
      model: g.model,
      partTypeAr: g.itemNameAr,
      partTypeFr: g.itemNameFr,
      partPrice,
      laborFee: labor,
      servicePrice,
      travelFee: travel,
      discount,
      estimatedTotal,
      warrantyMonths: g.warrantyMonths || 3,
      durationMinutes: g.durationMinutes || 25,
      inStock: true,
    });
  });

  return products;
}

/**
 * Get all catalog products with custom overrides applied
 */
export function getAllCatalogProducts(): PriceCatalogProduct[] {
  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  const catalog = buildOfficialCatalog();
  return catalog;
}

/**
 * Save / Update a product in the catalog
 */
export function saveCatalogProduct(product: PriceCatalogProduct): void {
  const current = getAllCatalogProducts();
  const index = current.findIndex((p) => p.id === product.id);

  // Recalculate totals according to strict rules
  const travelFee = product.travelFee || BASE_TRAVEL_FEE;
  const discount = product.discount || 0;

  let calculatedLabor: number | null = product.laborFee;
  if (product.customLaborFee !== undefined && product.customLaborFee !== null) {
    calculatedLabor = product.customLaborFee;
  } else if (product.partPrice !== null) {
    if (product.category === 'screen') {
      calculatedLabor = calculateScreenLaborFee(product.partPrice);
    } else if (product.category === 'battery') {
      calculatedLabor = calculateBatteryLaborFee(product.partPrice);
    } else {
      calculatedLabor = calculateGeneralLaborFee(product.partPrice);
    }
  }

  const servicePrice = product.partPrice !== null && calculatedLabor !== null
    ? product.partPrice + calculatedLabor
    : null;

  const estimatedTotal = servicePrice !== null
    ? Math.max(0, servicePrice + travelFee - discount)
    : null;

  const updatedProduct: PriceCatalogProduct = {
    ...product,
    laborFee: calculatedLabor,
    servicePrice,
    travelFee,
    discount,
    estimatedTotal,
  };

  let updatedList: PriceCatalogProduct[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = updatedProduct;
  } else {
    updatedList = [updatedProduct, ...current];
  }

  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updatedList));
}

/**
 * Delete a product from the catalog
 */
export function deleteCatalogProduct(id: string): void {
  const current = getAllCatalogProducts();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Reset catalog completely back to official Excel defaults
 */
export function resetCatalogToOfficial(): void {
  localStorage.removeItem(CATALOG_STORAGE_KEY);
  localStorage.removeItem(CATALOG_DISCOUNTS_KEY);
  localStorage.removeItem(CATALOG_CUSTOM_LABOR_KEY);
}

/**
 * Extract unique brands from the catalog
 */
export function getAvailableBrands(): string[] {
  const products = getAllCatalogProducts();
  const brandSet = new Set<string>();
  products.forEach((p) => {
    if (p.brand && p.brand !== 'All') {
      brandSet.add(p.brand);
    }
  });

  // Prioritize primary brands
  const primaryOrder = ['Apple', 'Samsung', 'Xiaomi', 'Redmi', 'Oppo', 'Realme', 'Infinix', 'Tecno', 'Honor', 'Google'];
  const allBrands = Array.from(brandSet);
  
  return [
    ...primaryOrder.filter(b => allBrands.includes(b)),
    ...allBrands.filter(b => !primaryOrder.includes(b))
  ];
}

/**
 * Get distinct models for a selected brand
 */
export function getModelsForBrand(brandName: string): string[] {
  const products = getAllCatalogProducts();
  const modelSet = new Set<string>();

  products.forEach((p) => {
    if (brandName === 'All' || p.brand.toLowerCase() === brandName.toLowerCase()) {
      if (p.model && p.model !== 'Tous modèles') {
        modelSet.add(p.model);
      }
    }
  });

  return Array.from(modelSet);
}

/**
 * Get parts/services for a specific brand and model
 */
export function getPartsForModel(brandName: string, modelName: string): PriceCatalogProduct[] {
  const products = getAllCatalogProducts();
  const normBrand = brandName.toLowerCase();
  const normModel = modelName.toLowerCase();

  return products.filter((p) => {
    const matchBrand = p.brand === 'All' || p.brand.toLowerCase() === normBrand;
    const matchModel = p.model === 'Tous modèles' || p.model.toLowerCase() === normModel || normModel.includes(p.model.toLowerCase()) || p.model.toLowerCase().includes(normModel);

    return matchBrand && matchModel;
  });
}

/**
 * Fast search matching query across brand, model, part type, and category
 * Supports queries like "iPhone 13", "iPhone 15", "Samsung A54", "Redmi Note 13"
 */
export function searchCatalog(query: string): PriceCatalogProduct[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const products = getAllCatalogProducts();
  const terms = clean.split(/\s+/).filter(Boolean);

  return products.filter((item) => {
    const searchableText = `${item.brand} ${item.model} ${item.partTypeAr} ${item.partTypeFr} ${item.categoryNameAr} ${item.categoryNameFr}`.toLowerCase();
    return terms.every((t) => searchableText.includes(t));
  });
}
