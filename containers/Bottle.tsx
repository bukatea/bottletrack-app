import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { ThemeProps, ThemeContext, Text } from 'react-native-elements';
import globalStyles from '../globalStyles';
import { useRoute, RouteProp } from '@react-navigation/native';
import { API } from 'aws-amplify';
import { Bottle } from '../libs/types';
import { onError } from '../libs/error';
import { RootStackParamList } from '../libs/types';

export default function BottleScreen() {
  const { theme } = useContext(ThemeContext);
  const route = useRoute<RouteProp<RootStackParamList, 'Bottle'>>();
  const [bottle, setBottle] = useState<Bottle | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const bottle: Bottle = await loadBottle();
        setBottle(bottle);
      } catch (e) {
        onError(e);
      }
    })();
  });

  const loadBottle = () => API.get("bottles", `/bottles/${encodeURIComponent(route.params.bottleName)}`, {});

  return (
    <SafeAreaView style={[globalStyles.AndroidSafeArea, globalStyles.Centered]}>
      {bottle && (
        <>
          <Text>
            Address: {bottle.BD_ADDR.S}
          </Text>
          <Text>
            Created at: {new Date(parseFloat(bottle.createdAt.N) * 1000).toLocaleString("en-US")}
          </Text>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
});
