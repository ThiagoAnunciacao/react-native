/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Image,
  View,
  ListView
} from 'react-native';

class AwesomeProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      user: { }
    };
  }

  componentDidMount() {
    this.fetchSignIn();
  }

  fetchSignIn() {
    fetch('http://achievemore-frontend.dev.azk.io:3001/users/sign_in', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          login: 'admin_a+',
          password: 'achievemore@123',
        }
      })
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          user: responseData.user
        });

        this.fetchUsers();
      })
      .done();
  }

  fetchUsers() {
    fetch('http://localhost:3001/api/v1/users', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-USER-LOGIN': this.state.user.login,
        'X-USER-TOKEN': this.state.user.authentication_token
      }
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.users),
          loaded: true,
        });
      })
      .done();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderUser}
        style={styles.listView}
      />
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <Image
          source={{uri: "https://angular.achievemore.com.br/assets/img/favicons/favicon-96x96.png"}}
          style={styles.logo}
        />
        <Text>
          Loading users...
        </Text>
      </View>
    );
  }

  renderUser(user) {
    var thumb = user.avatar.avatar.thumb.url
    if (thumb == null) {
      thumb = "https://angular.achievemore.com.br/assets/img/favicons/favicon-96x96.png"
    }

    console.log(thumb)

    return (
      <View style={styles.container}>
        <Image
          source={{uri: thumb}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{user.name}</Text>
          <Text style={styles.year}>{user.login}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  logo: {
    marginBottom: 20,
    width: 96,
    height: 96,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
