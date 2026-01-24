import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Polygon, G, Text as SvgText, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors } from '@/src/constants/theme';

interface CompassDisplayProps {
  heading: number;
  windDirection: number;
  windSpeed: number;
  isLocked?: boolean;
}

export function CompassDisplay({ heading, windDirection, windSpeed, isLocked = false }: CompassDisplayProps) {
  const size = 320;
  const center = size / 2;
  const outerRadius = 140;
  const innerRadius = 50;
  const tickRadius = 125;
  const ringColor = isLocked ? colors.primary : colors.border;

  const cardinalPoints = [
    { label: 'N', angle: 0, cardinal: true },
    { label: 'NE', angle: 45, cardinal: false },
    { label: 'E', angle: 90, cardinal: true },
    { label: 'SE', angle: 135, cardinal: false },
    { label: 'S', angle: 180, cardinal: true },
    { label: 'SW', angle: 225, cardinal: false },
    { label: 'W', angle: 270, cardinal: true },
    { label: 'NW', angle: 315, cardinal: false },
  ];

  const getPoint = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  const windAngle = windDirection - heading;

  const windStart = getPoint(windAngle, innerRadius + 5);
  const windEnd = getPoint(windAngle, outerRadius - 20);

  const arrowSize = 18;
  const arrowAngle = ((windAngle - 90) * Math.PI) / 180;
  const arrowTipX = windEnd.x;
  const arrowTipY = windEnd.y;

  const arrowLeft = {
    x: arrowTipX - arrowSize * Math.cos(arrowAngle - Math.PI / 5),
    y: arrowTipY - arrowSize * Math.sin(arrowAngle - Math.PI / 5),
  };
  const arrowRight = {
    x: arrowTipX - arrowSize * Math.cos(arrowAngle + Math.PI / 5),
    y: arrowTipY - arrowSize * Math.sin(arrowAngle + Math.PI / 5),
  };

  const getTicks = () => {
    const ticks = [];
    for (let i = 0; i < 72; i++) {
      const angle = i * 5;
      const isMajor = i % 9 === 0;
      const isMinor = i % 3 === 0;

      const startRadius = isMajor ? tickRadius - 12 : isMinor ? tickRadius - 6 : tickRadius - 3;
      const start = getPoint(angle, startRadius);
      const end = getPoint(angle, tickRadius);

      ticks.push(
        <Line
          key={i}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={isMajor ? colors.border : colors.textMuted}
          strokeWidth={isMajor ? 2 : 1}
          opacity={isMajor ? 0.8 : 0.4}
        />
      );
    }
    return ticks;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="centerGradient" cx="50%" cy="50%">
            <Stop offset="0%" stopColor={colors.surfaceElevated} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.surface} stopOpacity="1" />
          </RadialGradient>
        </Defs>

        <Circle
          cx={center}
          cy={center}
          r={outerRadius + 5}
          fill="transparent"
          stroke={ringColor}
          strokeWidth={isLocked ? 2 : 1}
          opacity={isLocked ? 0.6 : 0.3}
        />

        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill={colors.background}
          stroke={ringColor}
          strokeWidth={3}
          opacity={0.9}
        />

        {getTicks()}

        {cardinalPoints.map((point) => {
          const pos = getPoint(point.angle, outerRadius + 28);
          const isNorth = point.label === 'N';
          const isCardinal = point.cardinal;
          return (
            <SvgText
              key={point.label}
              x={pos.x}
              y={pos.y}
              fontSize={isNorth ? 24 : isCardinal ? 18 : 14}
              fontWeight={isNorth ? '700' : isCardinal ? '600' : '500'}
              fill={isNorth ? colors.primary : isCardinal ? colors.text : colors.textSecondary}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {point.label}
            </SvgText>
          );
        })}

        <G opacity={0.2}>
          <Line
            x1={windStart.x}
            y1={windStart.y}
            x2={windEnd.x}
            y2={windEnd.y}
            stroke={colors.accent}
            strokeWidth={12}
            strokeLinecap="round"
          />
        </G>

        <G>
          <Line
            x1={windStart.x}
            y1={windStart.y}
            x2={windEnd.x}
            y2={windEnd.y}
            stroke={colors.accent}
            strokeWidth={6}
            strokeLinecap="round"
          />

          <Polygon
            points={`${arrowTipX},${arrowTipY} ${arrowLeft.x},${arrowLeft.y} ${arrowRight.x},${arrowRight.y}`}
            fill={colors.accent}
            stroke={colors.accent}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </G>

        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="url(#centerGradient)"
          stroke={colors.border}
          strokeWidth={2}
        />

        <SvgText
          x={center}
          y={center - 8}
          fontSize={20}
          fontWeight="700"
          fill={colors.accent}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {Math.round(windSpeed)}
        </SvgText>
        <SvgText
          x={center}
          y={center + 12}
          fontSize={11}
          fontWeight="600"
          fill={colors.textSecondary}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          MPH
        </SvgText>
      </Svg>

      <View style={styles.headingContainer}>
        <Text style={styles.headingValue}>{Math.round(heading)}°</Text>
        <Text style={[styles.headingLabel, isLocked && styles.headingLabelLocked]}>
          {isLocked ? 'Target Locked' : 'Your Heading'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  headingValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  headingLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headingLabelLocked: {
    color: colors.primary,
    fontWeight: '600',
  },
});
