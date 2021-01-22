import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { ThemeProps, ThemeContext, Text, ListItem, Button, Input, CheckBox } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import globalStyles from '../globalStyles';
import { useBluetoothContext } from '../libs/context';
import { BleError, Device } from 'react-native-ble-plx';
import { useLoading } from '../hooks/useLoading';
import { onError } from '../libs/error';
import { API } from 'aws-amplify';
import { useSelectItemKeyboardAvoidingOverlay } from '../hooks/useSelectItemKeyboardAvoidingOverlay';
import { getInfoFromRssi } from '../libs/signalColor';
import { validateName } from '../libs/validation';
import Geolocation from '@react-native-community/geolocation';
import { BottleRequest } from '../libs/types';

export default function Discover() {
  const { theme } = useContext(ThemeContext);
  const manager = useBluetoothContext();
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentDevice, setCurrentDevice, SelectItemKeyboardAvoidingOverlay] = useSelectItemKeyboardAvoidingOverlay<Device>();
  const [isLoading, load] = useLoading();
  const [nameFieldsVisible, setNameFieldsVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [confirmBottle, setConfirmBottle] = useState(false);

  useFocusEffect(
    useCallback(() => {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          onError(error.reason);
        }

        if (device !== null) {
          setDevices(prevDevices => prevDevices.findIndex(dev => dev.id === device.id) === -1 ? [...prevDevices, device]: prevDevices);
        }
      });

      return () => setDevices([]);
    }, [])
  );

  const createBottle = (bottle: BottleRequest) => API.post("bottles", "/bottles", {
    body: bottle
  });

  async function onPress() {
    await load(
      currentDevice ? currentDevice.connect().then(
        () => setNameFieldsVisible(true),
        error => onError(error)
      ) : new Promise(reject => reject(new Error('Current device is null')))
    );
  }

  function validateForm() {
    return validateName(newName) && confirmBottle;
  }

  function handleNewName() {
    Geolocation.getCurrentPosition(async (position) => await load(
      createBottle({
        bottleName: newName,
        lastSeenLocation: position,
        ...(Platform.OS === 'ios' ? { BD_UUID: currentDevice?.id } : { BD_ADDR: currentDevice?.id }),
      })
    ));
  }

  const renderItem = ({ item }: { item: Device }) => (
    <ListItem onPress={() => setCurrentDevice(item)} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.localName || item.name || "Unknown Device"}</ListItem.Title>
        <ListItem.Subtitle>{item.id}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <SafeAreaView style={globalStyles.AndroidSafeArea}>
      {devices.length ? (
        <>
          <SelectItemKeyboardAvoidingOverlay
            animationType='fade'
            onBackdropPress={() => {
              setNameFieldsVisible(false);
              setNewName('');
              setConfirmBottle(false);
            }}
          >
            <KeyboardAvoidingView style={[globalStyles.Centered, globalStyles.OverlayDimensions]} behavior='position'>
              <ScrollView style={globalStyles.Overlay} contentContainerStyle={[globalStyles.ScrollContent, styles.scrollContent]}>
                <Text style={globalStyles.OverlayText}>
                  <Text style={globalStyles.OverlayBoldText}>Name: </Text>{currentDevice?.name}{'\n'}
                  <Text style={globalStyles.OverlayBoldText}>{Platform.OS === 'ios' ? 'UUID' : 'MAC Address'}: </Text>{currentDevice?.id}{'\n'}
                  <Text style={{ color: getInfoFromRssi(currentDevice?.rssi).color }}>
                    <Text style={globalStyles.OverlayBoldText}>Signal Strength:</Text> {getInfoFromRssi(currentDevice?.rssi).strength}
                  </Text>
                </Text>
                <Button 
                  title="Connect"
                  loading={isLoading}
                  onPress={onPress}
                  buttonStyle={styles.button}
                />
                {nameFieldsVisible && (
                  <>
                    <Input
                      label="Please enter a name for your new bottle."
                      onChangeText={e => setNewName(e)}
                      onSubmitEditing={() => validateForm() && handleNewName()}
                      labelStyle={styles.label}
                    />
                    <CheckBox
                      title="This is a water bottle."
                      checked={confirmBottle}
                      onPress={() => setConfirmBottle(confirmBottle => !confirmBottle)}
                    />
                    <Button
                      title="Save"
                      disabled={!validateForm()}
                      onPress={handleNewName}
                      buttonStyle={styles.button}
                    />
                  </>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </SelectItemKeyboardAvoidingOverlay>
          <FlatList
            data={devices}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </>
      ) : (
        <View style={globalStyles.Centered}>
          <Text style={{ color: theme.colors?.grey3 }}>
            No bottles available.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
  label: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
  scrollContent: {
    alignItems: 'center',
  },
});
