import FirebaseConfig  from "./FirebaseConfig";
import { Alert ,Platform} from "react-native";
const API_URL = "https://fcm.googleapis.com/fcm/send";
class FirebaseClient {
  async send(body, type) {
        if(FirebaseConfig.fcmKey === 'YOUR_API_KEY'){
          Alert.alert('Set your API_KEY in app/FirebaseConstants.js')
          return;
        }
				let headers = new Headers({
					"Content-Type": "application/json",
					"Authorization": "key=" + FirebaseConfig.fcmKey
				});

			try {
				let response = await fetch(API_URL, { method: "POST", headers, body });
			//	console.log(JSON.stringify(response) );
				try{
					response = await response.json();
					if(!response.success){
						//Alert.alert('Failed to send notification')
					}
				} catch (err){
					//Alert.alert('Failed to send notification')
				}
			} catch (err) {
				//Alert.alert(err && err.message)
			}
	}
	sendRemoteMultiNotification(tokenList,bodyText){
    let body;            
    if(Platform.OS === 'android'){
      body = {
        "registration_ids": tokenList,
        "data":{
          "custom_notification": {
            "title": "CLQSIX",
            "body": bodyText,
            "sound": "default",
            "priority": "high",
            "show_in_foreground": true
          }
        },
        "priority": 10
      }
    } else {
      body = {
        "registration_ids": tokenList,
        "notification":{
          "title": "CLQSIX",
          "body": bodyText,
          "sound": "default"
        },
        "priority": 10
      }
    }

    this.send(JSON.stringify(body), "notification");
  }
	sendRemoteNotification(token,bodyText){
    let body;            
    if(Platform.OS === 'android'){
      body = {
        "to": token,
        "data":{
          "custom_notification": {
            "title": "CLQSIX",
            "body": bodyText,
            "sound": "default",
            "priority": "high",
            "show_in_foreground": true
          }
        },
        "priority": 10
      }
    } else {
      body = {
        "to": token,
        "notification":{
          "title": "CLQSIX",
          "body": bodyText,
          "sound": "default"
        },
        "priority": 10
      }
    }

    this.send(JSON.stringify(body), "notification");
  }
	

}

let firebaseClient = new FirebaseClient();
export default firebaseClient;
