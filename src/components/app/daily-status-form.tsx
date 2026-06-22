import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

interface DailyStatusFormProps {
  logDate: string;
  initialBleedingStatus?: string;
  initialPainLevel?: number;
  initialMood?: string;
  initialEnergyLevel?: number;
  initialNotes?: string;
  errors?: Record<string, string>;
  onSubmit: (data: {
    logDate: string;
    bleedingStatus?: string;
    painLevel?: number;
    mood?: string;
    energyLevel?: number;
    notes?: string;
  }) => Promise<void> | void;
  onCancel: () => void;
}

const BLEEDING_OPTIONS = [
  { value: '', label: 'Select bleeding status' },
  { value: 'spotting', label: 'Spotting' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
];

export function DailyStatusForm({
  logDate,
  initialBleedingStatus = '',
  initialPainLevel,
  initialMood = '',
  initialEnergyLevel,
  initialNotes = '',
  errors,
  onSubmit,
  onCancel,
}: DailyStatusFormProps) {
  const [bleedingStatus, setBleedingStatus] = useState(initialBleedingStatus);
  const [painLevel, setPainLevel] = useState(initialPainLevel?.toString() ?? '');
  const [mood, setMood] = useState(initialMood);
  const [energyLevel, setEnergyLevel] = useState(initialEnergyLevel?.toString() ?? '');
  const [notes, setNotes] = useState(initialNotes);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        logDate,
        bleedingStatus: bleedingStatus || undefined,
        painLevel: painLevel ? Number(painLevel) : undefined,
        mood: mood || undefined,
        energyLevel: energyLevel ? Number(energyLevel) : undefined,
        notes: notes || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input type="date" name="logDate" label="Date" required value={logDate} readOnly />
      <Select
        name="bleedingStatus"
        label="Bleeding status"
        options={BLEEDING_OPTIONS}
        value={bleedingStatus}
        onChange={(e) => setBleedingStatus(e.target.value)}
      />
      <Input
        type="number"
        name="painLevel"
        label="Pain level (0–10)"
        min={0}
        max={10}
        value={painLevel}
        onChange={(e) => setPainLevel(e.target.value)}
        error={errors?.painLevel}
      />
      <Input
        type="text"
        name="mood"
        label="Mood"
        maxLength={40}
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      />
      <Input
        type="number"
        name="energyLevel"
        label="Energy level (0–10)"
        min={0}
        max={10}
        value={energyLevel}
        onChange={(e) => setEnergyLevel(e.target.value)}
      />
      <Textarea
        name="notes"
        label="Notes (optional)"
        maxLength={500}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          Save
        </Button>
      </div>
    </form>
  );
}
