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
    name: "Sesi 1",
    prizes: [
      {
        id: "s1-1",
        category: "Sesi 1",
        name: "Emergency Lamp",
        quantity: 3,
      },
      {
        id: "s1-2",
        category: "Sesi 1",
        name: "Alat Pel Putar",
        quantity: 3,
      },
      {
        id: "s1-3",
        category: "Sesi 1",
        name: "Toples Set",
        quantity: 3,
      },
      {
        id: "s1-4",
        category: "Sesi 1",
        name: "Timbangan Digital",
        quantity: 3,
      },
      {
        id: "s1-5",
        category: "Sesi 1",
        name: "Setrika Philips",
        quantity: 3,
      },
    ],
  },
  {
    id: "sesi-2",
    name: "Sesi 2",
    prizes: [
      {
        id: "s2-1",
        category: "Sesi 2",
        name: "Rice Cooker Miyako",
        quantity: 2,
      },
      {
        id: "s2-2",
        category: "Sesi 2",
        name: "Toaster",
        quantity: 2,
      },
      {
        id: "s2-3",
        category: "Sesi 2",
        name: "Blender Cosmos",
        quantity: 2,
      },
      {
        id: "s2-4",
        category: "Sesi 2",
        name: "Power Bank Xiaomi",
        quantity: 3,
      },
      {
        id: "s2-5",
        category: "Sesi 2",
        name: "Air Fryer Mito",
        quantity: 2,
      },
    ],
  },
  {
    id: "grand-1",
    name: "Grand 5",
    prizes: [
      {
        id: "g1-1",
        category: "Grand 5",
        name: "Mesin Cuci Sanken",
        quantity: 1,
      },
    ],
  },
  {
    id: "grand-2",
    name: "Grand 4",
    prizes: [
      {
        id: "g2-1",
        category: "Grand 4",
        name: "Kulkas 1 Pintu Sharp",
        quantity: 1,
      },
    ],
  },
  {
    id: "grand-3",
    name: "Grand 3",
    prizes: [
      {
        id: "g3-1",
        category: "Grand 3",
        name: "Dispenser GEA",
        quantity: 1,
      },
    ],
  },
  {
    id: "super-1",
    name: "Grand 2",
    prizes: [
      {
        id: "sg1-1",
        category: "Grand 2",
        name: "Sepeda Polygon",
        quantity: 1,
      },
    ],
  },
  {
    id: "super-2",
    name: "Grand 1",
    prizes: [
      {
        id: "sg2-1",
        category: "Grand 1",
        name: "TV Toshiba 43inch",
        quantity: 1,
      },
    ],
  },
];
