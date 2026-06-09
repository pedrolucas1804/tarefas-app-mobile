import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

export default function HomeScreen() {
  const router = useRouter();
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca as tarefas ao carregar a tela
  useEffect(() => {
    carregarTarefas();
  }, []);

  async function carregarTarefas() {
    try {
      setCarregando(true);
      const dados = await api.getTarefas();
      setTarefas(dados);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as tarefas.\nVerifique se o servidor está rodando.");
    } finally {
      setCarregando(false);
    }
  }

  async function alternarConcluida(tarefa) {
    try {
      const atualizada = await api.atualizarTarefa(tarefa.id, {
        concluida: !tarefa.concluida,
      });
      setTarefas((prev) => prev.map((t) => (t.id === atualizada.id ? atualizada : t)));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
    }
  }

  function confirmarExclusao(id) {
    Alert.alert("Excluir tarefa", "Tem certeza que deseja excluir esta tarefa?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => excluirTarefa(id) },
    ]);
  }

  async function excluirTarefa(id) {
    try {
      await api.deletarTarefa(id);
      setTarefas((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir a tarefa.");
    }
  }

  function renderTarefa({ item }) {
    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.cardLeft} onPress={() => alternarConcluida(item)}>
          <View style={[styles.checkbox, item.concluida && styles.checkboxMarcado]}>
            {item.concluida && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <View style={styles.textos}>
            <Text style={[styles.titulo, item.concluida && styles.tituloConcluido]}>
              {item.titulo}
            </Text>
            {item.descricao ? (
              <Text style={styles.descricao} numberOfLines={1}>
                {item.descricao}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>

        <View style={styles.acoes}>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => router.push({ pathname: "/editar", params: { id: item.id } })}
          >
            <Ionicons name="pencil-outline" size={18} color="#6C63FF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoExcluir} onPress={() => confirmarExclusao(item.id)}>
            <Ionicons name="trash-outline" size={18} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header personalizado */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Minhas Tarefas</Text>
        <Text style={styles.headerSubtitulo}>
          {tarefas.filter((t) => t.concluida).length}/{tarefas.length} concluídas
        </Text>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTarefa}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Ionicons name="clipboard-outline" size={64} color="#ccc" />
              <Text style={styles.vazioTexto}>Nenhuma tarefa ainda</Text>
              <Text style={styles.vazioSub}>Toque no botão + para adicionar</Text>
            </View>
          }
          onRefresh={carregarTarefas}
          refreshing={carregando}
        />
      )}

      {/* Botão flutuante para criar */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/nova")}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// Configuração do cabeçalho da tela
export const unstable_settings = { initialRouteName: "index" };

HomeScreen.options = {
  title: "Tarefas",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F7",
  },
  header: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 24,
  },
  headerTitulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitulo: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  lista: {
    padding: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxMarcado: {
    backgroundColor: "#6C63FF",
    borderColor: "#6C63FF",
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  tituloConcluido: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  descricao: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  acoes: {
    flexDirection: "row",
    gap: 8,
  },
  botaoEditar: {
    padding: 6,
  },
  botaoExcluir: {
    padding: 6,
  },
  vazio: {
    alignItems: "center",
    marginTop: 80,
  },
  vazioTexto: {
    fontSize: 18,
    color: "#aaa",
    marginTop: 16,
    fontWeight: "600",
  },
  vazioSub: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#6C63FF",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#6C63FF",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
