import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

export default function App() {
  const [num, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={() => setCount(num - 1)}>
          <Text style={styles.btnText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.number}>{num}</Text>
        
        <TouchableOpacity style={styles.btn} onPress={() => setCount(num + 1)}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  btn: { width: 50, height: 50, backgroundColor: '#007AFF', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 },
  btnText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  number: { fontSize: 40, width: 60, textAlign: 'center' },
});