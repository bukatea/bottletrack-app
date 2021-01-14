import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, SafeAreaView, Text, SectionList, SectionListData, View } from 'react-native';
import { ThemeProps, ThemeContext, SearchBar, ListItem, Overlay } from 'react-native-elements';
import globalStyles from '../globalStyles';
import withDismissKeyboard from '../components/higherOrder/withDismissKeyboard';
import { useAppContext, useBluetoothContext } from '../libs/context';
import { useLoading } from '../hooks/useLoading';
import { API } from 'aws-amplify';
import { onError } from '../libs/error';
import { Bottle } from '../libs/types';
import { useNavigation } from '@react-navigation/native';
import { useSelectItemOverlay } from '../hooks/useSelectItemOverlay';

const DismissKeyboardSafeAreaView = withDismissKeyboard(SafeAreaView);

interface Section {
  title: string;
  data: Bottle[];
}

export default function Bottles() {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState('');
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, load] = useLoading();
  const navigation = useNavigation();
  const manager = useBluetoothContext();
  const [currentBottle, setCurrentBottle, SelectItemOverlay] = useSelectItemOverlay<Bottle>();

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const bottles: Bottle[] = await load(loadBottles());
        setBottles(bottles);
      } catch (e) {
        onError(e);
      }
    })();
  }, [isAuthenticated]);

  function onChangeText(event: string) {
    setSearch(event);


  }

  const loadBottles = () => API.get("bottles", "/bottles", {});

  const renderItem = ({ item }: { item: Bottle }) => (
    <ListItem onPress={() => setCurrentBottle(item)} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.bottleName.S}</ListItem.Title>
        <ListItem.Subtitle>{item.BD_ADDR.S}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  const renderSectionHeader = ({ section: { title } }: { section: SectionListData<Bottle, { title: string, data: Bottle[] }> }) => (
    <ListItem containerStyle={[styles.section, title === 'Disconnected' && { backgroundColor: theme.colors?.disabled }]} bottomDivider>
      <ListItem.Content style={styles.sectionContent}>
        <ListItem.Title style={styles.sectionTitle}>{title}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );

  function renderBottlesList(bottles: Bottle[]) {
    return (
      <SectionList
        sections={[{ title: "Disconnected", data: bottles }]}
        keyExtractor={item => item.bottleName.S}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    );
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
          <Text style={globalStyles.OverlayText}>
            <Text style={globalStyles.OverlayBoldText}>Name: </Text>{currentBottle?.bottleName.S}{'\n'}
            <Text style={globalStyles.OverlayBoldText}>MAC Address: </Text>{currentBottle?.BD_ADDR.S}{'\n'}
            <Text style={globalStyles.OverlayBoldText}>Created at: </Text>{new Date(parseFloat(currentBottle?.createdAt.N || "") * 1000).toLocaleString("en-US")}
          </Text>
      </SelectItemOverlay>
      {!isLoading && renderBottlesList(bottles)}
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
});
