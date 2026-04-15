export interface Product {
  id: string
  name: string
  quantity: number
  unit: string
  category: Category
  price: number
  purchased: boolean
}

export type Category = 'comida' | 'aseo' | 'transporte' | 'hogar' | 'otros'

export interface ShoppingList {
  id: string
  name: string
  emoji: string
  products: Product[]
  createdAt: string
  updatedAt: string
}

export interface User {
  name: string
  email: string
  avatar: string
}

export const categoryConfig: Record<Category, { label: string; color: string; emoji: string }> = {
  comida: { label: 'Comida', color: 'bg-emerald-100 text-emerald-700', emoji: '🥦' },
  aseo: { label: 'Aseo', color: 'bg-blue-100 text-blue-700', emoji: '🧴' },
  transporte: { label: 'Transporte', color: 'bg-amber-100 text-amber-700', emoji: '🚗' },
  hogar: { label: 'Hogar', color: 'bg-purple-100 text-purple-700', emoji: '🏠' },
  otros: { label: 'Otros', color: 'bg-gray-100 text-gray-700', emoji: '📦' },
}

export const mockUser: User = {
  name: 'María González',
  email: 'demo@mercalist.com',
  avatar: 'MG',
}

export const initialShoppingLists: ShoppingList[] = [
  {
    id: '1',
    name: 'Mercado semanal',
    emoji: '🛒',
    createdAt: '2026-04-10',
    updatedAt: '2026-04-14',
    products: [
      { id: '1-1', name: 'Arroz Diana', quantity: 2, unit: 'kg', category: 'comida', price: 8500, purchased: true },
      { id: '1-2', name: 'Aceite Girasol', quantity: 1, unit: 'L', category: 'comida', price: 12000, purchased: true },
      { id: '1-3', name: 'Leche entera', quantity: 6, unit: 'L', category: 'comida', price: 18000, purchased: false },
      { id: '1-4', name: 'Huevos', quantity: 30, unit: 'und', category: 'comida', price: 22000, purchased: false },
      { id: '1-5', name: 'Jabón en polvo', quantity: 1, unit: 'kg', category: 'aseo', price: 15000, purchased: true },
      { id: '1-6', name: 'Papel higiénico', quantity: 12, unit: 'rollos', category: 'aseo', price: 28000, purchased: false },
      { id: '1-7', name: 'Carne molida', quantity: 1, unit: 'kg', category: 'comida', price: 32000, purchased: false },
    ],
  },
  {
    id: '2',
    name: 'Aseo del hogar',
    emoji: '🧹',
    createdAt: '2026-04-08',
    updatedAt: '2026-04-13',
    products: [
      { id: '2-1', name: 'Desinfectante', quantity: 2, unit: 'L', category: 'aseo', price: 14000, purchased: true },
      { id: '2-2', name: 'Escoba', quantity: 1, unit: 'und', category: 'hogar', price: 18000, purchased: false },
      { id: '2-3', name: 'Trapero', quantity: 1, unit: 'und', category: 'hogar', price: 22000, purchased: false },
      { id: '2-4', name: 'Jabón lavaplatos', quantity: 1, unit: 'und', category: 'aseo', price: 8500, purchased: true },
      { id: '2-5', name: 'Esponja multiusos', quantity: 3, unit: 'und', category: 'aseo', price: 6000, purchased: true },
    ],
  },
  {
    id: '3',
    name: 'Frutas y verduras',
    emoji: '🥬',
    createdAt: '2026-04-12',
    updatedAt: '2026-04-15',
    products: [
      { id: '3-1', name: 'Plátano maduro', quantity: 2, unit: 'kg', category: 'comida', price: 4000, purchased: true },
      { id: '3-2', name: 'Tomate chonto', quantity: 1, unit: 'kg', category: 'comida', price: 5500, purchased: true },
      { id: '3-3', name: 'Cebolla cabezona', quantity: 1, unit: 'kg', category: 'comida', price: 4200, purchased: false },
      { id: '3-4', name: 'Papa criolla', quantity: 2, unit: 'kg', category: 'comida', price: 7000, purchased: false },
      { id: '3-5', name: 'Aguacate', quantity: 3, unit: 'und', category: 'comida', price: 9000, purchased: true },
      { id: '3-6', name: 'Limón Tahití', quantity: 12, unit: 'und', category: 'comida', price: 3600, purchased: false },
    ],
  },
  {
    id: '4',
    name: 'Gastos del carro',
    emoji: '🚗',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-10',
    products: [
      { id: '4-1', name: 'Gasolina', quantity: 40, unit: 'L', category: 'transporte', price: 180000, purchased: true },
      { id: '4-2', name: 'Lavado completo', quantity: 1, unit: 'servicio', category: 'transporte', price: 35000, purchased: true },
      { id: '4-3', name: 'Aceite motor', quantity: 4, unit: 'L', category: 'transporte', price: 120000, purchased: false },
      { id: '4-4', name: 'Líquido frenos', quantity: 1, unit: 'L', category: 'transporte', price: 25000, purchased: false },
      { id: '4-5', name: 'Ambientador', quantity: 2, unit: 'und', category: 'otros', price: 12000, purchased: true },
    ],
  },
]

export const monthlySpendData = [
  { month: 'Nov', amount: 485000 },
  { month: 'Dic', amount: 620000 },
  { month: 'Ene', amount: 510000 },
  { month: 'Feb', amount: 445000 },
  { month: 'Mar', amount: 530000 },
  { month: 'Abr', amount: 380000 },
]

export const categorySpendData = [
  { category: 'Comida', amount: 245000, fill: 'var(--chart-1)' },
  { category: 'Aseo', amount: 72000, fill: 'var(--chart-2)' },
  { category: 'Transporte', amount: 360000, fill: 'var(--chart-3)' },
  { category: 'Hogar', amount: 40000, fill: 'var(--chart-4)' },
  { category: 'Otros', amount: 12000, fill: 'var(--chart-5)' },
]

export const formatCOP = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
