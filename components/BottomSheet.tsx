import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useImperativeHandle } from 'react'
const{height:SCREEN_HEIGHT}=Dimensions.get('window');
const MAX_TRANSLATE_Y=-SCREEN_HEIGHT+50;
import {GestureDetector,Gesture} from 'react-native-gesture-handler'
import Animated, { Extrapolate, interpolate, useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
type BottomSheetProps={
    children?:React.ReactNode;
};
export type BottomSheetRefProps={
    scrollTo:(val:number)=>void;
    isActive:()=>boolean;
};
const BottomSheet = React.forwardRef<BottomSheetRefProps,BottomSheetProps>(({children},ref) => {
    const translateY=useSharedValue(0);
    const active=useSharedValue(false);
    const scrollTo=useCallback((val:number)=>{
       
        'worklet';
       active.value=val!=0;
        translateY.value=withSpring(val,{damping:50});
    },[])
    const isActive=useCallback(()=>{
          return active.value;
    },[])
    useImperativeHandle(ref,()=>({scrollTo,isActive}),[scrollTo,isActive])
    const context=useSharedValue({y:0});
    const gesture=Gesture.Pan().onStart(()=>{
        context.value={y:translateY.value}
    }).onUpdate((event)=>{
        translateY.value=event.translationY+context.value.y;
        translateY.value=Math.max(translateY.value,MAX_TRANSLATE_Y);
    }).onEnd(()=>{
        if(translateY.value>(-SCREEN_HEIGHT/3)){
            // translateY.value=withSpring(0,{damping:50});
            scrollTo(0);
        }else if(translateY.value<(-SCREEN_HEIGHT/3) && translateY.value>(-SCREEN_HEIGHT/1.5)){
            // translateY.value=withSpring(MAX_TRANSLATE_Y/2,{damping:50});
            scrollTo(MAX_TRANSLATE_Y/2);
        }else if(translateY.value<(-SCREEN_HEIGHT/2)){
            // translateY.value=withSpring(MAX_TRANSLATE_Y,{damping:50});
            scrollTo(MAX_TRANSLATE_Y);
        }
    });
    //   useEffect(()=>{
    //           translateY.value=withSpring(-SCREEN_HEIGHT/3,{damping:50});
    //   },[])

    const rBottomSheetStyle=useAnimatedStyle(()=>{
        const borderRadius=interpolate(translateY.value,[MAX_TRANSLATE_Y+50,MAX_TRANSLATE_Y],[25,5], Extrapolate.CLAMP);
       
        return{
            borderRadius,
            transform:[{translateY:translateY.value}],
        }
    })
    const rBackdropStyle=useAnimatedStyle(()=>{
        return{
           opacity:withTiming(active.value?1:0),
        }
    },[])
    const rBackdropProps=useAnimatedProps(()=>{
        return{
            pointerEvents:active.value?'auto':'none',
        } as any
    },[])
  return (
    <>
    <Animated.View 
    pointerEvents="auto" 
    onTouchStart={()=>{
        scrollTo(0);
    }}
    animatedProps={rBackdropProps}
    style={[{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.4)'},rBackdropStyle]}/>
    <GestureDetector gesture={gesture}>
    <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
      <View style={styles.line}/>
      {children}
    </Animated.View>
    </GestureDetector>
    </>
  )
});

export default BottomSheet

const styles = StyleSheet.create({
    bottomSheetContainer:{
        height:SCREEN_HEIGHT,
        width:'100%',
        backgroundColor:'white',
        position:'absolute',
        top:SCREEN_HEIGHT,
        borderRadius:15,
    },
    line:{
        width:75,
        height:4,
        backgroundColor:'grey',
        alignSelf:'center',
        marginVertical:15,
        borderRadius:2,
    }
})