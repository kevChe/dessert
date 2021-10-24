// import { createAppContainer } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
// import { createMaterialTopTabNavigator} from 'react-navigation-tabs'

// import main from './screens/main'
// import record from './screens/record'

// const mainScreen = createMaterialTopTabNavigator(
//   {
//     "收銀": {screen : main },
//     "記錄": {screen: record}
//   },
//   {
//     swipeEnabled: true,
//     animationEnabled: true,
//     tabBarOptions: {
//       activeTintColor: 'black',
//       inactiveTintColor: '#00000080',
//       style: {
//         backgroundColor: 'white',
//       },
//       labelStyle: {
//         textAlign: 'center'
//       },
//       indicatorStyle: {
//         borderBottomColor: '',
//         borderBottomWidth: 3,
//       }
//     }
//   }
// )
// const navigator = createStackNavigator(
//   {
//     mainScreen
//   },
//   {
//     initialRouteName: 'mainScreen',
//     defaultNavigationOptions: {
//       title: '甜點收銀系統',
//       headerShown: true
//     }
//   }
// );

// export default createAppContainer(navigator);

import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Picker,
  TextInput,
} from "react-native";
import {
  BLEPrinter,
  NetPrinter,
  USBPrinter,
  IUSBPrinter,
  IBLEPrinter,
  INetPrinter,
} from "react-native-thermal-receipt-printer";
import Loader from "./Loader";

const printerList: Record<string, any> = {
  ble: BLEPrinter,
  net: NetPrinter,
  usb: USBPrinter,
};

interface SelectedPrinter
  extends Partial<IUSBPrinter & IBLEPrinter & INetPrinter> {
  printerType?: keyof typeof printerList;
}

export default function App() {
  const [selectedValue, setSelectedValue] = React.useState<
    keyof typeof printerList
  >("ble");
  const [devices, setDevices] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedPrinter, setSelectedPrinter] = React.useState<SelectedPrinter>(
    {}
  );

  React.useEffect(() => {
    const getListDevices = async () => {
      const Printer = printerList[selectedValue];
      // get list device for net printers is support scanning in local ip but not recommended
      if (selectedValue === "net") return;
      try {
        setLoading(true);
        await Printer.init();
        const results = await Printer.getDeviceList();
        setDevices(
          results.map((item: any) => ({ ...item, printerType: selectedValue }))
        );
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    getListDevices();
  }, [selectedValue]);

  const handleConnectSelectedPrinter = () => {
    if (!selectedPrinter) return;
    const connect = async () => {
      try {
        setLoading(true);
        switch (selectedPrinter.printerType) {
          case "ble":
            await BLEPrinter.connectPrinter(
              selectedPrinter?.inner_mac_address || ""
            );
            break;
          case "net":
            await NetPrinter.connectPrinter(
              selectedPrinter?.host || "",
              selectedPrinter?.port || 9100
            );
            break;
          case "usb":
            await USBPrinter.connectPrinter(
              selectedPrinter?.vendor_id || "",
              selectedPrinter?.product_id || ""
            );
            break;
          default:
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    connect();
  };

  const handlePrint = async () => {
    try {
      const Printer = printerList[selectedValue];
      await Printer.printText("<C>sample text</C>\n");
    } catch (err) {
      console.warn(err);
    }
  };

  const handleChangePrinterType = async (type: keyof typeof printerList) => {
    setSelectedValue((prev) => {
      printerList[prev].closeConn();
      return type;
    });
    setSelectedPrinter({});
  };

  const handleChangeHostAndPort = (params: string) => (text: string) =>
    setSelectedPrinter((prev) => ({
      ...prev,
      device_name: "Net Printer",
      [params]: text,
      printerType: "net",
    }));

  const _renderNet = () => (
    <View style={{ paddingVertical: 16 }}>
      <View style={styles.rowDirection}>
        <Text>Host: </Text>
        <TextInput
          placeholder="192.168.100.19"
          onChangeText={handleChangeHostAndPort("host")}
        />
      </View>
      <View style={styles.rowDirection}>
        <Text>Port: </Text>
        <TextInput
          placeholder="9100"
          onChangeText={handleChangeHostAndPort("port")}
        />
      </View>
    </View>
  );

  const _renderOther = () => (
    <Picker selectedValue={selectedPrinter} onValueChange={setSelectedPrinter}>
      {devices.map((item: any, index) => (
        <Picker.Item
          label={item.device_name}
          value={item}
          key={`printer-item-${index}`}
        />
      ))}
    </Picker>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text>Select printer type: </Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleChangePrinterType}
        >
          {Object.keys(printerList).map((item, index) => (
            <Picker.Item
              label={item.toUpperCase()}
              value={item}
              key={`printer-type-item-${index}`}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.section}>
        <Text>Select printer: </Text>
        {selectedValue === "net" ? _renderNet() : _renderOther()}
      </View>
      <Button
        disabled={!selectedPrinter?.device_name}
        title="Connect"
        onPress={handleConnectSelectedPrinter}
      />
      <Button
        disabled={!selectedPrinter?.device_name}
        title="Print sample"
        onPress={handlePrint}
      />
      <Loader loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  section: {
    flex: 1,
  },
  rowDirection: {
    flexDirection: "row",
  },
});