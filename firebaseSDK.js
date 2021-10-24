import firebase from 'firebase';

class FirebaseSDk {

    //Initiate communication with firebase
    constructor(){
        if(!firebase.apps.length){
            firebase.initializeApp({
                apiKey: "AIzaSyCgmr3BjFCqMv6RQ3Nag60IFRSv4WRj5uA",
                authDomain: "dessert-e627c.firebaseapp.com",
                databaseURL: "https://dessert-e627c-default-rtdb.asia-southeast1.firebasedatabase.app",
                projectId: "dessert-e627c",
                storageBucket: "dessert-e627c.appspot.com",
                messagingSenderId: "543383713973",
                appId: "1:543383713973:web:d0274896cafeaee1a526fc",
                measurementId: "G-0LJNH5E3LR"
            })
        }
    }

    addData = (ref, object) => {
        firebase.database().ref(ref).set(object)
    }

    update = (ref, object) => {
        firebase.database().ref(ref).update(object)
    }

    queryData = (ref, child, query, setState) => {
        let object = []
        if(query != null){
            firebase.database().ref(ref).orderByChild(child).equalTo(query).on('value', (snapshot) => {
                if(snapshot.val() === null){
                    return false;
                }else {
                // console.log(snapshot.val());
                    object = Object.keys(snapshot.val()).map((key) => snapshot.val()[key]);
                // console.log(object[0].name)
                    //console.log(object)
                    if(setState != null){
                        setState(object)
                    }
            }
            
            });
        }
        else{
            firebase.database().ref(ref).on('value', (snapshot) => {
                if(snapshot.val() === null){
                    return false;
                }
                else {
                   // console.log(snapshot.val());
                    object = Object.keys(snapshot.val()).map((key) => snapshot.val()[key]);
                   // console.log(object[0].name)
                    //console.log(object)
                    if(setState != null){
                        setState(object)
                    }
               }
               
            });
        }
        return object;
    }

    queryRange = (ref, child, start, end, setState) => {
        let object = []
        firebase.database().ref(ref).orderByChild(child).startAt(start).endAt(end).on('value', (snapshot) => {
            if(snapshot.val() === null){
                return false;
            }else {
                object = Object.keys(snapshot.val()).map((key) => snapshot.val()[key]);
                if(setState != null){
                    setState(object)
                }
            }
            
            });
        return object;
    }

    readData = (ref, setState) => {
        let object = []
        firebase.database().ref(ref).on('value', (snapshot) => {
            if(snapshot.val() === null){
                return false;
            }
            else {
               // console.log(snapshot.val())
                object =  Object.keys(snapshot.val()).map((key) => snapshot.val()[key])
               // console.log(object[0].name)
                // console.log(object)
                if(setState != null){
                    setState(object)
                }
           }
           
        });
        return object;
    }

    removeData = (ref) => {
        firebase.database().ref(ref).remove();
    }
}
firebase.auth.EmailAuthProvider()

const firebaseSDK = new FirebaseSDk();
export default firebaseSDK;