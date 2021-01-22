import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, SafeAreaView, Text, SectionList, SectionListData, View, Platform, SectionListProps } from 'react-native';
import { ThemeProps, ThemeContext, SearchBar, ListItem, Overlay, Button } from 'react-native-elements';
import globalStyles from '../globalStyles';
import withDismissKeyboard from '../components/higherOrder/withDismissKeyboard';
import { useAppContext, useBluetoothContext } from '../libs/context';
import { useLoading } from '../hooks/useLoading';
import { API } from 'aws-amplify';
import { onError } from '../libs/error';
import { BottleResponse } from '../libs/types';
import { useNavigation } from '@react-navigation/native';
import { useSelectItemOverlay } from '../hooks/useSelectItemOverlay';
import { MandateProps } from '../libs/typeUtility';

const DismissKeyboardSafeAreaView = withDismissKeyboard(SafeAreaView);

type Section = SectionListData<BottleResponse>;

export default function Bottles() {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, load] = useLoading();
  const navigation = useNavigation();
  const manager = useBluetoothContext();
  const [currentBottle, setCurrentBottle, SelectItemOverlay] = useSelectItemOverlay<BottleResponse>();

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const sections: Section[] = await load(
          loadBottles().then(
            (bottles: BottleResponse[]) => bottles.filter(value => Platform.OS === 'ios' ? value.BD_UUID : value.BD_ADDR)
          ).then((bottles: BottleResponse[]) => {
            let ids = bottles.map(value => Platform.OS === 'ios' ? value.BD_UUID?.S : value.BD_ADDR?.S);
            const connected = {
              title: 'Connected',
              data: new Array<BottleResponse>()
            };

            manager.startDeviceScan(null, null, async (error, device) => {
              if (error) {
                onError(error.reason);
              }

              let i = device ? ids.indexOf(device.id) : -1;
              if (device && i !== -1) {
                await device.connect().then(
                  () => {
                    ids.splice(i, 1);
                    bottles.splice(i, 1);
                    connected.data.push(bottles[i]);
                  },
                  error => onError(error)
                );
              }
              if (ids.length === 0) {
                manager.stopDeviceScan();
              }
            });

            return [
              connected,
              {
                title: 'Disconnected',
                data: bottles
              }
            ];
          })
        );
        setSections(sections);
      } catch (e) {
        onError(e);
      }
    })();
  }, [isAuthenticated]);

  function onChangeText(event: string) {
    setSearch(event);


  }

  const loadBottles = () => API.get("bottles", "/bottles", {});

  const renderItem = ({ item }: { item: BottleResponse }) => (
    <ListItem onPress={() => setCurrentBottle(item)} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.bottleName.S}</ListItem.Title>
        <ListItem.Subtitle>{Platform.OS === 'ios' ? item.BD_UUID?.S : item.BD_ADDR?.S}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  const renderSectionHeader = ({ section: { title } }: { section: Section }) => (
    <ListItem containerStyle={[styles.section, title === 'Disconnected' && { backgroundColor: theme.colors?.disabled }]} bottomDivider>
      <ListItem.Content style={styles.sectionContent}>
        <ListItem.Title style={styles.sectionTitle}>{title}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );

  function renderBottlesList(sections: Section[]) {
    return (
      <SectionList
        sections={sections}
        keyExtractor={item => item.bottleName.S}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    );
  }

  async function onPress() {
    await load(new Promise((resolve, reject) => {
      manager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          onError(error.reason);
          reject(error);
        }

        if (device && device.id === (Platform.OS === 'ios' ? currentBottle?.BD_UUID?.S : currentBottle?.BD_ADDR?.S)) {
          manager.stopDeviceScan();
          await device.connect().then(
            () => setSections(prevSections => [
              {
                title: 'Connected',
                data: prevSections[0].data.filter(value => (Platform.OS === 'ios' ? value.BD_UUID?.S : value.BD_ADDR?.S) !== (Platform.OS === 'ios' ? currentBottle?.BD_UUID?.S : currentBottle?.BD_ADDR?.S))
              },
              {
                title: 'Disconnected',
                data: prevSections[1].data.concat(currentBottle as BottleResponse)
              }
            ]),
            error => {
              onError(error);
              reject(error);
            }
          )
          resolve();
        }
      })
    }))
  }

  return (
    <DismissKeyboardSafeAreaView style={globalStyles.AndroidSafeArea}>
      <SearchBar
        value={search}
        onChangeText={e => setSearch(e)}
      />
      <SelectItemOverlay
        animationType='fade'
        overlayStyle={[globalStyles.Overlay, globalStyles.Centered, globalStyles.OverlayDimensions]}
      >
        <>
          <Text style={globalStyles.OverlayText}>
            <Text style={globalStyles.OverlayBoldText}>Name: </Text>{currentBottle?.bottleName.S}{'\n'}
            <Text style={globalStyles.OverlayBoldText}>{Platform.OS === 'ios' ? 'UUID' : 'MAC Address'}: </Text>
              {Platform.OS === 'ios' ? currentBottle?.BD_UUID?.S : currentBottle?.BD_ADDR?.S}{'\n'}
            <Text style={globalStyles.OverlayBoldText}>Created at: </Text>
              {new Date(parseFloat(currentBottle?.createdAt.N || "") * 1000).toLocaleString("en-US")}{'\n'}
            <Text style={globalStyles.OverlayBoldText}>Last seen at: </Text>
              {currentBottle?.lastSeenLocation.M.coords.M?.latitude.N} {currentBottle?.lastSeenLocation.M.coords.M?.longitude.N}
          </Text>
          <Button
            title="Connect"
            disabled={currentBottle && sections[0].data.includes(currentBottle) || Platform.OS === 'ios' ? !currentBottle?.BD_UUID : !currentBottle?.BD_ADDR}
            loading={isLoading}
            onPress={onPress}
            buttonStyle={styles.button}
          />
        </>
      </SelectItemOverlay>
      {!isLoading && renderBottlesList(sections)}
    </DismissKeyboardSafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 0,
  },
  sectionContent: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
  },
  button: {
    marginTop: 20,
  },
});
