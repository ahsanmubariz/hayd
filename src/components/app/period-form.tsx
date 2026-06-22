import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

interface PeriodFormProps {
  initialStartDate?: string;
  initialEndDate?: string;
  initialFlowIntensity?: string;
  initialNotes?: string;
  errors?: Record<string, string>;
  onSubmit: (data: {
    startDate: string;
    endDate: string;
    flowIntensity?: string;
    notes?: string;
  }) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
}

const FLOW_OPTIONS = [
  { value: '', label: 'Select intensity' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
];

export function PeriodForm({
  initialStartDate = '',
  initialEndDate = '',
  initialFlowIntensity = '',
  initialNotes = '',
  errors,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: PeriodFormProps) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [flowIntensity, setFlowIntensity] = useState(initialFlowIntensity);
  const [notes, setNotes] = useState(initialNotes);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        startDate,
        endDate,
        flowIntensity: flowIntensity || undefined,
        notes: notes || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="date"
        name="startDate"
        label="Start date"
        required
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        error={errors?.startDate}
      />
      <Input
        type="date"
        name="endDate"
        label="End date"
        required
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        error={errors?.endDate}
      />
      <Select
        name="flowIntensity"
        label="Flow intensity"
        options={FLOW_OPTIONS}
        value={flowIntensity}
        onChange={(e) => setFlowIntensity(e.target.value)}
      />
      <Textarea
        name="notes"
        label="Notes (optional)"
        maxLength={500}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        error={errors?.notes}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
