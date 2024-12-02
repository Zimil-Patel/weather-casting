import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {

    try{
        await AsyncStorage.setItem(key, value);
        console.log("Async data stored...");
    } catch(e){
        console.log("Error storing!!!", e);
    }

};


export const getData = async (key) => {
    try {
        let allKey = await AsyncStorage.getAllKeys();
        if (allKey.includes(key)){
            const data = await AsyncStorage.getItem(key);
            console.log("Async data fetched...");
            return data;
        }
    } catch (e){
        console.log("Error retrieving!!!", e);
    }
}