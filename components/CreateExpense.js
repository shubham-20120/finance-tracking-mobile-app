import React, { useState } from 'react'
import { View } from 'react-native'
import { Input, Icon, Button, Header } from 'react-native-elements'
import RadioGroup, { Radio } from "react-native-radio-input";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CreateExpense = ({ navigation }) => {
    const [checked, setChecked] = useState(null);
    const [title, setTitle] = useState(null);
    const [price, setPrice] = useState(null);
    const [description, setDescription] = useState(null);
    const [loadingFlag, setLoadingFlag] = useState(false);
    const getChecked = (value) => {
        setChecked(value);
    }

    const add = async () => {
        if (title == null || title == "" || checked == null || price == null) {
            alert('Adding title is compulsory!');
            return;
        }
        var temp = await AsyncStorage.getItem("@userToken")
        fetch('http://192.168.43.145:5000/create', {
            method: 'post',
            headers: { "Content-Type": 'application/json', authorization: temp },
            body: JSON.stringify({
                title, price, transactionType: checked, description
            })
        }).then(res => res.json()).then(data => {
            setLoadingFlag(false);
            navigation.navigate("Home");
        }).catch(e => {
            alert('something went wrong!')
        })
    }

    return (
        <>
            <Header

                leftComponent={
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                        style={{ marginHorizontal: 20 }}
                    >
                        <Icon name='arrow-back-outline' type='ionicon' size={28.5} color='white' />
                    </TouchableOpacity>
                }
                centerComponent={{ text: 'Create', style: { color: 'white', fontSize: 22, fontWeight: 'bold' } }}

            />
            <View style={{ backgroundColor: '#E7E7E794', height: '100%' }}>
                <View style={{
                    marginHorizontal: 15,
                    marginTop: 25
                }}>
                    <Input
                        placeholder='Expense Title'
                        value={title}
                        onChangeText={(e) => { setTitle(e) }}
                        leftIcon={
                            <Icon
                                name='tag'
                                size={30}
                                color='black'
                            />
                        }
                        style={{
                            marginHorizontal: 8
                        }}
                    />
                </View>
                <View style={{
                    marginHorizontal: 15,
                    marginTop: 25
                }}>
                    <Input
                        keyboardType='number-pad'
                        placeholder='Expence or Income'
                        value={price}
                        onChangeText={(e) => { setPrice(e) }}
                        leftIcon={
                            <Icon
                                name='money'
                                size={30}
                                color='black'
                            />
                        }
                        style={{
                            marginHorizontal: 8
                        }}
                    />
                </View>
                <View style={{
                    marginHorizontal: 15,
                    marginTop: 25
                }}>
                    <Input
                        multiline={true}
                        numberOfLines={5}
                        placeholder='Expense Desription'
                        value={description}
                        onChangeText={(e) => { setDescription(e) }}
                        leftIcon={
                            <Icon
                                name='description'
                                size={30}
                                color='black'
                            />
                        }
                        style={{
                            marginHorizontal: 8
                        }}
                    />
                </View>
                <RadioGroup getChecked={getChecked}
                    RadioGroupStyle={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}
                    labelStyle={{ fontSize: 21 }}
                >
                    <Radio style={{ backgroundColor: 'red' }} iconName={"lens"} label={"In"} value={"In"} />
                    <Radio iconName={"lens"} label={"Out"} value={"Out"} />
                </RadioGroup>
                <View style={{
                    marginTop: 45
                }}>
                    <Button
                        loading={loadingFlag}
                        title="ADD"
                        buttonStyle="raised"
                        fontSize={40}
                        buttonStyle={{
                            width: 150,
                            padding: 15,
                            alignSelf: 'center'
                        }}
                        onPress={() => {
                            setLoadingFlag(true);
                            add();
                        }}
                    />
                </View>
            </View>
        </>
    )
}

export default CreateExpense
