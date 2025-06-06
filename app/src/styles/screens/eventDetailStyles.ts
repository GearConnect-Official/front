import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    gap: 4,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  eventInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures items are separated to the left and right
    alignItems: 'center', // Aligns items vertically in the center
    marginBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  reviewButton: { backgroundColor: 'black', padding: 8, borderRadius: 5 },
  reviewText: { color: 'white' },
  eventTitle: { fontSize: 20, fontWeight: 'bold' },
  eventCategory: { color: 'gray' },
  descriptionContainer: { flexDirection: 'row', marginBottom: 10 },
  eventImage: { width: 50, height: 50, borderRadius: 10, marginRight: 10 },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  aboutContainer: { flex: 1 },
  aboutTitle: { fontWeight: 'bold' },
  tagContainer: { flexDirection: 'row', marginTop: 5 },
  tag: { backgroundColor: '#ddd', padding: 5, borderRadius: 5, marginRight: 5 },
  description: { marginTop: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  mainEventImage: { width: '100%', height: 200, borderRadius: 10 },
  placeholderMainImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  detailText: { marginLeft: 5 },
  productCard: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  productImage: { width: 80, height: 80 },
  productTitle: { fontWeight: 'bold' },
  productTag: { backgroundColor: 'black', color: 'white', padding: 5 },
  productPrice: { marginTop: 5 },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  reviewUser: { 
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  reviewUserInfo: {
    flex: 1,
    marginLeft: 8,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  shareButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  reviewCard: {
    padding: 5, // reduced from 10
    borderWidth: 1,
    borderRadius: 5, // reduced from 10
    marginRight: 5, // reduced from 10
    width: 220, // added explicit width to make card smaller
    height: 150, // added height constraint
  },
  reviewAvatar: { 
    width: 30, 
    height: 30, 
    borderRadius: 15,
  },
  reviewDescription: {
    fontSize: 12,
  },
  showMoreButton: {
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  showMoreButtonText: {
    color: 'black',
    fontSize: 10,
    fontWeight: '600',
  },
  buyButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  addCalendarButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: { fontSize: 16, color: 'red' },
  goBackText: { fontSize: 16, color: 'blue', marginTop: 10 },
});
export default styles;
