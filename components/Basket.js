import React from 'react'
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import firebaseSDK from '../firebaseSDK'
import print from '../components/print'

const Basket = ({basket, setBasket}) => {

    const date = new Date()

    const getDate = () => {
        const day = ("0" + date.getDate()).slice(-2)
        const month = ("0" + (date.getMonth() + 1)).slice(-2)
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    const getTime = () => {
        const minutes = ("0" + date.getMinutes()).slice(-2)
        const seconds = ("0" + date.getSeconds()).slice(-2)
        const hours = ("0" + date.getHours()).slice(-2)
        return `${hours}:${minutes}:${seconds}`
    }
    const getSubtotal = () =>{
        var subtotal = 0
        for (let i = 0; i < basket.length; i ++){
            subtotal += basket[i].price
        }
        return subtotal
    }

    const removeArr = (index) => {
        var newArr = [...basket]
        newArr.splice(index, 1)
        return(
            setBasket(newArr)
        )
    }

    const minus = (index) => {
        return(         
            <TouchableOpacity style={styles.minus} onPress={index => removeArr()}>
            <AntDesign name="minuscircleo" size={20} color="black" />
            </TouchableOpacity>
        )
    }

    const checkout = () => {
        if(basket.length > 0){
            Alert.alert(
                "確定結算?",
                "",
                [
                    {
                        text: "取消"
                    },
                    {
                        text: "確定",
                        onPress: () => {
                            addToDatabase()
                            Alert.alert(
                                "列印?",
                                "",
                                [
                                    {
                                        text: "不列印"
                                    },
                                    {
                                        text: "列印",
                                        onPress: () => print()
                                    }
                                ]
                            )
                        }
                    }
                ]

            )
        }
    }

    const addToDatabase = () => {
        const now = Date.now()
        firebaseSDK.addData(`receipt/${now}/orders`, {...basket})
        firebaseSDK.update(`receipt/${now}`, {'date': getDate()})
        firebaseSDK.update(`receipt/${now}`, {'time': getTime()})
        firebaseSDK.update(`receipt/${now}`, {'key': now})
        firebaseSDK.update(`receipt/${now}`, {'subtotal': getSubtotal()})
        setBasket([])
    }


    return(
        <View style={{flex: 1}}>
            <View style={{flex: 8}}>
                <FlatList
                data={basket}
                keyExtractor={(item, index) => "item" + index}
                renderItem={ ({item, index}) => {
                    return(
                        <View style={styles.dish}>
                            <Text style={styles.text}>{item.dish}</Text>
                            {minus(index)}
                        </View>
                    )
                }}
                />
            </View>
            <View style={styles.subtotal}>
                <Text style={styles.text}>總計:</Text>
                <Text style={styles.text}> {getSubtotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkout} onPress={() => checkout()}>
                <Text style={styles.text}>結帳</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    dish: {
        flex: 1,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 30
    },
    subtotal: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    minus: {
        justifyContent: 'center'
    },
    checkout: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Basket