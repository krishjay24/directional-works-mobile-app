import { Ionicons } from '@expo/vector-icons';
import { NavigationBar } from 'expo-navigation-bar';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo, Animated, Modal, PanResponder, Pressable, StatusBar, StyleSheet,
  Text, useWindowDimensions, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Painting } from '../data/paintings';
import { darkColors as colors, radii, spacing, touchTargets } from '../theme/colors';

type Point = { pageX: number; pageY: number };
const distance = (a: Point, b: Point) => Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));

export function ArtworkViewer({
  painting, visible, rotation, onRotate, onClose,
}: {
  painting: Painting; visible: boolean; rotation: number; onRotate: () => void; onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const viewport = useRef({ width, height });
  viewport.current = { width, height };
  const scale = useRef(new Animated.Value(1)).current;
  const offset = useRef(new Animated.ValueXY()).current;
  const zoom = useRef(1);
  const position = useRef({ x: 0, y: 0 });
  const start = useRef({ x: 0, y: 0 });
  const touchStart = useRef<Point | null>(null);
  const pinchStart = useRef(0);
  const pinchZoom = useRef(1);
  const lastTap = useRef(0);
  const moved = useRef(false);
  const [controls, setControls] = useState(true);
  const [zoomLabel, setZoomLabel] = useState(1);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  const setScale = (next: number) => {
    zoom.current = clamp(next, 1, 5);
    scale.setValue(zoom.current);
    setZoomLabel(Math.round(zoom.current * 10) / 10);
    if (zoom.current === 1) {
      position.current = { x: 0, y: 0 };
      offset.setValue(position.current);
    }
  };

  const reset = () => {
    setScale(1);
    setControls(true);
  };

  useEffect(() => {
    if (!visible) reset();
  }, [visible, painting.id]);

  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      const touches = event.nativeEvent.touches;
      moved.current = false;
      start.current = { ...position.current };
      touchStart.current = touches[0] ?? null;
      pinchStart.current = touches.length >= 2 ? distance(touches[0], touches[1]) : 0;
      pinchZoom.current = zoom.current;
    },
    onPanResponderMove: (event) => {
      const touches = event.nativeEvent.touches;
      if (touches.length >= 2) {
        const current = distance(touches[0], touches[1]);
        if (!pinchStart.current) {
          pinchStart.current = current;
          pinchZoom.current = zoom.current;
        } else {
          setScale(pinchZoom.current * current / pinchStart.current);
          moved.current = true;
        }
        touchStart.current = null;
      } else if (touches.length === 1 && zoom.current > 1) {
        pinchStart.current = 0;
        if (!touchStart.current) {
          touchStart.current = touches[0];
          start.current = { ...position.current };
        }
        const dx = touches[0].pageX - touchStart.current.pageX;
        const dy = touches[0].pageY - touchStart.current.pageY;
        if (Math.abs(dx) + Math.abs(dy) > 4) moved.current = true;
        const maxX = viewport.current.width * (zoom.current - 1) / 2;
        const maxY = viewport.current.height * (zoom.current - 1) / 2;
        position.current = {
          x: clamp(start.current.x + dx, -maxX, maxX),
          y: clamp(start.current.y + dy, -maxY, maxY),
        };
        offset.setValue(position.current);
      }
    },
    onPanResponderRelease: () => {
      pinchStart.current = 0;
      touchStart.current = null;
      if (moved.current) return;
      const now = Date.now();
      if (now - lastTap.current < 300) {
        setScale(zoom.current > 1 ? 1 : 2);
        lastTap.current = 0;
      } else {
        setControls((value) => !value);
        lastTap.current = now;
      }
    },
    onPanResponderTerminate: () => { pinchStart.current = 0; touchStart.current = null; },
  })).current;

  return (
    <Modal visible={visible} animationType={reduceMotion ? 'none' : 'fade'} onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <View style={styles.modal}>
        <StatusBar barStyle="light-content" />
        <NavigationBar style="dark" />
        <View style={styles.canvas} {...responder.panHandlers} accessibilityLabel={`Fullscreen ${painting.title}. Pinch or double tap to zoom.`}>
          <Animated.Image
            source={painting.image}
            resizeMode="contain"
            style={[styles.art, {
              transform: [{ translateX: offset.x }, { translateY: offset.y }, { scale }, { rotate: `${rotation}deg` }],
            }]}
          />
        </View>
        {controls && <>
          <View style={[styles.top, { top: insets.top + spacing.lg }]}>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close fullscreen viewer" style={styles.control}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.title} numberOfLines={1}>{painting.title}</Text>
          </View>
          <View style={[styles.bottom, { bottom: insets.bottom + spacing.lg }]}>
            <Pressable onPress={onRotate} accessibilityRole="button" accessibilityLabel="Rotate artwork 180 degrees" style={styles.control}>
              <Ionicons name="sync-outline" size={22} color={colors.text} />
            </Pressable>
            <Pressable onPress={reset} accessibilityRole="button" accessibilityLabel="Reset artwork zoom and position" style={styles.control}>
              <Text style={styles.zoom}>{zoomLabel}×  Reset</Text>
            </Pressable>
          </View>
        </>}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, backgroundColor: colors.black },
  canvas: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  art: { width: '94%', height: '86%' },
  top: { position: 'absolute', left: spacing.lg, right: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flex: 1, color: colors.text, fontSize: 14, textAlign: 'right' },
  bottom: { position: 'absolute', left: spacing.lg, right: spacing.lg, flexDirection: 'row', justifyContent: 'space-between' },
  control: { minWidth: touchTargets.minimum, minHeight: touchTargets.minimum, borderRadius: radii.pill, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.md },
  zoom: { color: colors.text, fontSize: 13 },
});
