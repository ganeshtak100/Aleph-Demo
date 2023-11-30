import {View, Text, FlatList, Animated, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getCurrentLatLng} from '../utils/Location';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {getDirections, getNearbyPetronasStations} from '../utils/helper';
import EmptyView from '../components/EmptyView';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import FastImage from 'react-native-fast-image';
import {styles} from './styles';
import AppLoader from '../components/AppLoader';
import ItemSepratorCompo from '../components/ItemSepratorCompo';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type ICoordinate = {
  lat?: number;
  lng?: number;
};

type ILocationData = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};

const Location = () => {
  const [polyLoneCoords, setPolyLineCoords] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentLocationCoords, setCurrentLocationCoords] =
    useState<ICoordinate>({});
  const [station, setStation] = useState<any>([]);
  const [polyLine, setPolyLine] = useState<boolean>(false);
  const [initialRegion] = useState<ILocationData>({
    latitude: 3.118287,
    longitude: 101.634048,
    latitudeDelta: 0.5,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getCurrentLatLng((data: any) => {
      setCurrentLocationCoords(data);
    });
  }, []);

  useEffect(() => {
    const findGasStation = async () => {
      const data = await getNearbyPetronasStations(
        currentLocationCoords.lat,
        currentLocationCoords.lng,
      );
      setStation(data.splice(0, 5));
    };
    findGasStation();
  }, []);

  const findRoute = (item: any) => {
    const latitude = item?.geometry?.location?.lat;
    const longitude = item?.geometry?.location?.lng;
    if (latitude && longitude) {
      setLoading(true);
      getDirections(
        `${currentLocationCoords.lat},${currentLocationCoords.lng}`,
        `${latitude},${longitude}`,
      )
        .then(coords => {
          console.log('direction coords0-0-', coords);
          if (coords.length > 0) {
            setPolyLineCoords(coords);
            setPolyLine(true);
          }
          setTimeout(() => {
            setLoading(false);
          }, 400);
        })
        .catch(err => {
          console.log('Something went wrong', err);
          setLoading(false);
        });
    }
  };

  const renderStation = ({item, index}: any) => {
    return (
      <TouchableOpacity
        onPress={() => findRoute(item)}
        style={styles.stationButton}>
        <FastImage
          style={styles.stationIcon}
          resizeMode={FastImage.resizeMode.contain}
          source={{uri: item.icon}}
        />
        <View>
          <Text style={styles.stationName} numberOfLines={1}>
            {item?.name}
          </Text>
          <StarRatingDisplay rating={item?.rating} starSize={20} />
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <AppLoader />;
  }
  return (
    <View style={styles.mainContainer}>
      <MapView
        initialRegion={initialRegion}
        minZoomLevel={5}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomEnabled={true}
        provider="google"
        style={styles.mapView}>
        {polyLine && polyLoneCoords.length > 0 && (
          <Polyline
            coordinates={polyLoneCoords}
            strokeWidth={6}
            strokeColor="black"
          />
        )}
        {polyLine && polyLoneCoords.length > 0 && (
          <>
            <Marker coordinate={polyLoneCoords[0]} />
            <Marker coordinate={polyLoneCoords[polyLoneCoords.length - 1]} />
          </>
        )}
        {station &&
          station?.length > 0 &&
          station.map((item: any, index: number) => (
            <Marker
              key={index}
              coordinate={{
                latitude: item?.geometry?.location?.lat,
                longitude: item?.geometry?.location?.lng,
              }}></Marker>
          ))}
      </MapView>
      <View style={styles.listStores}>
        <AnimatedFlatList
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={station}
          renderItem={renderStation}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={EmptyView}
          ItemSeparatorComponent={() => {
            return <ItemSepratorCompo width={20} />;
          }}
        />
      </View>
    </View>
  );
};

export default Location;
