import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Location from './src/pages/Location';
import {enableLatestRenderer} from 'react-native-maps';
import BiometricModal from './src/components/BiometricModel';

function App(): JSX.Element {
  enableLatestRenderer();
  const isDarkMode = useColorScheme() === 'dark';
  const [showModal, setShowModal] = useState(true);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <BiometricModal
        visible={showModal}
        closeModal={() => {
          console.log('closeMOdal');
          setShowModal(false);
        }}
      />
      <Location />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
