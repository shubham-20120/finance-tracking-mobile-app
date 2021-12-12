import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import { Icon, Header, Overlay } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';




const RenderThis = ({ setIncome, setExpense, navigation }) => {
    const [userList, setUserList] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [reload, setReload] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const loadInitialItems_Home = async () => {
        setRefreshing(true);
        var tkn = await AsyncStorage.getItem("@userToken");
        if (tkn == undefined) {
            alert('please login');
            navigation.navigate("Signup");
            return;
        }
        fetch("http://192.168.43.145:5000/get-all-entries", {
            method: 'get',
            headers: { 'Content-Type': 'application/json', authorization: tkn }
        }).then(res => res.json()).then(data => {
            setUserList(data.data)
        })
        setRefreshing(false)
    }
    const Modal = (prop) => {
        const [data, setData] = useState(null);
        const deleteItem = async () => {
            let _id = await AsyncStorage.getItem("@itemId")
            fetch("http://192.168.43.145:5000/delete-item-by-id", {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id
                })
            }).then(res => res.json()).then(data => {
                if (data.deletedCount) {
                    prop.setOverlayVisible(false)
                    loadInitialItems_Home();
                } else {
                    alert('something went wrong in deleting item')
                }
            })
        }
        useEffect(async () => {
            let _id = await AsyncStorage.getItem("@itemId")
            fetch("http://192.168.43.145:5000/get-item-by-id", {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id
                })
            }).then(res => res.json()).then(data => {
                setData(data.data);
            })
        }, [])

        return (
            <View style={{
                padding: 11
            }} >
                {
                    data == null ? <ActivityIndicator size="large" color="#0066FF" /> :
                        <>
                            <Text style={{ fontSize: 20, backgroundColor: '#E4E4E4AD', paddingHorizontal: 13, paddingVertical: 15, borderRadius: 10 }}>{data.title}</Text>
                            {
                                data.description == "" || data.description == null ? null :
                                    <Text style={{ fontSize: 20, backgroundColor: '#E4E4E4AD', paddingHorizontal: 13, paddingVertical: 15, borderRadius: 10, marginTop: 8 }} >{data.description}</Text>
                            }
                            <View style={{ backgroundColor: '#E4E4E4AD', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 13, paddingVertical: 15, borderRadius: 10, marginTop: 8 }}>
                                <Text style={{ fontSize: 20 }} >{Number.parseFloat(data.price.$numberDecimal)} </Text>
                                {
                                    data.transactionType == "In" ?
                                        <Text style={{ fontSize: 20, backgroundColor: 'lightgreen', paddingHorizontal: 10, marginVertical: -10, borderRadius: 5, paddingTop: 8, paddingBottom: 8 }}>Income</Text>
                                        :
                                        <Text style={{ fontSize: 20, backgroundColor: '#FFA599', paddingHorizontal: 10, marginVertical: -10, borderRadius: 5, paddingTop: 8, paddingBottom: 8 }}>Expense</Text>
                                }
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                                <TouchableOpacity onPress={deleteItem}>
                                    <Icon name='trash-outline' type="ionicon" size={35} color='#0082FC' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { prop.setOverlayVisible(false) }}>
                                    <Icon name='close' type="ionicon" size={35} color='#0082FC' />
                                </TouchableOpacity>
                            </View>
                        </>
                }

            </View>
        )
    }
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'lightblue',
            margin: 5,
            paddingHorizontal: 5,
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        leftTextMain: {
            fontSize: 18,
            fontWeight: 'bold'
        },
        leftTextDesc: {
            fontSize: 17.5,
            marginTop: 4
        }
    });
    useEffect(() => {
        loadInitialItems_Home();
    }, [])
    useEffect(() => {
        loadInitialItems_Home();
    }, [reload])
    useEffect(() => {
        if (userList != null) {
            setIncome(0);
            setExpense(0);
            let i = 0, e = 0;
            for (let j = 0; j < userList.length; j++) {
                if (userList[j].transactionType == "In") {
                    i = i + Number.parseFloat(userList[j].price.$numberDecimal);
                } else {
                    e = e + Number.parseFloat(userList[j].price.$numberDecimal);
                }
            }
            setIncome(i);
            setExpense(e);
        }
    }, [userList])
    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    }
    return (
        <View>
            <View
                style={{ height: '100%', backgroundColor: 'pink' }}
            >
                <Overlay isVisible={overlayVisible} overlayStyle={{
                    // minHeight: '40%',
                    height: 'auto',
                    width: '85%',
                }} onBackdropPress={toggleOverlay} >
                    <Modal setOverlayVisible={setOverlayVisible} />
                </Overlay>

                {
                    userList != null && userList.length != 0 ? <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={loadInitialItems_Home}
                            />
                        }
                        style={{ marginBottom: 75 }}
                        data={userList}
                        renderItem={item =>
                            <>
                                <View style={styles.container} >
                                    <TouchableOpacity onPress={async () => {
                                        AsyncStorage.setItem("@itemId", item.item._id)
                                        setOverlayVisible(true)
                                    }} style={styles.container}>
                                        <View>
                                            <Text style={styles.leftTextMain}>{item.item.title}</Text>
                                            <Text style={styles.leftTextDesc}>{item.item.description}</Text>
                                        </View>
                                        <View>
                                            <Text style={{
                                                fontSize: 18.5,
                                                fontWeight: 'bold',
                                                padding: 18,
                                                borderRadius: 5,
                                                backgroundColor: item.item.transactionType == "In" ? 'lightgreen' : '#FFA599'
                                            }}>${Number.parseFloat(item.item.price.$numberDecimal)}</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            </>
                        }
                        keyExtractor={item => item._id}
                    /> :
                        userList == null ? <ActivityIndicator size="large" color="#00ff00" /> :
                            <TouchableOpacity>
                                <Text style={{ fontSize: 25, paddingTop: 45, paddingLeft: 70 }}>No Expense Item created</Text>
                                <Text style={{ fontSize: 25, paddingTop: 45, paddingLeft: 55 }}>Create Expense list</Text>
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 60,
                                        height: 60,
                                        right: 65,
                                        top: -45,
                                        alignSelf: 'flex-end',
                                        backgroundColor: 'pink',
                                        borderRadius: 100,
                                        elevation: 7
                                    }}
                                    onPress={() => {
                                        navigation.navigate('Create')
                                    }}
                                >
                                    <Icon name='add' size={40} color='#0082FC' />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 60,
                                        height: 60,
                                        right: '40%',
                                        alignSelf: 'flex-end',
                                        backgroundColor: 'pink',
                                        borderRadius: 100,
                                        elevation: 7
                                    }}
                                    onPress={() => { setReload(!reload) }}
                                >
                                    <Icon name='refresh' type="ionicon" size={35} color='#0082FC' />
                                </TouchableOpacity>
                            </TouchableOpacity>
                }
            </View>
            {
                userList != null && userList.length == 0 ? null : <TouchableOpacity
                    style={{
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 70,
                        position: 'absolute',
                        bottom: 90,
                        right: 20,
                        height: 70,
                        backgroundColor: '#fff',
                        borderRadius: 100,
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={loadInitialItems_Home}
                        />
                    }
                    onPress={() => {
                        navigation.navigate('Create')
                    }}
                >
                    <Icon name='add' size={40} color='#0082FC' />
                </TouchableOpacity>
            }
        </View >
    )
}

const Home = ({ navigation }) => {
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const logout = async () => {
        try {
            await AsyncStorage.removeItem("@userToken")
            await AsyncStorage.removeItem("@userId")
            navigation.navigate("Signup")
        } catch (e) {
            alert('something went wrong - Home ougout');
        }
    }
    const sendToSum = async () => {
        navigation.navigate('Sum', {
            income, expense
        });
    }
    return (
        <>
            <Header
                centerComponent={{ text: 'Home', style: { color: 'white', fontSize: 22, fontWeight: 'bold' } }}
                rightComponent={<View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={sendToSum}>
                        <Icon name='calculate' size={28} color='#FFFFFF' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout}>
                        <Icon name='logout' size={28} color='#FFFFFF' />
                    </TouchableOpacity>
                </View>}
            />
            <View style={{ height: '100%', backgroundColor: 'red' }}>
                <RenderThis setIncome={setIncome} setExpense={setExpense} navigation={navigation} />
            </View>
        </>
    )
}

export default Home
