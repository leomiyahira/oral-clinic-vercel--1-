/*
  CONFIGURAÇÃO DA CLÍNICA
  Preencha os dados abaixo UMA vez; o site atualiza todos os lugares automaticamente.
  Campo vazio ("") = o site continua mostrando o marcador [entre colchetes].
*/
window.ORAL_CONFIG = {
  // Endereço do script que grava os pedidos na planilha da clínica (veja LEIA-ME.md, passo "Planilha de agendamentos").
  // Termina em /exec. Sem ele, o site manda o paciente concluir pelo WhatsApp ou telefone.
  formUrl: "",

  // WhatsApp que recebe os pedidos de agendamento: só números, com 55 + DDD + número.
  // Exemplo: "5567999999999"
  whatsapp: "",

  // Telefone exibido no site. Exemplo: "(67) 3333-3333"
  nome: "Oral Clinic",   // nome da clínica (usado nas mensagens de WhatsApp e no mapa)

  telefone: "(67) 3382-7208",

  // Instagram da clínica: o @ ou o link completo. Exemplo: "@oralclinic" ou "https://instagram.com/oralclinic"
  instagram: "",

  email: "",                // Exemplo: "contato@seudominio.com.br"
  endereco: "R. 15 de Novembro, 230 - sala 03 - Centro, Campo Grande - MS, 79002-140",             // Exemplo: "Rua Exemplo, 123 - Centro, Campo Grande/MS"
  horarios: "Seg a Sex: 8h às 11h e 14h às 17h\nSáb: 9h às 11h\nDom: fechado",             // Exemplo: "Seg a Sex: 8h às 18h"

  // Dados exigidos na publicidade odontológica (Resolução CFO-196/2019)
  responsavelNome: "",      // Exemplo: "Dra. Nome Sobrenome"
  responsavelCro: "",       // Exemplo: "CRO-MS 0000"
  clinicaCro: ""            // Exemplo: "CRO-MS 0000"
};
