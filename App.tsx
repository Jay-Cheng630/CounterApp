import React, { useState, useRef } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

export default function App() {
  //改为1，比最开始的时候更符合用户日常的操作习惯
  const [num, setCount] = useState(1);

  //增加一个定时器，可以长按加减
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressIn = (increment: number) => {
    // 刚按下去先立刻加/减一次
    setCount(prevCount => prevCount + increment);
    // 长按一直加的功能
    timerRef.current = setInterval(() => {
      setCount(prevCount => prevCount + increment);
    }, 100);
  };

  const handlePressOut = () => {
    // 松手即停
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <SafeAreaView style={styles.container}>  
      <View style={styles.row}>
        
        <TouchableOpacity 
          style={styles.btn} 
          onPressIn={() => handlePressIn(-1)} 
          onPressOut={handlePressOut}
        >
          <Text style={styles.btnText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.number}>{num}</Text>
        
        <TouchableOpacity 
          style={styles.btn} 
          onPressIn={() => handlePressIn(1)} 
          onPressOut={handlePressOut}
        >
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
  number: { fontSize: 40, width: 80, textAlign: 'center' }, 
});