import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Input, Icon, Button, Header } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = ({ navigation }) => {
    const [elevation, setElevation] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signup = () => {
        if (name == '' || email == '' || password == '') {
            alert('please fill all the fields');
            return;
        }
        fetch('http://192.168.43.145:5000/signup', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.errorCode == 1) {
                    alert('User already exists!')
                    return;
                }
                const storeData = async (valueTkn, valueId) => {
                    try {
                        const jsonTkn = valueTkn
                        const jsonId = valueId
                        await AsyncStorage.setItem('@userToken', jsonTkn);
                        await AsyncStorage.setItem('@userId', jsonId);
                        navigation.navigate("Home");
                    } catch (e) {
                        // saving error
                    }
                }
                storeData(data.token, data._id);
            }).catch(err => {
                alert('error')
                console.log(err);
            })
    }

    return (
        <>
            <Header
                // leftComponent={{ icon: 'menu', color: '#fff', iconStyle: { color: '#fff' } }}
                centerComponent={{ text: 'Sign Up', style: { color: 'white', fontSize: 20, fontWeight: 'bold' } }}
            // rightComponent={{ icon: 'home', color: '#fff' }}
            />
            <View style={{ marginTop: '50%', width: '85%', alignSelf: 'center' }}>
                <Input value={name} onChangeText={(val) => { setName(val) }} placeholder="Name" errorStyle={{ color: 'red' }} leftIcon={{ name: 'people' }} inputContainerStyle={{ backgroundColor: 'lightgrey', borderRadius: 5, paddingHorizontal: 5, elevation: elevation }} onFocus={() => { setElevation(10) }} />
                <Input value={email} onChangeText={(val) => { setEmail(val) }} placeholder="Email" errorStyle={{ color: 'red' }} leftIcon={{ name: 'email' }} inputContainerStyle={{ backgroundColor: 'lightgrey', borderRadius: 5, paddingHorizontal: 5, elevation: elevation }} onFocus={() => { setElevation(10) }} />
                <Input value={password} onChangeText={(val) => { setPassword(val) }} placeholder="Password" errorStyle={{ color: 'red' }} leftIcon={{ name: 'lock' }} inputContainerStyle={{ backgroundColor: 'lightgrey', borderRadius: 5, paddingHorizontal: 5, elevation: elevation }} secureTextEntry={true} onFocus={() => { console.log('focused'); setElevation(10) }} />
                <Button title="Sign Up" onPress={() => { signup() }} />
                <Button title="Already have an account? Sign in here" type="clear" onPress={() => { navigation.navigate("Signin"); }} />
            </View>
        </>
    )
}

export default Signup
