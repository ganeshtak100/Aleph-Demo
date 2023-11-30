import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  stationButton: {
    borderWidth: 2,
    borderColor: 'green',
    alignItems: 'center',
    padding: 5,
    height: 120,
    width: 300,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 8,
  },
  listStores: {
    marginBottom: 50,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  stationIcon: {
    width: 50,
    height: 50,
  },
  stationName: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '600',
    fontSize: 16,
    paddingTop: 10,
    color: '#000',
  },
  mapView: {
    flex: 1,
    width: '100%',
  },
});
