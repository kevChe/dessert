import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import Items from '../components/Items'
import Basket from '../components/Basket'

const main = () => {

    const [basket, setBasket] = useState([])

    return(
        <View style={styles.container}>
            <View style={styles.item}><Items basket={basket} setBasket={(item) => setBasket(item)}/></View>
            <View style={styles.basket}><Basket basket = {basket} setBasket={(item) => setBasket(item)}/></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff'
    },
    item: {
        flex: 2,
        borderColor: "black",
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: "#E9E9E9"
    },
    basket: {
        flex: 1,
        borderColor: "black",
        borderRadius: 8,
        borderWidth: 1,
        marginLeft: 20,
        backgroundColor: "#E9E9E9",
        padding: 10
    }
})

export default main