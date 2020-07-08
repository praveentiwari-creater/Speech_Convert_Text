import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableHighlight,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Animated
} from 'react-native';
// import Voice from 'react-native-voice';
import Voice from '@react-native-community/voice';

class App extends Component {
  state = {
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
    showMe: false,
    recording:false,
    text:''
  };

  constructor(props) {
    super(props);
    //Setting callbacks for the process status
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
  }



  componentWillUnmount() {
    //destroy the process after switching the screen 
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart = e => {
    //Invoked when .start() is called without error
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
      recording:true
    });
  };

  onSpeechEnd = e => {
    //Invoked when SpeechRecognizer stops recognition
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: '√',
      showMe:false
    });
  };

  onSpeechError = e => {
    //Invoked when an error occurs. 
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = e => {
    //Invoked when SpeechRecognizer is finished recognizing
    console.log('onSpeechResults: ', e);
    this.setState({
      results: e.value,
    });
  };

  onSpeechPartialResults = e => {
    //Invoked when any results are computed
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechVolumeChanged = e => {
    //Invoked when pitch that is recognized changed
    console.log('onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });

    console.log("praveen testing", this.state.pitch)
  };

  _startRecognizing = async (res) => {
    //Starts listening for speech for a specific locale
    console.log("namemmmmm", res)
    // console.log(res.target)
    this.setState({
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    
    });

    try {
      await Voice.start('en-US');
    } catch (e) {
      //eslint-disable-next-line
      console.error("error of startrecognizing", e);
    }
  };

  _stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance

    try {
      await Voice.destroy();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
    this.setState({
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
        <View style={styles.container}>

       
          <Modal animated
            animationType="fade"
            transparent
            visible={this.state.showMe}
            onRequestClose={() => console.warn('this is close request')}>
            <View style={{flex:1,justifyContent:'flex-end'}}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.modal}>

                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 70 }}>
                  <TouchableOpacity onPress={this._startRecognizing}>
                    <Image
                      style={{ width: 50, height: 50, alignItems: 'center' }}
                      source={require('./ICONS/mike.png')}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{marginTop:30}}>
{this.state.recording==true ? null :
               
                <ActivityIndicator size="large" color="#0000ff"/>
              
  }
    </View>
                <View>
                
                <ScrollView>
            {this.state.partialResults.map((result, index) => {
              return (
                <Text
                  key={`partial-result-${index}`}
                  style={{
                    textAlign: 'center',
                    color: 'black',
                    marginTop: 100,
                    fontWeight: '700',
                    fontSize:17
                  }}>
                  {result}
                </Text>
              );
            })}
          </ScrollView>
                </View>
                <View style={{flex:1,justifyContent:'flex-end'}}>
   <TouchableOpacity onPress={()=>this.setState({showMe:false})}>
                <Text style={{fontSize:15,color:'blue'}}>cancel</Text>
                </TouchableOpacity>
</View>

              </View>
              </View>
              </View>
          </Modal>
         
<View style={{height:60,width:'98%',borderWidth:1,borderColor:'black',borderRadius:30,marginTop:5,flexDirection:'row'}}>
<View style={{width:"75%" ,justifyContent:'flex-start'}}>
{this.state.results.map((result, index) => {
              return (
                // <Text key={`result-${index}`} style={[styles.stat,{fontSize:18}]}>
                //   {result}
                // </Text>
                
                <TextInput
                value={result}
                style={{marginTop:5,fontSize:19}}
                onChangeText={(text)=>this.setState({text})}
                />
              );
            })}
            </View>
<View style={{ marginRight:20,marginTop:15 ,width:'25%',flexDirection:'row',justifyContent:'space-between'}}>
<Image
                      style={{ width: 30, height: 30,marginLeft:8 }}
                      source={require('./ICONS/search_black.png')}
                    />
                  <TouchableOpacity  onPress={()=>{this.setState({showMe:true}) ,this._startRecognizing()}}>
                    <Image
                      style={{ width: 30, height: 30,marginRight:8 }}
                      source={require('./ICONS/mike1.png')}
                    />
                  </TouchableOpacity>
                </View>
</View>
         

        
        </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    // backgroundColor:'red'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    paddingVertical: 8,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
    marginTop: 18,
  },
  modal: {
    height: 350,
    width: '97%',
    backgroundColor: '#d6d6c2',
    marginTop: 5,
    borderRadius: 10,
   

  },
});
export default App;