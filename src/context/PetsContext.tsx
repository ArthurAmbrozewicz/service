import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Pet } from '@/types';
import { pets as initialPets } from '@/data/segmentData';
import { storage } from '@/utils/storage';
import { generateId } from '@/utils/format';

export type PetFormInput = Omit<Pet, 'id'>;

interface PetsContextValue {
  pets: Pet[];
  addPet: (input: PetFormInput) => Pet;
  getPetsByTutor: (tutorId: string) => Pet[];
}

const PetsContext = createContext<PetsContextValue | null>(null);

export function PetsProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>(() => storage.getPets(initialPets));

  useEffect(() => {
    storage.savePets(pets);
  }, [pets]);

  const addPet = useCallback((input: PetFormInput) => {
    const pet: Pet = { ...input, id: generateId('pet') };
    setPets((prev) => [pet, ...prev]);
    return pet;
  }, []);

  const getPetsByTutor = useCallback(
    (tutorId: string) => pets.filter((p) => p.tutorId === tutorId),
    [pets]
  );

  const value = useMemo(
    () => ({ pets, addPet, getPetsByTutor }),
    [pets, addPet, getPetsByTutor]
  );

  return <PetsContext.Provider value={value}>{children}</PetsContext.Provider>;
}

export function usePets(): PetsContextValue {
  const ctx = useContext(PetsContext);
  if (!ctx) throw new Error('usePets deve ser usado dentro de PetsProvider');
  return ctx;
}
