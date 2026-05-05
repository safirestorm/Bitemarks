import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { database,app } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import {getAuth, signInWithEmailAndPassword, signOut, signInWithCredential, createUserWithEmailAndPassword} from 'firebase/auth'
import {createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'
import {initializeAuth, getReactNativePersistence, GoogleAuthProvider} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import * as LocalAuthentication from 'expo-local-authentication'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'

let auth
if(Platform.OS === 'web'){
    auth=getAuth(app)
} else {
    auth = initializeAuth(app, {
        persistence:getReactNativePersistence(ReactNativeAsyncStorage)
    })
}


WebBrowser.maybeCompleteAuthSession()

export default function LoginPage() {
const [enteredEmail, setEnteredEmail] = useState('gus@.dk')
const [enteredPassword, setEnteredPassword] = useState('1234')
const [userId, setUserId] = useState(null)
const [user, setUser] = useState(null)
const [enteredText, setenteredText] = useState("type here")
//const auth = getAuth(app) 

    return (
    <View>
        <Text
        />
    </View>
    )
}