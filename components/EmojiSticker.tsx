import { type ImageSource } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  imageSize: number;
  stickerSource: ImageSource;
  onDelete: () => void; 
};

export default function EmojiSticker({ imageSize, stickerSource, onDelete }: Props) {
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      } else {
        scaleImage.value = Math.round(scaleImage.value / 2);
      }
    });

  const quadrupleTap = Gesture.Tap()
    .numberOfTaps(4)
    .onStart(() => {
      runOnJS(onDelete)();
    });

  const drag = Gesture.Pan().onChange(event => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const imageStyle = useAnimatedStyle(() => ({
    width: withSpring(scaleImage.value),
    height: withSpring(scaleImage.value),
  }));

  const composedGesture = Gesture.Simultaneous(drag, doubleTap, quadrupleTap);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={containerStyle}>
        <Animated.Image
          source={stickerSource}
          style={imageStyle}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}
