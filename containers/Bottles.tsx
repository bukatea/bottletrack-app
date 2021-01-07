import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, SafeAreaView, Text, SectionList, SectionListData } from 'react-native';
import { ThemeProps, ThemeContext, SearchBar, ListItem } from 'react-native-elements';
import globalStyles from '../globalStyles';
import withDismissKeyboard from '../components/higherOrder/withDismissKeyboard';
import { useAppContext } from '../libs/context';
import { useLoading } from '../hooks/useLoading';
import { API } from 'aws-amplify';
import { onError } from '../libs/error';
import { Bottle } from '../libs/types';
import { useNavigation } from '@react-navigation/native';

const DismissKeyboardSafeAreaView = withDismissKeyboard(SafeAreaView);

export default function Bottles() {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState('');
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, load] = useLoading();
  const navigation = useNavigation();

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

  const loadBottles = () => API.get("bottles", "/bottles", {});

  const renderItem = ({ item }: { item: Bottle }) => (
    <ListItem onPress={() => navigation.navigate('Bottle', { bottleName: item.bottleName.S })} bottomDivider>
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
        keyExtractor={(item: Bottle) => item.bottleName.S}
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
