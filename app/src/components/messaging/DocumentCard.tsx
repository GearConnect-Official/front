import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import theme from '../../styles/config/theme';

const { width: screenWidth } = Dimensions.get('window');
const MAX_CARD_WIDTH = screenWidth * 0.90; // Increased to allow more horizontal space
const MIN_CARD_WIDTH = screenWidth * 0.70; // Minimum width to ensure content fits

export interface DocumentData {
  name: string;
  uri: string;
  secureUrl: string;
  publicId?: string;
  mimeType?: string;
  size?: number;
}

interface DocumentCardProps {
  document: DocumentData;
  isOwn: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, isOwn }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);

  const getFileIcon = (mimeType?: string, fileName?: string) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    
    // Check by extension first (more reliable)
    if (extension) {
      if (['pdf'].includes(extension)) return 'file-pdf-o';
      if (['doc', 'docx'].includes(extension)) return 'file-word-o';
      if (['xls', 'xlsx', 'csv'].includes(extension)) return 'file-excel-o';
      if (['ppt', 'pptx'].includes(extension)) return 'file-powerpoint-o';
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) return 'file-image-o';
      if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) return 'file-video-o';
      if (['mp3', 'wav', 'm4a', 'aac', 'ogg'].includes(extension)) return 'file-audio-o';
      if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'file-archive-o';
      if (['txt', 'md', 'rtf'].includes(extension)) return 'file-text-o';
    }
    
    // Fallback to MIME type
    if (mimeType) {
      if (mimeType.includes('pdf')) return 'file-pdf-o';
      if (mimeType.includes('word') || mimeType.includes('document')) return 'file-word-o';
      if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'file-excel-o';
      if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'file-powerpoint-o';
      if (mimeType.includes('image')) return 'file-image-o';
      if (mimeType.includes('video')) return 'file-video-o';
      if (mimeType.includes('audio')) return 'file-audio-o';
      if (mimeType.includes('zip') || mimeType.includes('archive')) return 'file-archive-o';
      if (mimeType.includes('text')) return 'file-text-o';
    }
    
    return 'file';
  };

  const getFileTypeLabel = (mimeType?: string, fileName?: string) => {
    const extension = fileName?.split('.').pop()?.toUpperCase();
    
    if (extension) {
      if (['PDF'].includes(extension)) return 'PDF Document';
      if (['DOC', 'DOCX'].includes(extension)) return 'Word Document';
      if (['XLS', 'XLSX', 'CSV'].includes(extension)) return 'Excel Spreadsheet';
      if (['PPT', 'PPTX'].includes(extension)) return 'PowerPoint Presentation';
      if (['JPG', 'JPEG', 'PNG', 'GIF', 'BMP', 'WEBP'].includes(extension)) return 'Image';
      if (['MP4', 'AVI', 'MOV', 'WMV', 'FLV'].includes(extension)) return 'Video';
      if (['MP3', 'WAV', 'M4A', 'AAC', 'OGG'].includes(extension)) return 'Audio';
      if (['ZIP', 'RAR', '7Z', 'TAR', 'GZ'].includes(extension)) return 'Archive';
      if (['TXT', 'MD', 'RTF'].includes(extension)) return 'Text Document';
      return `${extension} File`;
    }
    
    if (mimeType) {
      if (mimeType.includes('pdf')) return 'PDF Document';
      if (mimeType.includes('word')) return 'Word Document';
      if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Excel Spreadsheet';
      if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PowerPoint Presentation';
      if (mimeType.includes('image')) return 'Image';
      if (mimeType.includes('video')) return 'Video';
      if (mimeType.includes('audio')) return 'Audio';
      if (mimeType.includes('zip') || mimeType.includes('archive')) return 'Archive';
      if (mimeType.includes('text')) return 'Text Document';
    }
    
    return 'Document';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return 'Size unknown';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const handleDownload = async (e?: any) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      let url = document.secureUrl || document.uri;
      
      if (!url) {
        throw new Error('No valid URL found for document');
      }
      
      console.log('🔗 Opening Cloudinary URL in browser for direct download:', url);
      
      if (Platform.OS === 'web') {
        // For web, open in new tab (triggers download)
        window.open(url, '_blank');
        return;
      }

      // On mobile, open the URL directly in the browser
      // The browser will handle the download natively
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        throw new Error('Cannot open URL in browser');
      }
    } catch (error) {
      console.error('❌ Error opening document URL:', error);
      Alert.alert(
        'Erreur',
        `Impossible d'ouvrir le fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      );
    }
  };


  const handleOpen = async () => {
    // Instead of opening the URL directly (which may download an empty file),
    // trigger the download process which handles Cloudinary URLs properly
    await handleDownload();
  };

  const fileIcon = getFileIcon(document.mimeType, document.name);
  const fileSize = formatFileSize(document.size);
  const fileTypeLabel = getFileTypeLabel(document.mimeType, document.name);
  const fileExtension = document.name?.split('.').pop()?.toUpperCase() || '';
  const fileName = document.name || document.secureUrl?.split('/').pop() || 'Untitled Document';

  return (
    <TouchableOpacity
      style={[styles.container, isOwn && styles.ownContainer]}
      onPress={handleOpen}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, isOwn && styles.ownIconContainer]}>
          <FontAwesome 
            name={fileIcon} 
            size={screenWidth * 0.08} 
            color={isOwn ? '#FFFFFF' : theme.colors.primary.main} 
          />
        </View>
        
        <View style={styles.documentInfo}>
          <View style={styles.nameContainer}>
            <Text 
              style={[styles.documentName, isOwn && styles.ownDocumentName]}
              numberOfLines={isExpanded ? undefined : 2}
              ellipsizeMode="tail"
              onTextLayout={(e) => {
                const lines = e.nativeEvent.lines;
                if (lines.length > 2) {
                  setShowSeeMore(true);
                } else {
                  setShowSeeMore(false);
                }
              }}
            >
              {fileName}
            </Text>
            {showSeeMore && (
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={styles.seeMoreButton}
                activeOpacity={0.7}
              >
                <Text style={[styles.seeMoreText, isOwn && styles.ownSeeMoreText]}>
                  {isExpanded ? 'Voir moins' : 'Voir plus'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.documentMeta}>
            <View style={styles.metaRow}>
              <FontAwesome 
                name="file" 
                size={screenWidth * 0.032} 
                color={isOwn ? 'rgba(255, 255, 255, 0.8)' : theme.colors.text.secondary} 
              />
              <Text style={[styles.documentType, isOwn && styles.ownDocumentType]} numberOfLines={1}>
                {fileTypeLabel}
              </Text>
            </View>
            
            <View style={styles.metaRow}>
              <FontAwesome 
                name="hdd-o" 
                size={screenWidth * 0.032} 
                color={isOwn ? 'rgba(255, 255, 255, 0.8)' : theme.colors.text.secondary} 
              />
              <Text style={[styles.documentSize, isOwn && styles.ownDocumentSize]} numberOfLines={1}>
                {fileSize}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {fileExtension && (
            <View style={[styles.extensionBadge, isOwn && styles.ownExtensionBadge]}>
              <Text style={[styles.extensionText, isOwn && styles.ownExtensionText]}>
                {fileExtension}
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.downloadButton, isOwn && styles.ownDownloadButton]}
            onPress={handleDownload}
            activeOpacity={0.7}
          >
            <FontAwesome 
              name="download" 
              size={screenWidth * 0.045} 
              color={isOwn ? '#FFFFFF' : theme.colors.primary.main} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    padding: screenWidth * 0.03, // 3% of screen width
    marginVertical: theme.spacing.xs,
    maxWidth: MAX_CARD_WIDTH,
    minWidth: MIN_CARD_WIDTH, // Ensure minimum width for content
    alignSelf: 'flex-start', // Don't stretch to full width
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    // Let container height adapt to content
    flexShrink: 0,
  },
  ownContainer: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    flexWrap: 'nowrap', // Prevent wrapping
  },
  iconContainer: {
    width: 50, // Fixed reasonable size
    minHeight: 50, // Minimum height but can grow
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: screenWidth * 0.025, // 2.5% margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    flexShrink: 0, // Never shrink
    alignSelf: 'flex-start', // Align to top
  },
  ownIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  nameContainer: {
    width: '100%',
    flexShrink: 1,
  },
  documentInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: screenWidth * 0.025, // 2.5% padding
    marginRight: screenWidth * 0.015, // 1.5% margin
    minWidth: 0, // Allow shrinking below minimum
    flexShrink: 1, // Can shrink
    maxWidth: '100%', // Ensure it doesn't exceed container
  },
  documentName: {
    fontSize: screenWidth * 0.042, // ~4.2% of screen width
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: screenWidth * 0.01, // 1% margin
    lineHeight: screenWidth * 0.058, // Responsive line height
    flexShrink: 1,
    includeFontPadding: false,
  },
  seeMoreButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  seeMoreText: {
    fontSize: screenWidth * 0.035,
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  ownSeeMoreText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  ownDocumentName: {
    color: '#FFFFFF',
  },
  documentMeta: {
    gap: 4,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  documentType: {
    fontSize: screenWidth * 0.035, // ~3.5% of screen width
    color: theme.colors.text.secondary,
    fontWeight: '500',
    flexShrink: 1,
  },
  ownDocumentType: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  documentSize: {
    fontSize: screenWidth * 0.035, // ~3.5% of screen width
    color: theme.colors.text.secondary,
    fontWeight: '600',
    flexShrink: 1,
  },
  ownDocumentSize: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  actionsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to top
    gap: screenWidth * 0.015, // 1.5% gap
    width: 50, // Fixed width to prevent overlap
    flexShrink: 0, // Never shrink
    marginLeft: screenWidth * 0.015, // 1.5% margin
    alignSelf: 'flex-start', // Align to top
  },
  extensionBadge: {
    backgroundColor: theme.colors.grey[200],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 30, // Fixed minimum width
    alignItems: 'center',
  },
  ownExtensionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  extensionText: {
    fontSize: screenWidth * 0.027, // ~2.7% of screen width
    fontWeight: '700',
    color: theme.colors.text.secondary,
    letterSpacing: 0.5,
  },
  ownExtensionText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  downloadButton: {
    width: 42, // Fixed size
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownDownloadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});

export default DocumentCard;
