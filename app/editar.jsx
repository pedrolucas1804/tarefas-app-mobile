import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

export default function EditarTarefaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [concluida, setConcluida] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Busca a tarefa pelo ID ao abrir a tela
  useEffect(() => {
    async function carregarTarefa() {
      try {
        const tarefas = await api.getTarefas();
        const tarefa = tarefas.find((t) => t.id === parseInt(id));
        if (tarefa) {
          setTitulo(tarefa.titulo);
          setDescricao(tarefa.descricao || "");
          setConcluida(tarefa.concluida);
        } else {
          Alert.alert("Erro", "Tarefa não encontrada.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar a tarefa.");
      } finally {
        setCarregando(false);
      }
    }

    carregarTarefa();
  }, [id]);

  async function salvar() {
    if (!titulo.trim()) {
      Alert.alert("Atenção", "O título é obrigatório.");
      return;
    }

    try {
      setSalvando(true);
      await api.atualizarTarefa(id, {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        concluida,
      });
      Alert.alert("Sucesso", "Tarefa atualizada!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          placeholder="Título da tarefa"
          value={titulo}
          onChangeText={setTitulo}
          maxLength={100}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Descrição da tarefa..."
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={4}
          maxLength={300}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Tarefa concluída</Text>
          <Switch
            value={concluida}
            onValueChange={setConcluida}
            trackColor={{ false: "#E0E0E0", true: "#6C63FF" }}
            thumbColor={concluida ? "#fff" : "#f0f0f0"}
          />
        </View>

        <TouchableOpacity
          style={[styles.botao, salvando && styles.botaoDesativado]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={styles.botaoTexto}>
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoCancelar} onPress={() => router.back()}>
          <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

EditarTarefaScreen.options = { title: "Editar Tarefa" };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F7",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputMultiline: {
    height: 120,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  botao: {
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 30,
  },
  botaoDesativado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoCancelar: {
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  botaoCancelarTexto: {
    color: "#888",
    fontSize: 15,
  },
});
