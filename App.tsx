import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from './components/BottomSheet';
import { useCallback, useRef } from 'react';
import { BottomSheetRefProps } from './components/BottomSheet';
export default function App() {
  const ref=useRef<BottomSheetRefProps>(null);
  const onPress=useCallback(()=>{
    const isActive=ref?.current?.isActive();
     if(isActive){
      ref?.current?.scrollTo(0);
     }else{
      ref?.current?.scrollTo(-200);
     }
  },[])
  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <View style={styles.container}>
     
      <StatusBar style="dark" />
      <TouchableOpacity style={styles.button} onPress={onPress}/>
      <BottomSheet ref={ref}>
        <View style={{flex:1, backgroundColor:'pink'}}/>
        </BottomSheet>

    </View>
    
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    height:50,
    borderRadius:25,
    aspectRatio:1,
    backgroundColor:'pink',
    opacity:0.6,
  }
});
