// Importei o arquivo JSON localmente já que tive dificuldades no uso da api do dados recife pelo link. //
import parquesData from '../../src/Parquesmap.json';

// Função para buscar os parques
const fetchParques = () => {
    try {
        // Mapeia os dados do JSON para extrair os registros obtidos pelo arquivo //
        const parsedParques = parquesData.records.map(record => ({
            id: record[0], 
            nome: record[6], 
            latitude: record[11], 
            longitude: record[12], 
            endereco: record[3], 
            bairro: record[10], 
            numero: record[7],
            cep: record[9],
        }));
        return parsedParques;
    } catch (error) {
        console.error('Erro ao carregar parques:', error);
    }
};

export default fetchParques;