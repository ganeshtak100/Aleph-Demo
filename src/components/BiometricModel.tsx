import {View, Alert, Modal} from 'react-native';
import React, {useEffect} from 'react';
import TouchID from 'react-native-touch-id';

type IModalProps = {
  visible: boolean;
  closeModal(): void;
};
const BiometricModal = ({visible = false, closeModal}: IModalProps) => {
  useEffect(() => {
    handleAuth();
  }, []);

  const optionalConfigObject = {
    title: 'Please Authenticate',
    imageColor: '#000',
    imageErrorColor: '#ff0000',
    sensorDescription: 'Slightly Touch sensor',
    sensorErrorDescription: 'Failed',
    cancelText: 'Cancel',
    fallbackLabel: 'Show Passcode',
    unifiedErrors: false,
    passcodeFallback: false,
  };

  const handleAuth = () => {
    TouchID.isSupported().then(biometryType => {
      if (biometryType === 'FaceID') {
        TouchID.authenticate('', optionalConfigObject)
          .then((success: any) => {
            closeModal();
            Alert.alert('Authenticated Successfully');
          })
          .catch((error: any) => {
            handleAuth();
          });
      } else {
        TouchID.authenticate('', optionalConfigObject)
          .then((success: any) => {
            closeModal();
            Alert.alert('Authenticated Successfully');
          })
          .catch((error: any) => {
            handleAuth();
          });
      }
    });
  };

  return (
    <View
      style={{
        zIndex: 1000,
        backgroundColor: '#FFF',
        opacity: 0.6,
      }}>
      <Modal
        visible={visible}
        onDismiss={closeModal}
        transparent={true}
        style={{position: 'absolute'}}></Modal>
    </View>
  );
};

export default BiometricModal;
