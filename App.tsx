/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  PermissionsAndroid,
  TouchableOpacity,
  Alert,
} from 'react-native';

import TorrentStreamer from 'react-native-torrent-streamer';
import {Icon} from 'react-native-elements';

const libLink =
  'magnet:?xt=urn:btih:88594aaacbde40ef3e2510c47374ec0aa396c08e&dn=bbb%5Fsunflower%5F1080p%5F30fps%5Fnormal.mp4&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&ws=http%3A%2F%2Fdistribution.bbb3d.renderfarming.net%2Fvideo%2Fmp4%2Fbbb%5Fsunflower%5F1080p%5F30fps%5Fnormal.mp4';

const myLink = 'magnet:?xt=urn:btih:2e0bc287864adcb1652be152fd2c7cebfdbc627a';

export default class App extends Component<{}> {
  state = {
    progress: 0,
    buffer: 0,
    downloadSpeed: 0,
    seeds: 0,
    selectedLink: libLink,
  };

  componentDidMount() {
    TorrentStreamer.addEventListener('error', this.onError);
    TorrentStreamer.addEventListener('status', this.onStatus.bind(this));
    TorrentStreamer.addEventListener('ready', this.onReady.bind(this));
    TorrentStreamer.addEventListener('stop', this.onStop.bind(this));
  }

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Torrent Client need to ',
          message:
            'Torrent client needs access to your storage ' +
            'so you can download and stream torrents.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted>>>>>', granted);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      Alert.alert(err);
      console.warn(err);
    }
  };

  onError(e: any) {
    console.log(e);
  }

  onStatus({progress, buffer, downloadSpeed, seeds}: any) {
    console.log(progress, buffer, downloadSpeed, seeds);

    this.setState({
      progress,
      buffer,
      downloadSpeed,
      seeds,
    });
  }

  onReady(data: {url: any}) {
    console.log(data.url);

    TorrentStreamer.open(data.url, 'video/mp4');
  }

  onStop(data: any) {
    console.log('stop');
  }

  render() {
    const {progress, buffer, downloadSpeed, seeds} = this.state;

    const _renderLink = (
      title: string,
      link: string,
      checked: boolean,
      onPress: any,
    ) => {
      return (
        <TouchableOpacity style={{flexDirection: 'row'}} onPress={onPress}>
          <Icon
            tvParallaxProperties=""
            name="check"
            type="font-awesome"
            color={checked ? '#f50' : 'white'}
            onPress={() => console.log('hello')}
          />
          <Text style={styles.link}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{title} :</Text>{' '}
            {link}
          </Text>
        </TouchableOpacity>
      );
    };

  

    return (
      <View style={styles.container}>
        <Text
          style={{
            textAlign: 'center',
            padding: 20,
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          SELECT TORRENT
        </Text>

        {_renderLink(
          'Library Link:',
          libLink,
          this.state.selectedLink === libLink,
          () => this.setState({selectedLink: libLink}),
        )}

        {_renderLink(
          'My Link:',
          myLink,
          this.state.selectedLink === myLink,
          () => this.setState({selectedLink: myLink}),
        )}

        <TouchableHighlight
          style={styles.button}
          onPress={this._handleStart.bind(this)}>
          <Text>Start Torrent!</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={this._handleStop.bind(this)}>
          <Text>Stop Torrent!</Text>
        </TouchableHighlight>

        <Text>Buffer: {buffer ? buffer : ''}</Text>

        <Text>
          Download Speed:{' '}
          {downloadSpeed ? (downloadSpeed / 1024).toFixed(2) + 'Kbs/s' : null}
        </Text>

        <Text>
          Progress:{' '}
          {progress ? parseFloat(progress.toString()).toFixed(2) + '%' : ''}
        </Text>

        {seeds ? <Text>Seeds: {seeds}</Text> : null}
      </View>
    );
  }

  _handleStart() {
    console.log('handleStart called....');
    this.requestCameraPermission();
    TorrentStreamer.start(this.state.selectedLink);
  }

  _handleStop() {
    this.setState(
      {
        progress: 0,
        buffer: 0,
        downloadSpeed: 0,
        seeds: 0,
      },
      () => {
        TorrentStreamer.stop();
      },
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: center',
    backgroundColor: '#F5FCFF',
  },
  link: {
    marginHorizontal: 20,
  },
  button: {
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    margin: 20,
  },
});
