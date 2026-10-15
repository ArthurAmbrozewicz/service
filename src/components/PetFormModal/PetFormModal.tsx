import { useEffect, useState } from 'react';
import type { Customer, Pet } from '@/types';
import { Modal } from '@/components/Modal/Modal';
import { Input } from '@/components/Input/Input';
import { Select } from '@/components/Select/Select';
import { Textarea } from '@/components/Textarea/Textarea';
import { Button } from '@/components/Button/Button';
import { usePets, type PetFormInput } from '@/context/PetsContext';
import { getTodayISO } from '@/utils/format';

interface PetFormModalProps {
  open: boolean;
  onClose: () => void;
  tutors: Customer[];
  /** Quando definido, o tutor fica fixo (cadastro a partir da ficha do tutor). */
  lockedTutor?: Pick<Customer, 'id' | 'name'> | null;
  onCreated?: (pet: Pet) => void;
}

const emptyForm = {
  name: '',
  tutorId: '',
  species: 'Cão',
  breed: '',
  birthDate: '2022-01-01',
  sex: 'macho' as Pet['sex'],
  weight: 5,
  notes: '',
  vaccinationStatus: 'nao_informado' as Pet['vaccinationStatus'],
};

/** Formulário reutilizável de cadastro de pet — usado na Ficha do Pet e na ficha do tutor. */
export function PetFormModal({ open, onClose, tutors, lockedTutor, onCreated }: PetFormModalProps) {
  const { addPet } = usePets();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm({
      ...emptyForm,
      tutorId: lockedTutor?.id ?? '',
    });
    setError('');
  }, [open, lockedTutor?.id]);

  const handleClose = () => {
    setForm(emptyForm);
    setError('');
    onClose();
  };

  const save = async () => {
    const tutorId = lockedTutor?.id ?? form.tutorId;
    const tutor = lockedTutor
      ? { id: lockedTutor.id, name: lockedTutor.name }
      : tutors.find((t) => t.id === tutorId);

    if (!form.name.trim()) {
      setError('Informe o nome do pet.');
      return;
    }
    if (!tutor) {
      setError('Selecione o tutor.');
      return;
    }

    const input: PetFormInput = {
      name: form.name.trim(),
      tutorId: tutor.id,
      tutorName: tutor.name,
      species: form.species,
      breed: form.breed.trim() || 'SRD',
      birthDate: form.birthDate || getTodayISO(),
      sex: form.sex,
      weight: Number(form.weight) || 0,
      notes: form.notes.trim(),
      vaccinationStatus: form.vaccinationStatus,
    };

    const pet = await addPet(input);
    onCreated?.(pet);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Cadastrar pet"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
          <Button onClick={save}>Salvar pet</Button>
        </>
      }
    >
      <div className="form-grid form-grid-2">
        <Input
          label="Nome do pet"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ex.: Luna"
        />

        {lockedTutor ? (
          <Input label="Tutor" value={lockedTutor.name} disabled readOnly />
        ) : (
          <Select
            label="Tutor"
            value={form.tutorId}
            onChange={(e) => setForm({ ...form, tutorId: e.target.value })}
          >
            <option value="">Selecione...</option>
            {tutors.filter((t) => t.status === 'ativo').map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
        )}

        <Select
          label="Espécie"
          value={form.species}
          onChange={(e) => setForm({ ...form, species: e.target.value })}
        >
          <option value="Cão">Cão</option>
          <option value="Gato">Gato</option>
          <option value="Ave">Ave</option>
          <option value="Outro">Outro</option>
        </Select>

        <Input
          label="Raça"
          value={form.breed}
          onChange={(e) => setForm({ ...form, breed: e.target.value })}
          placeholder="Ex.: Poodle"
        />

        <Input
          label="Data de nascimento"
          type="date"
          value={form.birthDate}
          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
        />

        <Select
          label="Sexo"
          value={form.sex}
          onChange={(e) => setForm({ ...form, sex: e.target.value as Pet['sex'] })}
        >
          <option value="macho">Macho</option>
          <option value="femea">Fêmea</option>
        </Select>

        <Input
          label="Peso (kg)"
          type="number"
          min={0}
          step={0.1}
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
        />

        <Select
          label="Status da vacinação"
          value={form.vaccinationStatus}
          onChange={(e) =>
            setForm({
              ...form,
              vaccinationStatus: e.target.value as Pet['vaccinationStatus'],
            })
          }
        >
          <option value="em_dia">Em dia</option>
          <option value="atrasada">Atrasada</option>
          <option value="nao_informado">Não informado</option>
        </Select>

        <Textarea
          label="Observações"
          className="span-2"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        {error && <p className="form-error span-2">{error}</p>}
      </div>
    </Modal>
  );
}
