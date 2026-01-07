export type PrizeItem = {
  id: string;
  category: string;
  name: string;
  quantity: number;
};

export type SessionData = {
  id: string;
  name: string;
  prizes: PrizeItem[];
};

export const PRIZE_DATA: SessionData[] = [
  {
    id: "sesi-1",
    name: "Doorprize Sesi 1",
    prizes: [
      { id: "s1-1", category: "Doorprize Sesi 1", name: "Emergency Lamp", quantity: 3 },
      { id: "s1-2", category: "Doorprize Sesi 1", name: "Alat Pel Putar", quantity: 3 },
      { id: "s1-3", category: "Doorprize Sesi 1", name: "Toples Set", quantity: 3 },
      { id: "s1-4", category: "Doorprize Sesi 1", name: "Timbangan Digital", quantity: 3 },
      { id: "s1-5", category: "Doorprize Sesi 1", name: "Setrika Philips", quantity: 3 },
    ],
  },
  {
    id: "sesi-2",
    name: "Doorprize Sesi 2",
    prizes: [
      { id: "s2-1", category: "Doorprize Sesi 2", name: "Rice Cooker Miyako", quantity: 2 },
      { id: "s2-2", category: "Doorprize Sesi 2", name: "Toaster", quantity: 2 },
      { id: "s2-3", category: "Doorprize Sesi 2", name: "Blender Cosmos", quantity: 2 },
      { id: "s2-4", category: "Doorprize Sesi 2", name: "Power Bank Xiaomi", quantity: 3 },
      { id: "s2-5", category: "Doorprize Sesi 2", name: "Air Fryer Mito", quantity: 2 },
    ],
  },
  {
    id: "sesi-3",
    name: "Doorprize Sesi 3",
    prizes: [
      { id: "s3-1", category: "Doorprize Sesi 3", name: "Mesin Cuci Sanken", quantity: 1 },
      { id: "s3-2", category: "Doorprize Sesi 3", name: "Kulkas 1 Pintu Sharp", quantity: 1 },
      { id: "s3-3", category: "Doorprize Sesi 3", name: "Dispenser GEA", quantity: 1 },
    ],
  },
  {
    id: "utama",
    name: "Doorprize Utama",
    prizes: [
      { id: "u-1", category: "Doorprize Utama", name: "Sepeda Polygon", quantity: 1 },
      { id: "u-2", category: "Doorprize Utama", name: "TV Toshiba 43inch", quantity: 1 },
    ],
  },
];
