import React, { useState } from 'react'
import { View } from 'react-native'
import { Input, Button, Header } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Signin = ({ navigation, back }) => {
    const [elevation, setElevation] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signin = () => {
        if (email == '' || password == '') {
            alert('please fill all the fields');
            return;
        }
        fetch('http://192.168.43.145:5000/signin', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.errorCode == 1) {
                    alert('User not found!')
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
            })
    }
    return (
        <>
            <Header
                centerComponent={{ text: 'Sign In', style: { color: '#fff', fontSize: 20 } }}
            />
            <View
                style={{ marginTop: '50%', width: '85%', alignSelf: 'center' }}>
                <Input value={email} onChangeText={(val) => { setEmail(val) }} placeholder="Email" errorStyle={{ color: 'red' }} leftIcon={{ name: 'email' }} inputContainerStyle={{ backgroundColor: 'lightgrey', borderRadius: 5, paddingHorizontal: 5, elevation: elevation }} onFocus={() => { setElevation(10) }} />
                <Input value={password} onChangeText={(val) => { setPassword(val) }} placeholder="Password" errorStyle={{ color: 'red' }} leftIcon={{ name: 'lock' }} inputContainerStyle={{ backgroundColor: 'lightgrey', borderRadius: 5, paddingHorizontal: 5, elevation: elevation }} secureTextEntry={true} />
                <Button title="Sign In" onPress={() => { signin(); }} />
                <Button title="Don't have an account? Sign Up here" type="clear" onPress={() => { navigation.navigate("Signup") }} />
            </View>
        </>
    )
}

export default Signin