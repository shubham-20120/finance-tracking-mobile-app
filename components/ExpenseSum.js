import React from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { Header, Card } from 'react-native-elements'

const ExpenseSum = ({ route, navigation }) => {
    let { income, expense } = route.params
    let total = income - expense;
    return (
        <SafeAreaView style={{ height: '100%', width: '100%' }}>
            <Header
                leftComponent={{ icon: 'arrow-back', size: 26.5, color: 'white', type: "ionicon", onPress: () => { navigation.goBack() } }}
                centerComponent={{ text: 'Summary', style: { color: 'white', fontSize: 22, fontWeight: 'bold' } }}
            />
            <Card>
                <Card.Title style={{ fontSize: 18.5 }}>Your Summary</Card.Title>
                <Card.Divider />
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View><Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: 'green' }}>Income</Text></View>
                    <View><Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: 'green', marginRight: 10 }}>{income}</Text></View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View><Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: 'red' }}>Expense</Text></View>
                    <View><Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: 'red', marginRight: 10 }}>{expense}</Text></View>
                </View>
                <Card.Divider style={{ marginTop: 15 }} />
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View><Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: total > 0 ? "green" : 'red' }}>Total</Text></View>
                    <View><Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: total > 0 ? "green" : 'red', marginRight: 10 }}>{total}</Text></View>
                </View>
            </Card>
        </SafeAreaView>
    )
}

export default ExpenseSum
