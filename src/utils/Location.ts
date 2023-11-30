import {Platform, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import GeolocationIos from '@react-native-community/geolocation';
import GeolocationAndroid from 'react-native-geolocation-service';
import {promptForEnableLocationIfNeeded} from 'react-native-android-location-enabler';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';

const Geolocations = Platform.select({
  ios: GeolocationIos,
  android: GeolocationAndroid,
});

export const already_enabled = 'already-enabled';
export const enabled = 'enabled';
const denied = 'denied';
const granted = 'granted';

function enableLocation(callback) {
  if (Platform.OS == 'android') {
    try {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(async res => {
        console.log('android ACCESS_FINE_LOCATION', res);

        if (res == granted) {
          try {
            const enableResult = await promptForEnableLocationIfNeeded();
            console.log('enableResult', enableResult);
            if (enableResult) {
              callback(enableResult);
            }
          } catch (err) {
            console.log('promt catch err', err);

            callback(err);
          }
        }
      });
    } catch (e) {
      console.log('android ACCESS_FINE_LOCATION error', e);

      callback(e);
    }
  }
}

export const getCurrentLatLng = async callBack => {
  const status = await checkLocationPermission();
  if (status == -1) {
    handleLocationBlockCase();
    return;
  }

  if (status == true) {
    getPosition(coords => {
      if (coords) {
        callBack &&
          callBack({
            lat: coords.coords.latitude,
            lng: coords.coords.longitude,
          });
        return;
      }
      callBack && callBack(false);
      return;
    });
  } else {
    requestForLocationPermission(() => {
      getPosition(coords => {
        if (coords) {
          //callBack && callBack({ lat: -29.730959482113168, lng: 31.085299340895723 });
          callBack &&
            callBack({
              lat: coords.coords.latitude,
              lng: coords.coords.longitude,
            });
          return;
        }
        callBack && callBack(false);
        return;
      });
    });
  }
};

export const requestForLocationPermission = async callBack => {
  if (Platform.OS == 'ios') {
    const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    if (status == RESULTS.GRANTED) {
      callBack && callBack(true);
    }
  } else {
    const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (status == RESULTS.GRANTED) {
      callBack && callBack();
    }
  }
};

export const checkLocationPermission = async () => {
  if (Platform.OS == 'ios') {
    const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    if (result == RESULTS.GRANTED) {
      return true;
    }
    if (result == RESULTS.BLOCKED) {
      return -1;
    }
  } else {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (result == RESULTS.GRANTED) {
      return true;
    }
    if (result == RESULTS.BLOCKED) {
      return -1;
    }
  }
};

const getPosition = callBack => {
  if (Platform.OS == 'android') {
    enableLocation(respose => {
      console.log('enable location status', respose);
      if (respose == enabled || respose == already_enabled) {
        Geolocations.getCurrentPosition(
          // success callBack
          coords => {
            console.log('location coords', coords);
            callBack && callBack(coords);
          },
          // error callBack
          error => {
            console.log('location coords error', error);

            callBack && callBack(false);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 5000,
          },
        );
      } else {
        console.log('callback  false');

        callBack && callBack(false);
      }
    });
  } else {
    Geolocations.getCurrentPosition(
      // success callBack
      coords => {
        callBack && callBack(coords);
      },
      // error callBack
      () => {
        callBack && callBack(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
      },
    );
  }
};

export const handleLocationBlockCase = () => {
  Alert.alert(
    'Permission Blocked',
    'open setting and provide permission for location',
    [
      {
        text: 'Cancel',

        style: 'cancel',
      },
      {text: 'Open Settings', onPress: () => openSettings()},
    ],
    {cancelable: false},
  );
};

export const watchLocation = async callBack => {
  const watchId = Geolocation.watchPosition(
    position => {
      const {latitude, longitude} = position.coords;
      callBack({
        lat: latitude,
        lng: longitude,
      });
      console.log('0-0-0-0-0watch coodinates0-0-0-0-0-0-', latitude, latitude);
    },
    error => {
      console.log('Error watching location:', error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 10,
      interval: 5000,
      fastestInterval: 2000,
      showLocationDialog: true,
    },
  );
};
