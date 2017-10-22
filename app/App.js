/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, WebView, } from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
  'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {

  constructor() {
    super();
    this.state = {
      message: ''
    }
  }


  render() {
    const patchPostMessageFunction = function() {
      var originalPostMessage = window.postMessage;

      var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
      };

      patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
      };

      window.postMessage = patchedPostMessage;
    };

    const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

    const webSource = require('./html/index.html');
    return (
      <View style={styles.container}>
        <WebView
          source={webSource}
          style={{flex: 1}}
          injectedJavaScript={patchPostMessageJsCode}
          onMessage={(value) => {
            this.setState({
              message: value.nativeEvent.data
            });
          }}
          onLoad={() => {
            console.log('load --------- done');
          }}
          onError={(err) => {
            console.log('error :', err);
          }}
        />
        <View style={styles.viewArea}>
          <Text>
            View Area
          </Text>

          <View>
            <Text>Value: {this.state.message}</Text>
          </View>

        </View>
        <Text style={styles.instructions}>
          footer
        </Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 20,
      },
      android: {
        marginTop: 0
      }
    }),
  },
  viewArea: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
