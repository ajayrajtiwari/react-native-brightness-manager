import { useState } from 'react';
import { Text, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useBrightness } from 'react-native-brightness-manager';

export default function App() {
  const { brightness, setBrightness, isLoading } = useBrightness();
  const [status, setStatus] = useState('');

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  const handleSet = async (value: number) => {
    await setBrightness(value);
    setStatus(`Brightness set to ${Math.round(value * 100)}%`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brightness Manager</Text>
      <Text style={styles.value}>
        Current: {brightness !== null ? `${Math.round(brightness * 100)}%` : '—'}
      </Text>
      <View style={styles.buttons}>
        <Button title="Low (20%)" onPress={() => handleSet(0.2)} />
        <Button title="Medium (50%)" onPress={() => handleSet(0.5)} />
        <Button title="High (100%)" onPress={() => handleSet(1.0)} />
      </View>
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  value: { fontSize: 18, marginBottom: 24 },
  buttons: { gap: 12, width: '100%' },
  status: { marginTop: 20, color: 'gray' },
});
