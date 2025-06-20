import React, {useState} from 'react';
import {
  Text,
  Image,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const imageWidth = Dimensions.get('window').width;

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        await auth().signInWithEmailAndPassword(email, password);
        console.log('User logged in successfully!');
      } else {
        await auth().createUserWithEmailAndPassword(email, password);
        console.log('User created successfully!');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/images/mask_group_up.png')} />
      <View>
        <Text style={styles.heading}>{isLogin ? 'Welcome' : 'Create Account'}</Text>
      </View>
      <View style={styles.allelements}>
        <TextInput
          style={styles.email}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
        />
        <TextInput
          style={styles.password}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
        />
        {isLogin && <Text style={styles.normtext}>Forgot your password?</Text>}
        <TouchableOpacity
          style={styles.loginbtn}
          onPress={handleAuthentication}>
          <Text style={styles.loginbtntext}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={{marginTop: 20}}>
            <Text style={styles.normtext}>{isLogin ? "Don't have an account?" : "Already have an account?"}</Text>
            <Text style={{fontWeight: 'bold', color: '#8D8D8D'}}> {isLogin ? 'sign up' : 'login'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottom}>
        <Image
          style={styles.imageBottom}
          source={require('../assets/images/mask_group_down.png')}
        />
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  heading: {
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    color: '#23233C',
  },
  allelements: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  email: {
    width: 336,
    height: 54,
    borderRadius: 5,
    backgroundColor: 'white',
    fontSize: 14,
    color: '#23233C',
    shadowColor: '#0D4E81',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 5,
    paddingLeft: 20,
  },
  password: {
    marginTop: 30,
    width: 336,
    height: 54,
    borderRadius: 5,
    backgroundColor: 'white',
    fontSize: 14,
    color: '#23233C',
    shadowColor: '#0D4E81',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 5,
    paddingLeft: 20,
  },
  normtext: {
    marginTop: 20,
    fontSize: 13,
    color: '#8D8D8D',
  },
  loginbtn: {
    marginTop: 20,
    backgroundColor: '#23233C',
    width: 333,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginbtntext: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageBottom: {
    width: imageWidth,
    position: 'absolute',
    bottom: 0,
  },
});
