import * as Location from 'expo-location';

async function getLocation() {
    // Obter a localização atual do dispositivo
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        throw 'Permissão para acessar a localização foi negada';
    }

    let location = await Location.getCurrentPositionAsync({});
    
    return location.coords;
}

export default getLocation;