import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface UserFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'deleted', label: 'Deleted' },
];

export function UserFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <Input
        name="search"
        label="Search"
        placeholder="Search by email"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select
        name="status"
        label="Status"
        options={STATUS_OPTIONS}
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      />
    </div>
  );
}
