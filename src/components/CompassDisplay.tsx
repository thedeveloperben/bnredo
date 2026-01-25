import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Polygon, G, Text as SvgText, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
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

  const windStart = getPoint(windAngle, outerRadius - 5);
  const windEnd = getPoint(windAngle, innerRadius + 15);

  const arrowSize = 16;
  const arrowAngle = ((windAngle - 90) * Math.PI) / 180;
  const arrowTipX = windEnd.x;
  const arrowTipY = windEnd.y;

  const arrowLeft = {
    x: arrowTipX + arrowSize * Math.cos(arrowAngle - Math.PI / 5),
    y: arrowTipY + arrowSize * Math.sin(arrowAngle - Math.PI / 5),
  };
  const arrowRight = {
    x: arrowTipX + arrowSize * Math.cos(arrowAngle + Math.PI / 5),
    y: arrowTipY + arrowSize * Math.sin(arrowAngle + Math.PI / 5),
  };

  const userHeadingAngle = 0;
  const userArrowTip = getPoint(userHeadingAngle, outerRadius - 15);
  const userArrowBase = getPoint(userHeadingAngle, innerRadius + 20);
  const userArrowSize = 14;
  const userArrowAngleRad = ((userHeadingAngle - 90) * Math.PI) / 180;
  const userArrowLeft = {
    x: userArrowTip.x - userArrowSize * Math.cos(userArrowAngleRad - Math.PI / 6),
    y: userArrowTip.y - userArrowSize * Math.sin(userArrowAngleRad - Math.PI / 6),
  };
  const userArrowRight = {
    x: userArrowTip.x - userArrowSize * Math.cos(userArrowAngleRad + Math.PI / 6),
    y: userArrowTip.y - userArrowSize * Math.sin(userArrowAngleRad + Math.PI / 6),
  };

  const getTicks = () => {
    const ticks = [];
    for (let i = 0; i < 72; i++) {
      const angle = i * 5;
      const isMajor = i % 9 === 0;
      const isMinor = i % 3 === 0;

      const startRadius = isMajor ? tickRadius - 14 : isMinor ? tickRadius - 8 : tickRadius - 4;
      const start = getPoint(angle, startRadius);
      const end = getPoint(angle, tickRadius);

      ticks.push(
        <Line
          key={i}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={isMajor ? colors.textSecondary : colors.textMuted}
          strokeWidth={isMajor ? 2.5 : 1}
          opacity={isMajor ? 0.9 : 0.5}
        />
      );
    }
    return ticks;
  };

  const getCardinalBackground = (angle: number, isCardinal: boolean) => {
    if (!isCardinal) return null;
    const pos = getPoint(angle, outerRadius + 28);
    return (
      <Circle
        cx={pos.x}
        cy={pos.y}
        r={16}
        fill={colors.surfaceElevated}
        stroke={colors.border}
        strokeWidth={1}
        opacity={0.8}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="centerGradient" cx="50%" cy="50%">
            <Stop offset="0%" stopColor={colors.surfaceElevated} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.surface} stopOpacity="1" />
          </RadialGradient>
          <RadialGradient id="compassGradient" cx="50%" cy="50%">
            <Stop offset="0%" stopColor={colors.surface} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.background} stopOpacity="1" />
          </RadialGradient>
        </Defs>

        <Circle
          cx={center}
          cy={center}
          r={outerRadius + 8}
          fill="transparent"
          stroke={ringColor}
          strokeWidth={isLocked ? 3 : 1.5}
          opacity={isLocked ? 0.7 : 0.4}
        />

        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="url(#compassGradient)"
          stroke={ringColor}
          strokeWidth={3}
          opacity={0.95}
        />

        {getTicks()}

        {cardinalPoints.map((point) => getCardinalBackground(point.angle, point.cardinal))}

        {cardinalPoints.map((point) => {
          const pos = getPoint(point.angle, outerRadius + 28);
          const isNorth = point.label === 'N';
          const isCardinal = point.cardinal;
          return (
            <SvgText
              key={point.label}
              x={pos.x}
              y={pos.y}
              fontSize={isNorth ? 22 : isCardinal ? 16 : 12}
              fontWeight={isNorth ? '800' : isCardinal ? '700' : '500'}
              fill={isNorth ? colors.error : isCardinal ? colors.text : colors.textMuted}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {point.label}
            </SvgText>
          );
        })}

        <G opacity={0.15}>
          <Line
            x1={windStart.x}
            y1={windStart.y}
            x2={windEnd.x}
            y2={windEnd.y}
            stroke={colors.accent}
            strokeWidth={16}
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
            strokeWidth={7}
            strokeLinecap="round"
          />

          <Polygon
            points={`${arrowTipX},${arrowTipY} ${arrowLeft.x},${arrowLeft.y} ${arrowRight.x},${arrowRight.y}`}
            fill={colors.accent}
            stroke={colors.accent}
            strokeWidth={2}
            strokeLinejoin="round"
          />

          <Circle
            cx={windStart.x}
            cy={windStart.y}
            r={8}
            fill={colors.accent}
            stroke={colors.background}
            strokeWidth={2}
          />
        </G>

        <G opacity={0.2}>
          <Line
            x1={userArrowBase.x}
            y1={userArrowBase.y}
            x2={userArrowTip.x}
            y2={userArrowTip.y}
            stroke={colors.primary}
            strokeWidth={10}
            strokeLinecap="round"
          />
        </G>

        <G>
          <Line
            x1={userArrowBase.x}
            y1={userArrowBase.y}
            x2={userArrowTip.x}
            y2={userArrowTip.y}
            stroke={colors.primary}
            strokeWidth={5}
            strokeLinecap="round"
          />

          <Polygon
            points={`${userArrowTip.x},${userArrowTip.y} ${userArrowLeft.x},${userArrowLeft.y} ${userArrowRight.x},${userArrowRight.y}`}
            fill={colors.primary}
            stroke={colors.primary}
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
          fontSize={22}
          fontWeight="700"
          fill={colors.accent}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {Math.round(windSpeed)}
        </SvgText>
        <SvgText
          x={center}
          y={center + 14}
          fontSize={10}
          fontWeight="600"
          fill={colors.textSecondary}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          MPH
        </SvgText>
      </Svg>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Your Heading</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
          <Text style={styles.legendText}>Wind Direction</Text>
        </View>
      </View>

      <View style={styles.headingContainer}>
        <Text style={styles.headingValue}>{Math.round(heading)}°</Text>
        <Text style={[styles.headingLabel, isLocked && styles.headingLabelLocked]}>
          {isLocked ? 'Target Locked' : 'Facing Direction'}
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
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  headingContainer: {
    marginTop: 12,
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
