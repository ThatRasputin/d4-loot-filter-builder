// Sourced from d4lfteam/d4lf, commit d2d9e9f6860e20c41936dbf06358e15a906a6ba7,
// assets/lang/enUS/item_types.json, restricted to the gear slots the real in-game
// "Select Item Type(s)" picker covers (issue #9): Weapons / Armor / Jewelry / Talisman.
//
// KNOWN GAP: the source has no Talisman subtypes at all (Talismans are a newer item
// class than this data pull covers) — no 'talisman' entries exist below yet. Consumable
// / currency / crafting types from the source (Elixir, Incense, Material, Sigil,
// TemperManual, Tome) are intentionally excluded — they aren't part of Item Type Match.
export type ItemTypeCategory = 'weapon' | 'armor' | 'jewelry' | 'talisman'

export interface ItemTypePoolEntry {
  id: string
  displayName: string
  category: ItemTypeCategory
}

export const ITEM_TYPE_POOL: ItemTypePoolEntry[] = [
  { id: 'Amulet', displayName: 'amulet', category: 'jewelry' },
  { id: 'Axe', displayName: 'axe', category: 'weapon' },
  { id: 'Axe2H', displayName: 'two-handed axe', category: 'weapon' },
  { id: 'Boots', displayName: 'boots', category: 'armor' },
  { id: 'Bow', displayName: 'bow', category: 'weapon' },
  { id: 'ChestArmor', displayName: 'chest armor', category: 'armor' },
  { id: 'Crossbow2H', displayName: 'crossbow', category: 'weapon' },
  { id: 'Dagger', displayName: 'dagger', category: 'weapon' },
  { id: 'Flail', displayName: 'flail', category: 'weapon' },
  { id: 'Focus', displayName: 'focus', category: 'weapon' },
  { id: 'Glaive', displayName: 'glaive', category: 'weapon' },
  { id: 'Gloves', displayName: 'gloves', category: 'armor' },
  { id: 'Helm', displayName: 'helm', category: 'armor' },
  { id: 'Legs', displayName: 'pants', category: 'armor' },
  { id: 'Mace', displayName: 'mace', category: 'weapon' },
  { id: 'Mace2H', displayName: 'two-handed mace', category: 'weapon' },
  { id: 'OffHandTotem', displayName: 'totem', category: 'weapon' },
  { id: 'Polearm', displayName: 'polearm', category: 'weapon' },
  { id: 'Quarterstaff', displayName: 'quarterstaff', category: 'weapon' },
  { id: 'Ring', displayName: 'ring', category: 'jewelry' },
  { id: 'Scythe', displayName: 'scythe', category: 'weapon' },
  { id: 'Scythe2H', displayName: 'two-handed scythe', category: 'weapon' },
  { id: 'Shield', displayName: 'shield', category: 'weapon' },
  { id: 'Staff', displayName: 'staff', category: 'weapon' },
  { id: 'Sword', displayName: 'sword', category: 'weapon' },
  { id: 'Sword2H', displayName: 'two-handed sword', category: 'weapon' },
  { id: 'Wand', displayName: 'wand', category: 'weapon' },
]
