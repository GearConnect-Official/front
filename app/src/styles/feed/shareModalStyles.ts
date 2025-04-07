import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 40,
    minHeight: '45%'
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDB',
    paddingBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  optionsList: {
    marginTop: 20,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  shareOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  shareOptionText: {
    fontSize: 15,
    color: '#262626',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 16,
  },
  contactsList: {
    paddingHorizontal: 8,
  },
  contactItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 65,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 6,
  },
  contactName: {
    fontSize: 12,
    color: '#262626',
    textAlign: 'center',
  },
}); 