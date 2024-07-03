import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native"; 

export default function TopBar({ currentLocation }) {
    return (
        /* Barra superior */
        <View style={styles.topBar}>
            <Text style={styles.topBarText}>Reciparque</Text>
                <Pressable 
                    onPress={() => router.push(`/map/proximas/${currentLocation.latitude}?longitude=${currentLocation.longitude}`)}
                    style={styles.toggleButton}
                >
                    <Text style={styles.toggleButtonText}>Praças / Parques Próximos</Text>
                </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    toggleButton: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 'auto',
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
        top: 20, 
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffd700', 
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 4, 
        borderBottomColor: '#556b2f', 
        zIndex: 2,
    },
    topBarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#556b2f', 
    },
});