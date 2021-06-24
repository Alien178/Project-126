import React from "react";
import { View, Text, Button, Platform, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null
        }
    }

    render() {
        return(
            <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Button title = "Pick an Image" onPress = {this.pickImages}/>
            </View>
        )
    }

    componentDidMount() {
        this.getPermissionsAsync()
    }

    getPermissionsAsync = async() => {
        if (Platform.OS !== "web") {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status !== "granted") {
                alert("Sorry, Permission Needed!!!!!!!")
            }
        }
    }

    pickImages = async() => {
        try {
            var result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            })
         if (!result.cancelled) {
             this.setState({
                 image: result.data
             })
             console.log(result.uri)
             this.uploadImage(result.uri)
         }
        }

        catch (error) {
            console.log("ERROR!!!!")
        }
    }

    uploadImage = async(uri) => {
        const data = new FormData()
        var fileName = uri.split("/")[uri.split("/").length - 1]
        var type = `image/${uri.split(".")[uri.split(".").length - 1]}`
        const fileToUpload = {uri: uri, name: fileName, type: type}
        data.append("digit", fileToUpload)
        fetch("http://7bbd585496e6.ngrok.io/predict", {
            method: "POST",
            body: data,
            headers: {"content-type": "multipart/form-data"}
        }).then((response) => response.json())
        .then((result) => console.log("SUCCESS:", result))
        .catch((error) => console.log(error))
    }
}