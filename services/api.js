// Troque o IP pelo IP da sua máquina na rede local
// Use "localhost" se estiver testando no emulador Android Studio ou iOS Simulator
// Use o IP da sua máquina (ex: 192.168.1.X) se estiver testando no dispositivo físico
const BASE_URL = "http://192.168.1.100:3000";

const api = {
  // Busca todas as tarefas
  async getTarefas() {
    const response = await fetch(`${BASE_URL}/tarefas`);
    if (!response.ok) throw new Error("Erro ao buscar tarefas");
    return response.json();
  },

  // Cria nova tarefa
  async criarTarefa(titulo, descricao) {
    const response = await fetch(`${BASE_URL}/tarefas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descricao }),
    });
    if (!response.ok) throw new Error("Erro ao criar tarefa");
    return response.json();
  },

  // Atualiza tarefa existente
  async atualizarTarefa(id, dados) {
    const response = await fetch(`${BASE_URL}/tarefas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao atualizar tarefa");
    return response.json();
  },

  // Remove tarefa
  async deletarTarefa(id) {
    const response = await fetch(`${BASE_URL}/tarefas/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar tarefa");
    return response.json();
  },
};

export default api;
