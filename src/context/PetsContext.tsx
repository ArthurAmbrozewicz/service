import { useCallback } from 'react';
import type { Pet } from '@/types';
import { useDados } from '@/context/DadosContext';

export type PetFormInput = Omit<Pet, 'id'>;

/** Pets gravados na tabela pets. O cadastro passa por adicionarPet. */
export function usePets() {
  const { pets, adicionarPet } = useDados();

  const getPetsByTutor = useCallback(
    (tutorId: string) => pets.filter((pet) => pet.tutorId === tutorId),
    [pets]
  );

  return { pets, addPet: adicionarPet, getPetsByTutor };
}
