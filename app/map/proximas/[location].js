import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import fetchParques from '../../../src/utils/fetchParques';
import { useLocalSearchParams } from 'expo-router';

function ProximasScreen () {
    const { location, longitude } = useLocalSearchParams();
    const parquesList = fetchParques();

    // Realizei a Função para que fosse possivel calcular a distância entre dois pontos de latitude e longitude
    const calcularDistancia = (lat1, lon1, lat2, lon2) => {
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distancia = R * c; // Distância em quilômetros
        return distancia.toFixed(1); // Retornar a distância em casa decimal
    };

    // Filtro e ordenamento das praças por proximidade
    const sortedPracas = parquesList?.map(
        parque => ({
            ...parque,
            distancia: calcularDistancia(location, longitude, parque.latitude, parque.longitude),
        }))
        .sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia))
        .slice(0, 10); // Exibir apenas as 10 primeiras praças próximas

        
    

    return (
        <View style={styles.container}>
            <Text style={styles.listaTitle}>Praças / Parques Próximos:</Text>
            <FlatList
                data={sortedPracas}
                keyExtractor={(item) => item.id.toString()}
                style={styles.listaContainer}
                renderItem={({ item }) => (
                    <View style={styles.itemLista}>
                        <Text style={styles.itemNome}>{item.nome}</Text>
                        <Text style={styles.itemDistancia}>{item.distancia} km</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffd700',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listaTitle: {
        marginTop: 50,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    listaContainer: {
        marginTop: 100,
    },
    itemLista: {
        marginBottom: 10,
    },
    itemNome: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemDistancia: {
        color: '#666',
    },
});

export default ProximasScreen;
