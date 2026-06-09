import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

export default function NovaTarefaScreen() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!titulo.trim()) {
      Alert.alert("Atenção", "O título é obrigatório.");
      return;
    }

    try {
      setSalvando(true);
      await api.criarTarefa(titulo.trim(), descricao.trim());
      Alert.alert("Sucesso", "Tarefa criada!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a tarefa.");
    } finally {
      setSalvando(false);
    }
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
          placeholder="Ex: Estudar React Native"
          value={titulo}
          onChangeText={setTitulo}
          maxLength={100}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Adicione detalhes sobre a tarefa..."
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={4}
          maxLength={300}
        />

        <TouchableOpacity
          style={[styles.botao, salvando && styles.botaoDesativado]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={styles.botaoTexto}>
            {salvando ? "Salvando..." : "Criar Tarefa"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoCancelar} onPress={() => router.back()}>
          <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

NovaTarefaScreen.options = { title: "Nova Tarefa" };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F7",
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
