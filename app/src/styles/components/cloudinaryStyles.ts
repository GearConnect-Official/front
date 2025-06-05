import { StyleSheet } from 'react-native';

export const cloudinaryImageStyles = StyleSheet.create({
  avatar: {
    borderRadius: 25,
  },
  thumbnail: {
    borderRadius: 8,
  },
  heroImage: {
    width: '100%',
    borderRadius: 12,
  },
});

export const cloudinaryImageUploadStyles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    color: '#FF3B30',
    fontSize: 14,
  },
  previewContainer: {
    marginTop: 16,
  },
  imagePreview: {
    position: 'relative',
    marginRight: 12,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitText: {
    marginTop: 8,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export const cloudinaryVideoUploadStyles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    color: '#FF3B30',
    fontSize: 14,
  },
  previewContainer: {
    marginTop: 16,
  },
  videoPreview: {
    position: 'relative',
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewVideo: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  videoDuration: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  videoSize: {
    color: 'white',
    fontSize: 9,
    marginTop: 1,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitText: {
    marginTop: 8,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
}); 