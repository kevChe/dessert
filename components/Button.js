import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const CustomButton = ({text, size, top, action}) => {
    return(
            <TouchableOpacity onPress={action} style={{marginVertical: parseFloat(top), marginHorizontal: 70}} >
                <Text style={{
                    fontSize: parseFloat(size), 
                    color: "#000000",
                    borderWidth: 1,
                    borderColor: "#000000",
                    textAlign: "center",
                    borderRadius: 8,
                    }}>{text}</Text>
            </TouchableOpacity>
    )
}

export default CustomButton;