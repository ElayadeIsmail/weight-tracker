import { StyleSheet, View, type DimensionValue } from "react-native";

import { Text } from "@/components/ui/text";
import { Radius } from "@/constants/theme";
import { useResolvedColorScheme, useTheme } from "@/hooks/use-theme";
import { BMI_SEGMENTS, getBmiScalePosition } from "@/utils/bmi";

type BmiScaleBarProps = Readonly<{
  value: number;
}>;

export function BmiScaleBar({ value }: BmiScaleBarProps) {
  const theme = useTheme();
  const resolvedScheme = useResolvedColorScheme();
  const markerLeft: DimensionValue = `${getBmiScalePosition(value) * 100}%`;

  return (
    <>
      <View style={styles.scaleWrap}>
        <View style={styles.segments}>
          {BMI_SEGMENTS.map((segment) => (
            <View
              key={segment.category}
              style={[
                styles.segment,
                {
                  flex: segment.flex,
                  backgroundColor:
                    resolvedScheme === "dark"
                      ? segment.colorDark
                      : segment.colorLight,
                },
              ]}
            />
          ))}
        </View>
        <View
          style={[
            styles.marker,
            { left: markerLeft, borderColor: theme.background },
          ]}
        />
      </View>

      <View style={styles.labels}>
        {BMI_SEGMENTS.map((segment) => (
          <Text
            key={segment.category}
            type="small"
            themeColor="textSecondary"
            style={[styles.segmentLabel, { flex: segment.flex }]}
          >
            {segment.label}
          </Text>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scaleWrap: {
    position: "relative",
    justifyContent: "center",
  },
  segments: {
    flexDirection: "row",
    height: 12,
    borderRadius: Radius.full,
    overflow: "hidden",
    gap: 2,
  },
  segment: {
    height: "100%",
  },
  marker: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    marginLeft: -8,
  },
  labels: {
    flexDirection: "row",
    gap: 2,
  },
  segmentLabel: {
    textAlign: "center",
    fontSize: 11,
  },
});
