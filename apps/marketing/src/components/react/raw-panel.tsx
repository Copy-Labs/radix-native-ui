import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

/**
 * The "Without" half of the comparison.
 *
 * This is deliberately *not* a strawman: it is the screen the library column
 * beside it builds, hand-rolled the way most RN codebases end up doing it —
 * literal colors, literal spacing, a switch assembled out of two Views. It
 * renders correctly, and it is the honest version of the problem, which is why
 * it stays light-on-white when the page goes dark: there is no theme context
 * here to recompute from.
 */
const RawPanel = () => {
  const [on, setOn] = useState(true);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SK</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>Susan Kare</Text>
          <Text style={styles.role}>Design lead · 12 projects</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Pro ✨</Text>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Display name</Text>
        <TextInput style={styles.input} defaultValue="Susan Kare" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} defaultValue="susan@apple.com" keyboardType="email-address" />
      </View>

      <Pressable onPress={() => setOn((v) => !v)} style={styles.switchRow}>
        <Text style={styles.switchLabel}>Email me product updates</Text>
        <View style={[styles.track, on && styles.trackOn]}>
          <View style={[styles.knob, on && styles.knobOn]} />
        </View>
      </Pressable>

      <View style={styles.field}>
        <View style={styles.progressHead}>
          <Text style={styles.label}>Storage</Text>
          <Text style={styles.label}>78%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primary}>
          <Text style={styles.primaryText}>Save changes</Text>
        </Pressable>
        <Pressable style={styles.secondary}>
          <Text style={styles.secondaryText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 17,
    gap: 13,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerText: { flex: 1 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#4338ca', fontSize: 13, fontWeight: '700' },
  name: { color: '#111111', fontSize: 17, fontWeight: '700' },
  role: { color: '#8a8a8a', fontSize: 12.5, marginTop: 1 },
  pill: {
    backgroundColor: '#fff7e6',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  pillText: { color: '#b45309', fontSize: 12, fontWeight: '600' },
  field: { gap: 5 },
  label: { color: '#555555', fontSize: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 17,
    color: '#111111',
    backgroundColor: '#fafafa',
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLabel: { color: '#111111', fontSize: 14 },
  track: {
    width: 40,
    height: 23,
    borderRadius: 20,
    backgroundColor: '#d4d4d4',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  trackOn: { backgroundColor: '#6366f1' },
  knob: {
    width: 19,
    height: 19,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  knobOn: { alignSelf: 'flex-end' },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between' },
  progressTrack: {
    height: 7,
    borderRadius: 10,
    backgroundColor: '#ededed',
    overflow: 'hidden',
  },
  progressFill: { width: '78%', height: '100%', backgroundColor: '#6366f1' },
  actions: { flexDirection: 'row', gap: 9 },
  primary: {
    flex: 1,
    backgroundColor: '#4f46e5',
    borderRadius: 7,
    paddingVertical: 8,
    alignItems: 'center',
  },
  primaryText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  secondary: {
    backgroundColor: '#f4f4f5',
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  secondaryText: { color: '#3f3f46', fontSize: 14 },
});

export default RawPanel;
