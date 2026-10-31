import React, { useState, useRef } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';

export default function App() {
  // useState: 用来存需要显示在屏幕上的数据
  const [num, setCount] = useState(1); 
  // isEditing: 验证这个时候是不是在输入框编辑模式
  const [isEditing, setIsEditing] = useState(false);
  
  // useRef函数
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  //按下按钮时
  const handlePressIn = (increment: number) => {
    // 先把数字立刻加/减 1 次
    setCount((prevCount) => prevCount + increment);
    
    // setInterval: 开启一个定时器。每隔 100 毫秒，执行一次里面的函数
    timerRef.current = setInterval(() => {
      setCount((prevCount) => prevCount + increment);
    }, 100);
  };

  // 松开按钮时
  const handlePressOut = () => {
    // 停止加号运行或者停止减号运行
    if (timerRef.current) {
      clearInterval(timerRef.current); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        
        {/* 减号按钮 */}
        <TouchableOpacity
          style={styles.btn}
          onPressIn={() => handlePressIn(-1)} // 手指按下
          onPressOut={handlePressOut}         // 手指松开
        >
          <Text style={styles.btnText}>-</Text>
        </TouchableOpacity>

        {/* if-else */}
        {isEditing ? (
          // 如果是编辑状态，显示输入框
          <TextInput
            style={styles.numberInput}
            keyboardType="numeric"
            value={String(num)}
            onChangeText={(text) => {
              const parsed = parseInt(text, 10);
              if (!isNaN(parsed)) setCount(parsed);
              else if (text === '') setCount(0);
            }}
            onBlur={() => setIsEditing(false)} // 点击屏幕别处，退出编辑
            autoFocus={true} // 弹出键盘
            selectTextOnFocus={true} // 自动全选
          />
        ) : (
          // 如果不是编辑状态，显示编辑完后或者没有编辑的数字
          <TouchableOpacity onLongPress={() => setIsEditing(true)}>
            <Text style={styles.number}>{num}</Text>
          </TouchableOpacity>
        )}

        {/* 加号按钮 */}
        <TouchableOpacity
          style={styles.btn}
          onPressIn={() => handlePressIn(1)}
          onPressOut={handlePressOut}
        >
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 底部小提示 */}
      <Text style={styles.hintText}>长按数字可直接编辑</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  btn: { width: 50, height: 50, backgroundColor: '#007AFF', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 },
  btnText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  number: { fontSize: 40, width: 100, textAlign: 'center', color: '#333' },
  numberInput: { fontSize: 40, width: 100, textAlign: 'center', borderBottomWidth: 2, borderColor: '#007AFF', padding: 0, color: '#333' },
  hintText: { fontSize: 12, color: '#999' },
});