import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";

// Importe sua imagem PNG
import logoImage from "../assets/logo.png";

export default function Page() {
  return (
    <View style={styles.container}>
      {/* Background amarelo */}
      <View style={styles.background} />

      {/* Conteúdo centralizado */}
      <View style={styles.content}>

      {/* Imagem centralizada */}
        <Image source={logoImage} style={styles.image} resizeMode="contain" />

        {/* Botão para navegação */}
        <Link href="/map" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Mapa</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8D514", 
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F8D514", 
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  main: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
    textAlign: "center",
  },
  image: {
    width: 400, 
    height: 600, 
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#218132", 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff", 
    fontSize: 18,
    fontWeight: "bold",
  },
});
