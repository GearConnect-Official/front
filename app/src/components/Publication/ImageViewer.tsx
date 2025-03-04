import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    Modal,
    Dimensions,
    Alert,
    Text,
    SafeAreaView,
    StatusBar,
    Animated,
    PanResponder,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { FontAwesome } from "@expo/vector-icons";
import { PinchGestureHandler, State, PinchGestureHandlerStateChangeEvent } from "react-native-gesture-handler";
import styles from "../../styles/publicationStyles";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export interface ImageViewerProps {
    imageUri: string;
    onImageChange: (newUri: string) => void;
    onNext: () => void;
    onGoBack: () => void;
    isLastStep?: boolean;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
    imageUri,
    onImageChange,
    onNext,
    onGoBack,
    isLastStep = false
}) => {
    const [isCropping, setIsCropping] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [aspectRatio, setAspectRatio] = useState<"square" | "portrait">("square");
    const [displayedImage, setDisplayedImage] = useState(imageUri);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [fullscreenScale, setFullscreenScale] = useState(1);
    
    const pan = useRef(new Animated.ValueXY()).current;
    const baseScale = useRef(new Animated.Value(1)).current;
    const pinchScale = useRef(new Animated.Value(1)).current;
    const scale2 = Animated.multiply(baseScale, pinchScale);

    const fullscreenBaseScale = useRef(new Animated.Value(1)).current;
    const fullscreenPinchScale = useRef(new Animated.Value(1)).current;
    const fullscreenScale2 = Animated.multiply(fullscreenBaseScale, fullscreenPinchScale);

    useEffect(() => {
        setDisplayedImage(imageUri);
        setScale(1);
        baseScale.setValue(1);
        pinchScale.setValue(1);
        setOffset({ x: 0, y: 0 });
        pan.setValue({ x: 0, y: 0 });
    }, [imageUri]);

    const onPinchGestureEvent = Animated.event(
        [{ nativeEvent: { scale: pinchScale } }],
        { useNativeDriver: true }
    );

    const onFullscreenPinchGestureEvent = Animated.event(
        [{ nativeEvent: { scale: fullscreenPinchScale } }],
        { useNativeDriver: true }
    );

    const onPinchHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const newScale = scale * event.nativeEvent.scale;
            const limitedScale = Math.max(1, Math.min(newScale, 3));
            setScale(limitedScale);
            baseScale.setValue(limitedScale);
            pinchScale.setValue(1);
        }
    };

    const onFullscreenPinchHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const newScale = fullscreenScale * event.nativeEvent.scale;
            const limitedScale = Math.max(1, Math.min(newScale, 3));
            setFullscreenScale(limitedScale);
            fullscreenBaseScale.setValue(limitedScale);
            fullscreenPinchScale.setValue(1);
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                pan.setValue({
                    x: offset.x + gestureState.dx,
                    y: offset.y + gestureState.dy
                });
            },
            onPanResponderRelease: (_, gestureState) => {
                setOffset({
                    x: offset.x + gestureState.dx,
                    y: offset.y + gestureState.dy
                });
            }
        })
    ).current;

    const handleAspectRatioChange = (newAspectRatio: "square" | "portrait") => {
        setAspectRatio(newAspectRatio);
        pan.setValue({ x: 0, y: 0 });
        setOffset({ x: 0, y: 0 });
        setScale(1);
        baseScale.setValue(1);
        pinchScale.setValue(1);
    };

    const confirmCrop = async () => {
        try {
            const cropWidth = SCREEN_WIDTH;
            const cropHeight = aspectRatio === "square" ? SCREEN_WIDTH : (SCREEN_WIDTH * 5) / 4;

            const manipulations = [];

            // Add scale manipulation if zoomed
            if (scale !== 1) {
                manipulations.push({ resize: { width: SCREEN_WIDTH * scale } });
            }

            // Add crop manipulation
            manipulations.push({
                crop: {
                    originX: Math.abs(Math.round(offset.x)),
                    originY: Math.abs(Math.round(offset.y)),
                    width: Math.round(cropWidth),
                    height: Math.round(cropHeight)
                }
            });

            const result = await ImageManipulator.manipulateAsync(
                displayedImage,
                manipulations,
                { format: ImageManipulator.SaveFormat.JPEG, compress: 1 }
            );

            setDisplayedImage(result.uri);
            onImageChange(result.uri);
            setIsCropping(false);
            pan.setValue({ x: 0, y: 0 });
            setOffset({ x: 0, y: 0 });
            setScale(1);
            baseScale.setValue(1);
            pinchScale.setValue(1);
        } catch (error) {
            Alert.alert('Error', 'Failed to crop image');
            console.error(error);
        }
    };

    const renderFullScreenModal = () => (
        <Modal
            animationType="fade"
            transparent={false}
            visible={isFullScreen}
            onRequestClose={() => setIsFullScreen(false)}
        >
            <View style={styles.fullScreenContainer}>
                <TouchableOpacity
                    style={styles.fullScreenCloseButton}
                    onPress={() => {
                        setIsFullScreen(false);
                        setFullscreenScale(1);
                        fullscreenBaseScale.setValue(1);
                        fullscreenPinchScale.setValue(1);
                    }}
                >
                    <FontAwesome name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <PinchGestureHandler
                    onGestureEvent={onFullscreenPinchGestureEvent}
                    onHandlerStateChange={onFullscreenPinchHandlerStateChange}
                >
                    <Animated.View style={{ flex: 1, width: '100%' }}>
                        <Animated.Image
                            source={{ uri: displayedImage }}
                            style={[
                                styles.fullScreenImage,
                                {
                                    transform: [{ scale: fullscreenScale2 }]
                                }
                            ]}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </PinchGestureHandler>
                <View style={styles.zoomInstructions}>
                    <Text style={styles.zoomInstructionsText}>Pinch to zoom</Text>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            {isCropping ? (
                <View style={styles.cropFrameContainer}>
                    <View style={[styles.cropFrame, { aspectRatio: aspectRatio === "square" ? 1 : 4/5 }]}>
                        <PinchGestureHandler
                            onGestureEvent={onPinchGestureEvent}
                            onHandlerStateChange={onPinchHandlerStateChange}
                        >
                            <Animated.View
                                style={[
                                    styles.cropImageContainer,
                                    {
                                        transform: [
                                            ...pan.getTranslateTransform(),
                                            { scale: scale2 }
                                        ]
                                    }
                                ]}
                                {...panResponder.panHandlers}
                            >
                                <Image
                                    source={{ uri: displayedImage }}
                                    style={styles.cropImage}
                                    resizeMode="cover"
                                />
                            </Animated.View>
                        </PinchGestureHandler>
                    </View>

                    <View style={styles.aspectRatioControls}>
                        <TouchableOpacity
                            style={[
                                styles.aspectRatioButton,
                                aspectRatio === "square" && styles.aspectRatioButtonActive
                            ]}
                            onPress={() => handleAspectRatioChange("square")}
                        >
                            <FontAwesome name="square-o" size={20} color={aspectRatio === "square" ? "#0095F6" : "#fff"} />
                            <Text style={styles.aspectRatioButtonText}>1:1</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[
                                styles.aspectRatioButton,
                                aspectRatio === "portrait" && styles.aspectRatioButtonActive
                            ]}
                            onPress={() => handleAspectRatioChange("portrait")}
                        >
                            <FontAwesome name="times-rectangle-o" size={20} color={aspectRatio === "portrait" ? "#0095F6" : "#fff"} />
                            <Text style={styles.aspectRatioButtonText}>4:5</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <>
                    <View style={styles.previewContainer}>
                        <Image
                            source={{ uri: displayedImage }}
                            style={styles.previewImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.imageControls}>
                        <TouchableOpacity
                            style={styles.imageControlButton}
                            onPress={() => {
                                setIsCropping(true);
                                setScale(1);
                                baseScale.setValue(1);
                                pinchScale.setValue(1);
                                setOffset({ x: 0, y: 0 });
                                pan.setValue({ x: 0, y: 0 });
                            }}
                        >
                            <FontAwesome name="crop" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.imageControlButton}
                            onPress={() => setIsFullScreen(true)}
                        >
                            <FontAwesome name="expand" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    {renderFullScreenModal()}
                </>
            )}
        </SafeAreaView>
    );
};

export default ImageViewer;