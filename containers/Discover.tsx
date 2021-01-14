import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Platform, Modal, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { ThemeProps, ThemeContext, Text, ListItem, Button, Input } from 'react-native-elements';
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

export default function Discover() {
  const { theme } = useContext(ThemeContext);
  const manager = useBluetoothContext();
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentDevice, setCurrentDevice, SelectItemKeyboardAvoidingOverlay] = useSelectItemKeyboardAvoidingOverlay<Device>();
  const [isLoading, load] = useLoading();
  const [nameFieldsVisible, setNameFieldsVisible] = useState(false);
  const [newName, setNewName] = useState("");

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

  const createBottle = bottle => API.post("bottles", "/bottles", {
    body: bottle
  });

  async function onPress(device: Device) {
    await load(
      device.connect().then(
        () => setNameFieldsVisible(true)
      ).catch(
        error => onError(error)
      )
    );
  }

  function validateForm() {
    return validateName(newName);
  }

  function handleNewName() {

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
                  onPress={() => onPress(currentDevice as Device)}
                  buttonStyle={styles.button}
                />
                {nameFieldsVisible && (
                  <>
                    <Input
                      label="Please enter a name for your new bottle."
                      value={newName}
                      onChangeText={e => setNewName(e)}
                      onSubmitEditing={() => validateForm() && handleNewName()}
                      labelStyle={styles.label}
                    />
                    <Button
                      title="Save"
                      disabled={!validateForm()}
                      onPress={handleNewName}
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
