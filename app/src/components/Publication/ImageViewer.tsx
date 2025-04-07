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
    StyleSheet
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { FontAwesome } from "@expo/vector-icons";
import { PinchGestureHandler, State, PinchGestureHandlerStateChangeEvent } from "react-native-gesture-handler";
import styles from "../../styles/publicationStyles";
import imageViewerStyles from "../../styles/imageViewerStyles";

// Palette de couleurs racing
const THEME_COLORS = {
  primary: '#E10600', // Rouge Racing
  secondary: '#1E1E1E', // Noir Racing
  background: '#FFFFFF',
  textPrimary: '#1E1E1E',
  textSecondary: '#6E6E6E',
  card: '#F2F2F2',
  cardLight: '#F8F8F8',
  border: '#E0E0E0',
};

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
    const [aspectRatio, setAspectRatio] = useState<"square" | "portrait" | "landscape">("square");
    const [displayedImage, setDisplayedImage] = useState(imageUri);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [fullscreenScale, setFullscreenScale] = useState(1);
    const [showHelp, setShowHelp] = useState(true);
    
    const pan = useRef(new Animated.ValueXY()).current;
    const baseScale = useRef(new Animated.Value(1)).current;
    const pinchScale = useRef(new Animated.Value(1)).current;
    const scale2 = Animated.multiply(baseScale, pinchScale);

    const fullscreenBaseScale = useRef(new Animated.Value(1)).current;
    const fullscreenPinchScale = useRef(new Animated.Value(1)).current;
    const fullscreenScale2 = Animated.multiply(fullscreenBaseScale, fullscreenPinchScale);
    
    // Fade out help tooltip after 3 seconds
    useEffect(() => {
        const helpTimer = setTimeout(() => {
            setShowHelp(false);
        }, 3000);
        
        return () => clearTimeout(helpTimer);
    }, []);

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
                // Hide help tooltip when user starts interacting
                if (showHelp) {
                    setShowHelp(false);
                }
                
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

    const handleAspectRatioChange = (newAspectRatio: "square" | "portrait" | "landscape") => {
        setAspectRatio(newAspectRatio);
        pan.setValue({ x: 0, y: 0 });
        setOffset({ x: 0, y: 0 });
        setScale(1);
        baseScale.setValue(1);
        pinchScale.setValue(1);
    };

    const confirmCrop = async () => {
        try {
            let cropWidth = SCREEN_WIDTH;
            let cropHeight = SCREEN_WIDTH;
            
            if (aspectRatio === "portrait") {
                cropHeight = (SCREEN_WIDTH * 5) / 4;
            } else if (aspectRatio === "landscape") {
                cropHeight = (SCREEN_WIDTH * 3) / 4;
            }

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
                { format: ImageManipulator.SaveFormat.JPEG, compress: 0.9 }
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
            Alert.alert('Erreur', 'Impossible de recadrer l\'image');
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
            <SafeAreaView style={localStyles.fullScreenContainer}>
                <TouchableOpacity
                    style={localStyles.fullScreenCloseButton}
                    onPress={() => {
                        setIsFullScreen(false);
                        setFullscreenScale(1);
                        fullscreenBaseScale.setValue(1);
                        fullscreenPinchScale.setValue(1);
                    }}
                >
                    <FontAwesome name="arrow-left" size={24} color={THEME_COLORS.background} />
                </TouchableOpacity>
                <PinchGestureHandler
                    onGestureEvent={onFullscreenPinchGestureEvent}
                    onHandlerStateChange={onFullscreenPinchHandlerStateChange}
                >
                    <Animated.View style={{ flex: 1 }}>
                        <Animated.Image
                            source={{ uri: displayedImage }}
                            style={[
                                localStyles.fullScreenImage,
                                {
                                    transform: [{ scale: fullscreenScale2 }]
                                }
                            ]}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </PinchGestureHandler>
                <View style={localStyles.zoomInstructions}>
                    <Text style={localStyles.zoomInstructionsText}>Pincez pour zoomer</Text>
                </View>
            </SafeAreaView>
        </Modal>
    );

    const renderImageViewer = () => (
        <View style={localStyles.viewerContainer}>
            <TouchableOpacity 
                style={localStyles.imageContainer}
                onPress={() => setIsFullScreen(true)}
            >
                <Image
                    source={{ uri: displayedImage }}
                    style={localStyles.previewImage}
                    resizeMode="cover"
                />
                <View style={localStyles.imageOverlay}>
                    <FontAwesome name="search-plus" size={24} color={THEME_COLORS.background} />
                </View>
            </TouchableOpacity>
            
            <View style={localStyles.imageControls}>
                <TouchableOpacity
                    style={localStyles.controlButton}
                    onPress={() => setIsCropping(true)}
                >
                    <FontAwesome name="crop" size={20} color={THEME_COLORS.primary} />
                    <Text style={localStyles.controlText}>Recadrer</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[localStyles.nextButton, isLastStep && localStyles.continueButton]} 
                    onPress={onNext}
                >
                    <Text style={[localStyles.nextButtonText, isLastStep && localStyles.continueButtonText]}>
                        {isLastStep ? "Terminer" : "Continuer"}
                    </Text>
                    <FontAwesome 
                        name="arrow-right" 
                        size={16} 
                        color={isLastStep ? THEME_COLORS.background : THEME_COLORS.primary} 
                        style={{ marginLeft: 5 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCropTool = () => (
        <View style={localStyles.cropContainer}>
            <View style={localStyles.cropHeader}>
                <TouchableOpacity onPress={() => setIsCropping(false)}>
                    <FontAwesome name="arrow-left" size={20} color={THEME_COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={localStyles.cropTitle}>Recadrer la photo</Text>
                <TouchableOpacity onPress={confirmCrop}>
                    <Text style={localStyles.cropDoneText}>Appliquer</Text>
                </TouchableOpacity>
            </View>
            
            <View style={localStyles.cropFrameContainer}>
                <View 
                    style={[
                        localStyles.cropFrame, 
                        aspectRatio === "square" 
                            ? localStyles.cropFrameSquare 
                            : aspectRatio === "portrait"
                                ? localStyles.cropFramePortrait
                                : localStyles.cropFrameLandscape
                    ]}
                >
                    <PinchGestureHandler
                        onGestureEvent={onPinchGestureEvent}
                        onHandlerStateChange={onPinchHandlerStateChange}
                    >
                        <Animated.View
                            style={[
                                localStyles.cropImageContainer,
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
                                style={localStyles.cropImage}
                                resizeMode="cover"
                            />
                        </Animated.View>
                    </PinchGestureHandler>
                    
                    {/* Grid lines for crop frame */}
                    <View style={localStyles.cropGrid}>
                        {/* Horizontal lines */}
                        <View style={[localStyles.gridLine, { top: '33%', width: '100%', height: 1 }]} />
                        <View style={[localStyles.gridLine, { top: '66%', width: '100%', height: 1 }]} />
                        
                        {/* Vertical lines */}
                        <View style={[localStyles.gridLine, { left: '33%', height: '100%', width: 1 }]} />
                        <View style={[localStyles.gridLine, { left: '66%', height: '100%', width: 1 }]} />
                    </View>
                    
                    {showHelp && (
                        <View style={localStyles.helpTooltip}>
                            <Text style={localStyles.helpText}>
                                Déplacez et pincez pour ajuster
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            
            <View style={localStyles.aspectRatioControls}>
                <TouchableOpacity
                    style={[
                        localStyles.aspectRatioButton,
                        aspectRatio === "square" && localStyles.aspectRatioButtonActive
                    ]}
                    onPress={() => handleAspectRatioChange("square")}
                >
                    <FontAwesome name="square" size={16} color={aspectRatio === "square" ? THEME_COLORS.primary : THEME_COLORS.textSecondary} />
                    <Text style={[
                        localStyles.aspectRatioText,
                        aspectRatio === "square" && localStyles.aspectRatioTextActive
                    ]}>1:1</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                        localStyles.aspectRatioButton,
                        aspectRatio === "portrait" && localStyles.aspectRatioButtonActive
                    ]}
                    onPress={() => handleAspectRatioChange("portrait")}
                >
                    <FontAwesome name="rectangle-portrait" size={16} color={aspectRatio === "portrait" ? THEME_COLORS.primary : THEME_COLORS.textSecondary} />
                    <Text style={[
                        localStyles.aspectRatioText,
                        aspectRatio === "portrait" && localStyles.aspectRatioTextActive
                    ]}>4:5</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                        localStyles.aspectRatioButton,
                        aspectRatio === "landscape" && localStyles.aspectRatioButtonActive
                    ]}
                    onPress={() => handleAspectRatioChange("landscape")}
                >
                    <FontAwesome name="rectangle-landscape" size={16} color={aspectRatio === "landscape" ? THEME_COLORS.primary : THEME_COLORS.textSecondary} />
                    <Text style={[
                        localStyles.aspectRatioText,
                        aspectRatio === "landscape" && localStyles.aspectRatioTextActive
                    ]}>4:3</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME_COLORS.background} />
            
            {isCropping ? renderCropTool() : renderImageViewer()}
            
            {isFullScreen && renderFullScreenModal()}
        </SafeAreaView>
    );
};

const localStyles = StyleSheet.create({
    viewerContainer: {
        flex: 1,
        backgroundColor: THEME_COLORS.background,
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
        backgroundColor: THEME_COLORS.card,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: THEME_COLORS.background,
        borderTopWidth: 1,
        borderTopColor: THEME_COLORS.border,
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: THEME_COLORS.cardLight,
    },
    controlText: {
        color: THEME_COLORS.primary,
        marginLeft: 8,
        fontWeight: '500',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: THEME_COLORS.cardLight,
        borderWidth: 1,
        borderColor: THEME_COLORS.primary,
    },
    nextButtonText: {
        color: THEME_COLORS.primary,
        fontWeight: '600',
    },
    continueButton: {
        backgroundColor: THEME_COLORS.primary,
        borderWidth: 0,
    },
    continueButtonText: {
        color: THEME_COLORS.background,
    },
    
    // Crop tool styles
    cropContainer: {
        flex: 1,
        backgroundColor: THEME_COLORS.background,
    },
    cropHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: THEME_COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: THEME_COLORS.border,
    },
    cropTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: THEME_COLORS.textPrimary,
    },
    cropDoneText: {
        color: THEME_COLORS.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    cropFrameContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: THEME_COLORS.secondary,
    },
    cropFrame: {
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: THEME_COLORS.primary,
    },
    cropFrameSquare: {
        width: SCREEN_WIDTH - 40,
        height: SCREEN_WIDTH - 40,
    },
    cropFramePortrait: {
        width: SCREEN_WIDTH - 40,
        height: ((SCREEN_WIDTH - 40) * 5) / 4,
    },
    cropFrameLandscape: {
        width: SCREEN_WIDTH - 40,
        height: ((SCREEN_WIDTH - 40) * 3) / 4,
    },
    cropImageContainer: {
        width: SCREEN_WIDTH * 2,
        height: SCREEN_WIDTH * 2,
    },
    cropImage: {
        width: '100%',
        height: '100%',
    },
    cropGrid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
    gridLine: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    aspectRatioControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 16,
        backgroundColor: THEME_COLORS.background,
        borderTopWidth: 1,
        borderTopColor: THEME_COLORS.border,
    },
    aspectRatioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: THEME_COLORS.cardLight,
    },
    aspectRatioButtonActive: {
        backgroundColor: THEME_COLORS.cardLight,
        borderWidth: 1,
        borderColor: THEME_COLORS.primary,
    },
    aspectRatioText: {
        fontSize: 14,
        marginLeft: 8,
        color: THEME_COLORS.textSecondary,
    },
    aspectRatioTextActive: {
        color: THEME_COLORS.primary,
        fontWeight: '600',
    },
    helpTooltip: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
        alignItems: 'center',
    },
    helpText: {
        color: THEME_COLORS.background,
        fontSize: 14,
        textAlign: 'center',
    },
    
    // Fullscreen styles
    fullScreenContainer: {
        flex: 1,
        backgroundColor: THEME_COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenCloseButton: {
        position: 'absolute',
        top: 16 + (StatusBar.currentHeight || 0),
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    fullScreenImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        resizeMode: 'contain',
    },
    zoomInstructions: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
        alignItems: 'center',
    },
    zoomInstructionsText: {
        color: THEME_COLORS.background,
        fontSize: 14,
    },
});

export default ImageViewer;