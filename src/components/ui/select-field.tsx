import { useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, type ListRenderItem } from "react-native";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { FieldTrigger } from "@/components/ui/field-trigger";
import {
  SELECT_OPTION_HEIGHT,
  SelectOption,
} from "@/components/ui/select-option";
import { Spacing } from "@/constants/theme";

type SelectFieldProps<T extends string | number> = Readonly<{
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  formatLabel?: (value: T) => string;
  unit?: string;
}>;

export function SelectField<T extends string | number>({
  label,
  value,
  options,
  onChange,
  formatLabel,
  unit,
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<FlatList<T>>(null);

  const toLabel = (item: T) => (formatLabel ? formatLabel(item) : String(item));
  const displayValue = unit ? `${toLabel(value)} ${unit}` : toLabel(value);
  const selectedIndex = useMemo(
    () => Math.max(options.indexOf(value), 0),
    [options, value],
  );

  const renderItem: ListRenderItem<T> = ({ item }) => (
    <SelectOption
      label={toLabel(item)}
      selected={item === value}
      onPress={() => {
        onChange(item);
        setOpen(false);
      }}
    />
  );

  const scrollToSelected = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: false,
        viewPosition: 0.4,
      });
    });
  };

  return (
    <>
      <FieldTrigger
        label={label}
        value={displayValue}
        onPress={() => setOpen(true)}
      />

      <BottomSheet
        visible={open}
        title={label}
        onClose={() => setOpen(false)}
        onShow={scrollToSelected}
        sheetStyle={styles.sheet}
      >
        <FlatList
          ref={listRef}
          data={options as T[]}
          keyExtractor={String}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={selectedIndex}
          getItemLayout={(_, index) => ({
            length: SELECT_OPTION_HEIGHT,
            offset: SELECT_OPTION_HEIGHT * index,
            index,
          })}
          onScrollToIndexFailed={({ index }) => {
            listRef.current?.scrollToOffset({
              offset: SELECT_OPTION_HEIGHT * index,
              animated: false,
            });
          }}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  sheet: {
    maxHeight: "70%",
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
});
