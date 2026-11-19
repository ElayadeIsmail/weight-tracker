import { useMemo } from "react";

import { SelectField } from "@/components/ui/select-field";
import {
  formatLongDate,
  shiftDateKey,
  toDateKey,
} from "@/utils/date";

type DateFieldProps = Readonly<{
  label?: string;
  value: string;
  onChange: (dateKey: string) => void;
  maximumDate?: Date;
  minimumDate?: Date;
}>;

function createDateOptions(minimumDate?: Date, maximumDate = new Date()) {
  const maxKey = toDateKey(maximumDate);
  const minKey = minimumDate
    ? toDateKey(minimumDate)
    : shiftDateKey(maxKey, -365);

  const options: string[] = [];
  let cursor = maxKey;

  while (cursor >= minKey) {
    options.push(cursor);
    cursor = shiftDateKey(cursor, -1);
  }

  return options;
}

export function DateField({
  label = "Date",
  value,
  onChange,
  maximumDate = new Date(),
  minimumDate,
}: DateFieldProps) {
  const options = useMemo(
    () => createDateOptions(minimumDate, maximumDate),
    [minimumDate, maximumDate],
  );

  return (
    <SelectField
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      formatLabel={formatLongDate}
    />
  );
}
