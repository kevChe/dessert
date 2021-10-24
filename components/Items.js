import React, {useEffect, useState} from 'react'
import {View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView} from 'react-native'
import firebaseSDK from '../firebaseSDK'
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal'

const Items = ({basket, setBasket}) => {

    // const menu = require('../menu')
    const [menu, setMenu] = useState()
    const [edit, setEdit] = useState(false)
    const [modal, setModal] = useState(true)
    const [recipe, setRecipe] = useState()
    const [price, setPrice] = useState()

    const addToBasket = (dish, price) => {
        return(
            setBasket([...basket, {"dish": dish, "price": price}])
        )
    }

    const addRecipe = () => {
        firebaseSDK.addData(`/recipe/${recipe}`, {'name': recipe})
        firebaseSDK.update(`/recipe/${recipe}`, {'price': parseInt(price)})
        setModal(false)
        setRecipe()
        setPrice()
    }

    const toggleEdit = () => {
        edit? setEdit(false): setEdit(true)
    }

    useEffect(() => {
        firebaseSDK.readData('/recipe', (object) => setMenu(object))
    }, [])


    return(
        <View>
            {menu != null ? 
            <View style={styles.container}>
                <Modal isVisible={modal} hasBackdrop={true} onBackdropPress={() => setModal(false)} backdropOpacity={0.5}>
                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={200}>
                    <View style={styles.modal}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.text}>菜式名稱:</Text> 
                            <TextInput style={styles.input} value={recipe} onChangeText={setRecipe}></TextInput>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 30}}>
                            <Text style={styles.text}>價錢:</Text> 
                            <TextInput style={styles.input} keyboardType="numeric" value={price} onChangeText={(text) => setPrice(text.replace(/[^0-9.]/g, ''))}></TextInput>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30}}>
                            <TouchableOpacity style={styles.button} onPress={()=>setModal(false)}>
                                <Text style={styles.text}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={addRecipe}>
                                <Text style={styles.text}>確認</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                </Modal>

                <FlatList
                    data={menu}
                    keyExtractor={item => item.dish}
                    numColumns={4}
                    renderItem={ ({item}) => {
                        return(
                            <TouchableOpacity style={styles.item} onPress={() => {addToBasket(item.name, item.price)}}>
                                <Text style={styles.text}>{item.name}</Text>
                                <Text style={styles.text}>{item.price.toFixed(2)}</Text>
                                {edit ?
                                    <TouchableOpacity style={styles.minus}>
                                        <AntDesign name="minuscircleo" size={20} color="black" />
                                    </TouchableOpacity>
                                    : null
                                }
                            </TouchableOpacity>
                        )
                    }}
                    ListFooterComponent={
                        <TouchableOpacity style={styles.item} onPress={() => toggleEdit()}>
                            <Text style={styles.text}>{edit?"完成更改": "更改菜單"}</Text>
                        </TouchableOpacity>
                    }
                    ListHeaderComponent={
                        <View >
                            {edit?            
                                <View style={{flexDirection: 'row'}}> 
                                <TouchableOpacity style={[styles.item, {borderStyle: 'dashed'}]} onPress={()=>setModal(true)}>
                                    <Text style={styles.text}>{"增加菜式"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.item, {borderStyle: 'dashed'}]} onPress={()=>setModal(true)}>
                                    <Text style={styles.text}>{"增加套餐"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.item, {borderStyle: 'dashed'}]} onPress={()=>setModal(true)}>
                                    <Text style={styles.text}>{"增加折扣"}</Text>
                                </TouchableOpacity>
                                </View>
                            :
                            <View></View>
                            }
                        </View>
                        
                    }
                />
            </View>
            :
            <View></View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    item: {
        flex: 1,
        borderColor: 'black',
        borderWidth: 1,
        margin: 10,
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        backgroundColor: "#ffffff",
    },
    text: {
        textAlignVertical: 'center',
        fontSize: 25
    },
    minus: {
        position: 'absolute',
        right: -10,
        top: -10,
        backgroundColor: 'white', 
        alignItems: 'stretch',
        borderRadius: 8
    },
    modal: {
        backgroundColor: '#ffffff',
        padding: 30,
        borderRadius: 16,
        marginHorizontal: 200
    },
    input: {
        borderWidth: 1,
        fontSize: 25,
        flex: 1,
        marginHorizontal: 30
    },
    button: {
        borderWidth: 1,
        padding: 10,
        alignSelf: 'baseline',
        marginRight: 20,
        borderRadius: 20,
        paddingHorizontal: 30
    },
})

export default Items