import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import treeIcon from '../../assets/tree_icon.png';
import TopBar from '../../src/components/TopBar';
import fetchParques from '../../src/utils/fetchParques';
import getLocation from '../../src/utils/getLocation';

const HomeScreen = () => {
    const [parques, setParques] = useState([]);
    const [location, setLocation] = useState();

    const parqueList = fetchParques();

    useEffect(() => {
        setParques(parqueList);
        (async () => setLocation(await getLocation()))();
    }, []);

    return (
        <View style={styles.container}>
            {/* Barra superior */}
            <TopBar currentLocation={location}/>

            {/* Mapa */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -8.047562,
                    longitude: -34.876964,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {/* Marcador para a localização atual do dispositivo */}
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title={"Sua localização"}
                        pinColor={"blue"}
                    />
                )}

                {/* Renderiza os marcadores dos parques utilizando os dados carregados */}
                {parques.map(parque => (
                    <Marker
                        key={parque.id.toString()}
                        coordinate={{
                            latitude: parque.latitude,
                            longitude: parque.longitude,
                        }}
                        title={parque.nome}
                        icon={treeIcon}
                    >
                        {/* Callout usado para exibição do nome da praça, endereço e bairro quando clicar no marcador */}
                        <Callout style={styles.callout}>
                            <View>
                                <Text style={styles.calloutTitle}>{parque.nome}</Text>
                                <Text style={styles.calloutText}>{parque.endereco}</Text>
                                <Text style={styles.calloutText}>Bairro: {parque.bairro}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#e5e5e5',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1, 
    },
    callout: {
        width: 250,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    calloutText: {
        textAlign: 'center',
    },
});

export default HomeScreen;
