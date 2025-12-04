import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const InteractivePlayground = () => {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState('#6366f1');
  const [name, setName] = useState('');
  const [scale] = useState(new Animated.Value(1));

  const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handlePress = () => {
    setCount(count + 1);
    // Bounce animation
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetCounter = () => {
    setCount(0);
    setName('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: color }]}>
          <Text style={styles.headerText}>🎮 React Native Playground</Text>
          <Text style={styles.subHeaderText}>Let's build something cool!</Text>
        </View>

        {/* Greeting Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👋 What's your name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name..."
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
          />
          {name ? (
            <Text style={styles.greeting}>Hello, {name}! 🌟</Text>
          ) : null}
        </View>

        {/* Counter Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔢 Tap Counter</Text>
          <Animated.View style={[styles.counterCircle, { 
            backgroundColor: color,
            transform: [{ scale }]
          }]}>
            <Text style={styles.counterText}>{count}</Text>
          </Animated.View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: color }]}
              onPress={handlePress}
            >
              <Text style={styles.buttonText}>Tap Me! 🚀</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetCounter}
            >
              <Text style={styles.buttonText}>Reset 🔄</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Color Picker Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎨 Choose Your Theme</Text>
          <View style={styles.colorGrid}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorBox,
                  { backgroundColor: c },
                  color === c && styles.selectedColor,
                ]}
                onPress={() => setColor(c)}
              >
                {color === c && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Your Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{count}</Text>
              <Text style={styles.statLabel}>Taps</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{name.length}</Text>
              <Text style={styles.statLabel}>Characters</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{colors.length}</Text>
              <Text style={styles.statLabel}>Colors</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Built with React Native ⚛️</Text>
          <Text style={styles.footerSubtext}>Keep exploring and have fun! 🎉</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#e5e7eb',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginTop: 16,
    textAlign: 'center',
  },
  counterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  resetButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorBox: {
    width: (width - 88) / 3,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedColor: {
    borderWidth: 4,
    borderColor: '#1f2937',
  },
  checkmark: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
});

export default InteractivePlayground;