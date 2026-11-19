import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { FormMessage } from "@/components/ui/form/form-message";
import { SelectField } from "@/components/ui/select-field";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import {
  createBirthDayOptions,
  createBirthYearOptions,
  splitBirthDate,
  toBirthDateKey,
} from "@/utils/birth-date";

import { MONTH_LABELS, MONTH_OPTIONS } from "./config";

type BirthDateFieldProps = Readonly<{
  value: string;
  onChange: (dateKey: string) => void;
  error?: string;
}>;

export function BirthDateField({
  value,
  onChange,
  error,
}: BirthDateFieldProps) {
  const { year, month, day } = splitBirthDate(value);
  const yearOptions = useMemo(() => createBirthYearOptions(), []);
  const dayOptions = useMemo(
    () => createBirthDayOptions(year, month),
    [month, year],
  );

  return (
    <View style={styles.container}>
      <Text type="label" themeColor="textSecondary">
        Birth date
      </Text>

      <View style={styles.row}>
        <View style={styles.month}>
          <SelectField
            label="Month"
            value={month}
            options={MONTH_OPTIONS}
            onChange={(nextMonth) =>
              onChange(toBirthDateKey(year, nextMonth, day))
            }
            formatLabel={(item) => MONTH_LABELS[item - 1]}
          />
        </View>
        <View style={styles.day}>
          <SelectField
            label="Day"
            value={Math.min(day, dayOptions.length)}
            options={dayOptions}
            onChange={(nextDay) =>
              onChange(toBirthDateKey(year, month, nextDay))
            }
          />
        </View>
        <View style={styles.year}>
          <SelectField
            label="Year"
            value={year}
            options={yearOptions}
            onChange={(nextYear) =>
              onChange(toBirthDateKey(nextYear, month, day))
            }
          />
        </View>
      </View>

      {error ? <FormMessage>{error}</FormMessage> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  month: {
    flex: 1.4,
  },
  day: {
    flex: 0.8,
  },
  year: {
    flex: 1,
  },
});
