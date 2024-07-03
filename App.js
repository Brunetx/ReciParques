import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import treeIcon from './assets/tree_icon.png';

// Importe o arquivo JSON localmente
import parquesData from './Parquesmap.json';

const HomeScreen = () => {
    const [parques, setParques] = useState([]);
    const [praçasProximas, setPraçasProximas] = useState([]);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [mostrarLista, setMostrarLista] = useState(false); // Estado para controlar visibilidade da lista

    useEffect(() => {
        // Função para buscar os parques
        const fetchParques = async () => {
            try {
                // Mapeia os dados do JSON para extrair os registros
                const parsedParques = parquesData.records.map(record => ({
                    id: record[0], // Exemplo de mapeamento para o campo _id
                    nome: record[6], // Exemplo de mapeamento para o campo nome_equip_urbano
                    latitude: record[11], // Exemplo de mapeamento para o campo latitude
                    longitude: record[12], // Exemplo de mapeamento para o campo longitude
                    endereco: record[3], // Mapeamento para o campo de endereço
                    bairro: record[10], // Mapeamento para o campo de bairro
                    numero: record[7], // Mapeamento para o campo de número
                    cep: record[9], // Mapeamento para o campo de CEP
                }));

                setParques(parsedParques);
            } catch (error) {
                console.error('Erro ao carregar parques:', error);
            }
        };

        fetchParques();

        // Obter a localização atual do dispositivo
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permissão para acessar a localização foi negada');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    }, []);

    // Função para calcular a distância entre dois pontos de latitude e longitude
    const calcularDistancia = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Raio da Terra em quilômetros
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distancia = R * c; // Distância em quilômetros
        return distancia.toFixed(1); // Retornar a distância com uma casa decimal
    };

    useEffect(() => {
        if (location) {
            // Filtrar e ordenar as praças por proximidade
            const praçasOrdenadas = parques
                .map(parque => ({
                    ...parque,
                    distancia: calcularDistancia(location.latitude, location.longitude, parque.latitude, parque.longitude),
                }))
                .sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia))
                .slice(0, 5); // Exibir apenas as 5 primeiras praças próximas

            setPraçasProximas(praçasOrdenadas);
        }
    }, [location, parques]);

    // Função para alternar visibilidade da lista
    const toggleLista = () => {
        setMostrarLista(!mostrarLista);
    };

    return (
        <View style={styles.container}>
            {/* Barra superior */}
            <View style={styles.topBar}>
                <Text style={styles.topBarText}>ReciParques</Text>
                <TouchableOpacity style={styles.toggleButton} onPress={toggleLista}>
                    <Text style={styles.toggleButtonText}>{mostrarLista ? 'Fechar Lista' : 'Praças Próximas'}</Text>
                </TouchableOpacity>
            </View>

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
                        pinColor={"blue"} // Cor do pin
                    />
                )}

                {/* Renderiza os marcadores dos parques utilizando os dados carregados */}
                {parques.map(parque => (
                    <Marker
                        key={parque.id.toString()} // Chave única para cada marcador
                        coordinate={{
                            latitude: parque.latitude,
                            longitude: parque.longitude,
                        }}
                        title={parque.nome}
                        // Utiliza a imagem importada como ícone do marcador
                        icon={treeIcon}
                    >
                        {/* Callout exibe o nome da praça, endereço e bairro ao clicar no marcador */}
                        <Callout style={styles .callout}>
                            <View>
                                <Text style={styles.calloutTitle}>{parque.nome}</Text>
                                <Text style={styles.calloutText}>{parque.endereco}</Text>
                                <Text style={styles.calloutText}>Bairro: {parque.bairro}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {/* Lista lateral com as praças próximas */}
            {mostrarLista && (
                <View style={styles.listaLateral}>
                    <Text style={styles.listaTitle}>Praças Próximas:</Text>
                    <FlatList
                        data={praçasProximas}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.itemLista}>
                                <Text style={styles.itemNome}>{item.nome}</Text>
                                <Text style={styles.itemDistancia}>{item.distancia} km</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#e5e5e5', // Cor de fundo do container
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1, // Para que o mapa fique atrás da barra superior
    },
    callout: {
        width: 250, // Largura do Callout
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
    listaLateral: {
        position: 'absolute',
        top: 20,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        zIndex: 1, // Para garantir que a lista esteja acima do mapa
    },
    listaTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
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
    toggleButton: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 'auto', // Para alinhar no canto superior direito
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    toggleButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffd700', // Amarelo para a barra superior
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 4, // Borda inferior da barra
        borderBottomColor: '#556b2f', // Verde musgo para a borda inferior da barra superior
        zIndex: 2, // Para garantir que a barra esteja acima do mapa
    },
    topBarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#556b2f', // Verde musgo para o texto da barra superior
    },
});

export default HomeScreen;
