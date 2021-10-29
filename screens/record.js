import React, {useState, useEffect} from "react"
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import Collapsible from 'react-native-collapsible'
import firebaseSDK from "../firebaseSDK"
import Modal from 'react-native-modal'
import { AntDesign } from '@expo/vector-icons'; 
import DropDownPicker from 'react-native-dropdown-picker';
import print from '../components/print'

const record = () => {

    const [records, setRecords] = useState()
    const [collapsed, setCollapsed] = useState([])
    const [modal, setModal] = useState(false)
    const [qCollapsed, setQCollapsed] = useState(true)
    const [showTotal, setShowTotal] = useState(false)

    const [value, setValue] = useState(null)
    const [open, setOpen] = useState(false)
    const [value2, setValue2] = useState(null)
    const [open2, setOpen2] = useState(false)
    const [items, setItems] = useState([])
    const [lockUniqueDates, setLockUniqueDates] = useState(false)

    const toggleCollapsed = (index) =>{
        let newArr = [...collapsed]
        if(newArr[index] || newArr[index] == null){
            newArr[index] = false
        }else{
            newArr[index] = true
        }
        setCollapsed(newArr)
    }

    const toggleQCollapsed = () => {
        if(qCollapsed){
            setQCollapsed(false)
        }else{
            setQCollapsed(true)
        }
        // console.log(getQuantity())
    }

    const queryDate = (query) => {
        firebaseSDK.readData('/receipt', (object) => setRecords(object))
        setModal(false)
    }

    const queryRange = (start, end) => {
        var sTime
        var eTime
        if(start != null){
            const [sDay, sMonth, sYear] = start.split('/')
            sTime = new Date(sYear, sMonth - 1, sDay).getTime()
        } 

        if(end != null){
            const [eDay, eMonth, eYear] = end.split('/')
            eTime = new Date(eYear, eMonth - 1, eDay).getTime() + 86400000
        }

        if(start != null){
            if(end == null || eTime < sTime){
                eTime = sTime + 86400000
            }
            firebaseSDK.queryRange('/receipt', 'key', sTime, eTime, (object) => setRecords(object))
        }
        setModal(false)
        
    }

    const uniqueDate = () => {
            let unique = records.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index)
            return unique
    }

    const getTotal = () => {
        if(records != null){
            let total = 0
            records.forEach(order => {
                total += order.subtotal
            });
            return total
        }
    }

    const getQuantity = () => {
        if(records != null){
            let total = {}
            for(let i = 0; i < records.length; i ++){
                let order = records[i].orders
                for(let j = 0; j < order.length; j ++){
                    let dish = order[j].dish
                    if(total[`${dish}`] == null){
                        total[`${dish}`] = 1
                    }else{
                        total[`${dish}`] += 1
                    }
                }
            }
            return Object.entries(total)
        }
    }

    const delOrder = (key) => {
        Alert.alert(
            "確認刪除?",
            "",
            [
                {
                    text: "取消"
                },
                {
                    text: "確認",
                    onPress: () => firebaseSDK.removeData(`receipt/${key}`)
                }
            ],
        )
    }

    useEffect(() => {
        let isMount = true
        if(isMount){
            // firebaseSDK.readData('/', (object) => setRecords(object))
            queryDate(null)
        }
        // for (let i = 0; i < records.length; i ++)
        return() => {isMount = false}
    }, [])

    useEffect(() => {
        let isMount = true
        if(records != null && !lockUniqueDates){
            // console.log(lockUniqueDates)
            const dates = uniqueDate()
            let items = [{label: "請選擇日期", value: null}]
            for(let i = 0; i < dates.length; i ++){
                items.push({label: dates[i], value: dates[i]})
            }
            setItems(items)
            setLockUniqueDates(true)
        }
    }, [records])

    return(
        <View style={styles.container}>
            {records != null? 
            <View style={{flex: 1}}>

                <Modal isVisible={modal} style={styles.modal} hasBackdrop={true} onBackdropPress={() => setModal(false)} backdropOpacity={0.5}>

                        <View style={{flexDirection:'row', justifyContent: 'space-evenly', marginBottom: 30, zIndex: 1}}>
                            <DropDownPicker open={open} value={value} items={items} setOpen={setOpen} setValue={setValue} setItems={setItems} containerStyle={styles.pickerStyle} placeholder="請選擇日期" dropDownDirection="BOTTOM" />
                            <Text style={{fontSize: 30, alignSelf: 'center'}}>至</Text>
                            <DropDownPicker open={open2} value={value2} items={items} setOpen={setOpen2} setValue={setValue2} setItems={setItems} containerStyle={styles.pickerStyle} placeholder="請選擇日期" dropDownDirection="BOTTOM" />
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'baseline', position: 'absolute', bottom: 0, right: 0, paddingRight: 20, paddingBottom: 10}}>
                            <TouchableOpacity style={styles.button} onPress={()=> {
                                    queryDate(null)
                                    setShowTotal(false)
                                }}>
                                <Text style={styles.text}>顯示全部</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} 
                            onPress={()=> {
                                queryRange(value, value2)
                                if(value != null){
                                    setShowTotal(true)
                                }else{
                                    setShowTotal(false)
                                } 
                            }}>
                                <Text style={styles.text}>確定</Text>
                            </TouchableOpacity>
                        </View>
                </Modal>

                <FlatList
                    data={records}
                    keyExtractor={(item) => String(item.key)}


                    //length = height of styles.orders

                    renderItem={({item, index}) => {

                        return(

                            <View style={styles.orders}>

                                <TouchableOpacity style={styles.date} onPress={()=>toggleCollapsed(index)}>
                                    {item.subtotal != null ? 
                                    <Text style={{fontSize: 30}}>{item.date} {item.time}        結帳價格: {item.subtotal.toFixed(2)}</Text>
                                    :
                                    <View></View>
                                    
                                    }
                                    <View style={{position: 'absolute', right: 0, marginRight: 10, flexDirection: 'row'}}>
                                        <TouchableOpacity style={{marginRight: 10}} onPress={() => {
                                            Alert.alert(
                                                "確認列印?",
                                                "",
                                                [
                                                    {
                                                        text: "取消"
                                                    },
                                                    {
                                                        text: "列印",
                                                        onPress: () => print()
                                                    }
                                                ]
                                            )
                                        }}>
                                            <AntDesign name="printer" size={24} color="black" style={{}}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => delOrder(item.key)}>
                                            <AntDesign name="minus" size={24} color="black" style={{}}/>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>

                                <Collapsible collapsed={collapsed[index]}>                                   
                                    <FlatList
                                    data={item.orders}
                                    keyExtractor={(item, index) => String(index)}
                                    renderItem={ ({item}) => {
                                        return(
                                            <View style={styles.items}>
                                                <View>
                                                <Text style={{fontSize: 30}}>{item.dish}</Text>
                                                <Text style={{fontSize: 20, marginLeft: 40}}>{item.setItems}</Text>
                                                </View>
                                                <Text style={{fontSize: 30}}>{item.tag != 'discount' ? item.price.toFixed(2) : `${item.price}折`}</Text>

                                            </View>
                                        )
                                    }}
                                    />
                                </Collapsible>

                            </View>
                        )
                    }}
                />

                {showTotal ?
                <View style={styles.orders}>
                    <TouchableOpacity style={styles.date} onPress={toggleQCollapsed}>
                        <Text style={{fontSize: 30}}>總收入: {getTotal().toFixed(2)}</Text>
                    </TouchableOpacity>
                    <Collapsible collapsed={qCollapsed}>
                        <FlatList
                        data={getQuantity()}
                        keyExtractor={(item)=>item[0]}
                        renderItem={({item}) => {
                            return(
                                <View style={styles.items}>
                                    <Text style={styles.text}>{item[0]}</Text>
                                    <Text style={styles.text}>{item[1]}</Text>
                                </View>
                            )
                        }}
                        />
                    </Collapsible>
                </View>:
                <View></View>
                }
                <TouchableOpacity style={styles.filter} onPress={()=>setModal(true)}>
                    <AntDesign name="filter" size={30} color="white" />
                </TouchableOpacity>
            </View>
            :
            <Text>Loading...</Text>
            }
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5
    },
    orders: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 5,
        padding: 10,
    },
    items: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    text: {
        fontSize: 25
    },
    date: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    modal: {
        backgroundColor: '#ffffff',
        padding: 30,
        marginVertical: 300,
        borderRadius: 16
    },
    filter: {
        height: 60,
        width: 60,
        position: 'absolute',
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35,
        margin: 30,
        backgroundColor: '#a1acb3'
    },
    button: {
        borderWidth: 1,
        padding: 10,
        alignSelf: 'baseline',
        marginRight: 20,
        borderRadius: 20
    },
    pickerStyle: {
        flex: 1,
        marginHorizontal: 10,
    }
})

export default record