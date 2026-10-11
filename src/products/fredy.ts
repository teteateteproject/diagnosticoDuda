import type { ProductDefinition, QuizQuestion } from "./types";

/**
 * Diagnóstico Frédy — agências de viagens, multipropriedade, parques, hotelaria, operadoras.
 * Setores: Vendas / Atendimento / Pós-viagem.
 */

const questions: QuizQuestion[] = [
  // ---------- Perfil ----------
  {
    id: "role",
    block: "Perfil",
    question: "Qual a sua função na agência?",
    options: [
      { label: "Sócio(a) / Fundador(a)", value: "socio_fundador", maturidade: 3 },
      { label: "Diretor(a) / Gerente geral", value: "diretor_gerente", maturidade: 3 },
      { label: "Gerente comercial / Marketing", value: "gerente_comercial", maturidade: 2 },
      { label: "Consultor(a) / Agente de viagens", value: "consultor", maturidade: 1 },
    ],
  },
  {
    id: "segment",
    block: "Perfil",
    question: "Qual o principal segmento da sua operação?",
    textInputId: "segment_other",
    options: [
      { label: "Agência de viagens (lazer)", value: "agencia_lazer" },
      { label: "Agência corporativa", value: "agencia_corporativa" },
      { label: "Multipropriedade / Timeshare", value: "multipropriedade" },
      { label: "Parques e ingressos", value: "parques_ingressos" },
      { label: "Hotel, pousada ou resort", value: "hotelaria" },
      { label: "Operadora / Receptivo", value: "operadora_receptivo" },
      { label: "Outro", value: "outro", hasTextInput: true },
    ],
  },

  // ---------- Canais e demanda ----------
  {
    id: "whatsapp_sales_pct",
    block: "Canais e demanda",
    question: "Quanto das suas vendas passa pelo WhatsApp?",
    options: [
      { label: "Menos de 25%", value: "menos_25", maturidade: 1 },
      { label: "Entre 25% e 50%", value: "25_50", maturidade: 2 },
      { label: "Entre 50% e 75%", value: "50_75", maturidade: 3 },
      { label: "Mais de 75%", value: "mais_75", maturidade: 4 },
    ],
  },
  {
    id: "channels",
    block: "Canais e demanda",
    question: "Por onde seus leads mais chegam?",
    hint: "Selecione até 2 canais",
    multiple: true,
    maxSelect: 2,
    options: [
      { label: "WhatsApp", value: "whatsapp", vendas: 2 },
      { label: "Instagram", value: "instagram", vendas: 2 },
      { label: "Site / Formulário", value: "site_formulario", vendas: 1 },
      { label: "Telefone / E-mail", value: "telefone_email", vendas: 1 },
      { label: "Indicação / Balcão", value: "indicacao_balcao", vendas: 1 },
    ],
  },
  {
    id: "lead_volume",
    block: "Canais e demanda",
    question: "Quantos novos contatos pedindo orçamento vocês recebem por dia?",
    options: [
      { label: "Menos de 10", value: "menos_10", maturidade: 1 },
      { label: "Entre 10 e 30", value: "10_30", maturidade: 2 },
      { label: "Entre 30 e 100", value: "30_100", maturidade: 3 },
      { label: "Mais de 100", value: "mais_100", maturidade: 4 },
    ],
  },

  // ---------- Operação ----------
  {
    id: "team_size",
    block: "Operação",
    question: "Quantos consultores/vendedores atendem hoje?",
    options: [
      { label: "1 a 2", value: "1_2", maturidade: 1 },
      { label: "3 a 5", value: "3_5", maturidade: 2 },
      { label: "6 a 10", value: "6_10", maturidade: 3 },
      { label: "Mais de 10", value: "mais_10", maturidade: 4 },
    ],
  },
  {
    id: "how_attend",
    block: "Operação",
    question: "Como o primeiro atendimento acontece hoje?",
    options: [
      { label: "Manual, cada consultor responde na hora", value: "manual", atendimento: 2, maturidade: 1 },
      { label: "Com respostas prontas", value: "respostas_prontas", atendimento: 3, maturidade: 2 },
      { label: "Com robô ou automação básica", value: "automacao_basica", atendimento: 4, maturidade: 3 },
      { label: "Ainda não organizamos isso", value: "nao_organizado", atendimento: 1, maturidade: 1 },
    ],
  },
  {
    id: "quote_time",
    block: "Operação",
    question: "Quanto tempo leva pra enviar um orçamento depois do primeiro contato?",
    options: [
      { label: "Até 1 hora", value: "ate_1h", maturidade: 3, vendas: 1 },
      { label: "No mesmo dia", value: "mesmo_dia", maturidade: 2, vendas: 2, atendimento: 1 },
      { label: "Em 1 ou 2 dias", value: "1_2_dias", maturidade: 1, vendas: 3, atendimento: 2 },
      { label: "Mais de 2 dias", value: "mais_2_dias", maturidade: 0, vendas: 3, atendimento: 3 },
    ],
  },

  // ---------- Tecnologia ----------
  {
    id: "paid_traffic",
    block: "Tecnologia",
    question: "Você investe (ou já investiu) em tráfego pago?",
    options: [
      { label: "Sim, investimos todo mês", value: "mensalmente", maturidade: 3 },
      { label: "Já investimos, mas paramos", value: "paramos", maturidade: 2 },
      { label: "Estamos começando a investir", value: "comecando", maturidade: 2 },
      { label: "Ainda não investimos", value: "nao", maturidade: 1 },
    ],
  },
  {
    id: "ai_usage",
    block: "Tecnologia",
    question: "Vocês já usam IA no atendimento ou nas vendas, além de consultas pontuais?",
    options: [
      { label: "Sim, em várias frentes", value: "varias_areas", maturidade: 3 },
      { label: "Sim, em tarefas pontuais", value: "pontual", maturidade: 2 },
      { label: "Estamos começando a testar", value: "testando", maturidade: 1 },
      { label: "Ainda não usamos", value: "nao", maturidade: 0 },
    ],
  },
  {
    id: "crm_usage",
    block: "Tecnologia",
    question: "Como vocês organizam os leads e orçamentos?",
    options: [
      { label: "Num CRM pago", value: "crm_pago", maturidade: 3 },
      { label: "Em planilha / Excel", value: "planilha", maturidade: 2 },
      { label: "Já testei CRM, mas não uso mais", value: "testei", maturidade: 1 },
      { label: "Fica na conversa do WhatsApp mesmo", value: "nenhum", maturidade: 0 },
    ],
  },

  // ---------- Comercial e pós-viagem ----------
  {
    id: "sales_funnel",
    block: "Comercial e pós-viagem",
    question: "A agência tem um funil de vendas definido?",
    options: [
      { label: "Sim, com etapas e metas claras", value: "definido", vendas: 3, maturidade: 2 },
      { label: "Temos algo informal, não documentado", value: "informal", vendas: 2, maturidade: 1 },
      { label: "Estamos montando agora", value: "montando", vendas: 1, maturidade: 1 },
      { label: "Não temos funil", value: "sem_funil", vendas: 0, maturidade: 0 },
    ],
  },
  {
    id: "follow_up",
    block: "Comercial e pós-viagem",
    question: "O que acontece com um orçamento que o cliente não respondeu?",
    options: [
      { label: "Entra numa cadência automática de follow-up", value: "cadencia_automatica", vendas: 1, maturidade: 3 },
      { label: "O consultor lembra e cobra manualmente", value: "manual", vendas: 2, maturidade: 2 },
      { label: "Às vezes alguém retoma, sem padrão", value: "sem_padrao", vendas: 3, maturidade: 1 },
      { label: "Fica parado e se perde", value: "perde", vendas: 3, maturidade: 0 },
    ],
  },
  {
    id: "post_trip",
    block: "Comercial e pós-viagem",
    question: "Como é o pós-viagem com o cliente?",
    options: [
      { label: "Temos rotina de pós-viagem e recompra", value: "rotina", posVenda: 3, maturidade: 2 },
      { label: "O consultor faz quando lembra", value: "consultor_faz", posVenda: 2, maturidade: 1 },
      { label: "O cliente volta a falar quando precisa", value: "cliente_volta", posVenda: 1, maturidade: 1 },
      { label: "Não temos pós-viagem", value: "sem_pos_viagem", posVenda: 0, maturidade: 0 },
    ],
  },

  // ---------- Urgência ----------
  {
    id: "biggest_challenge",
    block: "Urgência",
    question: "Qual o maior desafio da operação hoje?",
    hint: "Selecione até 2",
    multiple: true,
    maxSelect: 2,
    options: [
      { label: "Demora pra responder e enviar orçamento", value: "demora", atendimento: 2, vendas: 2, maturidade: 2 },
      { label: "Perdemos leads, não damos conta do volume", value: "perdemos_leads", vendas: 3, atendimento: 2, maturidade: 3 },
      { label: "Conversas desorganizadas, ninguém sabe o status", value: "organizacao", vendas: 2, atendimento: 2, posVenda: 1, maturidade: 2 },
      { label: "Não medimos a conversão dos consultores", value: "medir_resultados", vendas: 3, maturidade: 2 },
      { label: "Cliente viaja uma vez e não volta", value: "sem_recorrencia", posVenda: 3, maturidade: 2 },
    ],
  },
  {
    id: "revenue",
    block: "Urgência",
    question: "Qual o faturamento médio mensal da agência?",
    options: [
      { label: "Até R$ 100 mil", value: "ate_100k", maturidade: 1 },
      { label: "R$ 100 mil a R$ 300 mil", value: "100k_300k", maturidade: 2 },
      { label: "R$ 300 mil a R$ 1 milhão", value: "300k_1mi", maturidade: 3 },
      { label: "Acima de R$ 1 milhão", value: "acima_1mi", maturidade: 4 },
    ],
  },
  {
    id: "solution_timeline",
    block: "Urgência",
    question: "Em quanto tempo você quer resolver isso?",
    options: [
      { label: "Agora, essa semana", value: "imediato", maturidade: 4 },
      { label: "Em até 1 mês", value: "1_mes", maturidade: 3 },
      { label: "Nos próximos 3 meses", value: "3_meses", maturidade: 2 },
      { label: "Só pesquisando, sem prazo", value: "sem_prazo", maturidade: 1 },
    ],
  },
];

export const fredy: ProductDefinition = {
  key: "fredy",
  name: "Frédy",
  nameFull: "Frédy.app",
  theName: "o Frédy",
  orgNoun: "agência",
  audience: "agências de viagens",
  tagline: "CRM e automação de vendas com IA para agências de viagens.",
  whatsappDefault: "554740034215",
  siteUrlDefault: "https://diagnostico.fredy.app",
  description:
    "Descubra em 3 minutos o nível de maturidade da sua agência de viagens em IA e onde o Frédy traz mais resultado.",
  totalMinutes: 3,

  landing: {
    h1: "Sua agência está pronta pra vender com IA?",
    lead:
      "Em 3 minutos você descobre o nível de maturidade da sua operação e em qual frente o Frédy traz resultado primeiro: vendas, atendimento ou pós-viagem.",
    stepsIntro:
      "Três etapas, nenhuma delas pede acesso ao seu WhatsApp ou ao seu CRM. Você responde, a pontuação é calculada e o diagnóstico aparece na tela.",
    step1Text:
      "Nome, e-mail e WhatsApp. É pra onde mandamos o relatório e pra onde o time responde, se você quiser conversar.",
    step2Text:
      "Múltipla escolha sobre canais, equipe, orçamentos, follow-up e pós-viagem. Nada de campo aberto pra preencher.",
    step3Text:
      "Nível de maturidade (alta, média ou inicial), o setor onde o Frédy traz mais resultado e os próximos passos.",
    receiveIntro:
      "O diagnóstico olha pra quatro coisas: quanto da sua venda já passa pelo WhatsApp, como a equipe atende hoje, o que acontece com orçamento parado e se existe pós-viagem. Com isso ele mostra onde está o dinheiro que você deixa na mesa.",
    deliverables: [
      "Pontuação de maturidade em IA da sua operação",
      "Setor de maior impacto: vendas, atendimento ou pós-viagem",
      "Três próximos passos práticos, de acordo com o seu nível",
      "Relatório pra baixar e compartilhar com os sócios",
    ],
    calloutText: "Você responde {n} perguntas e sai sabendo se o problema é captar, responder ou fazer o cliente voltar.",
    quote: "Lead que espera orçamento por dois dias já comprou de outra agência.",
    ctaTitle: "Pronto pra descobrir onde sua agência perde venda?",
    ctaText:
      "Leva 3 minutos. Se preferir pular o diagnóstico e falar direto com o time, o WhatsApp está aqui também.",
    whatsappMessage: "Olá! Quero falar com o time Frédy sobre a minha agência.",
  },

  contactLead:
    "O resultado aparece na tela e vai por e-mail. O WhatsApp é só pra quando você quiser falar com o time Frédy.",

  sectors: {
    vendas: {
      label: "Vendas",
      message:
        "O Frédy vai acelerar a conversão: orçamento em minutos, follow-up automático dos orçamentos parados e nenhum lead esquecido no WhatsApp ou Instagram.",
    },
    atendimento: {
      label: "Atendimento",
      message:
        "O Frédy vai organizar o atendimento: triagem com IA, distribuição automática entre consultores e tempo de resposta em segundos, 24 horas por dia.",
    },
    posVenda: {
      label: "Pós-viagem",
      message:
        "O Frédy vai estruturar o pós-viagem: avaliação automática, lembretes de recompra por data e campanhas pra quem já viajou com você.",
    },
  },
  sectorsAllLabel: "Vendas, Atendimento e Pós-viagem",
  sectorsCombinedMessage:
    "O Frédy vai atuar de forma integrada: vendas, atendimento e pós-viagem na mesma ferramenta.",
  sectorsTiedMessage: (labels) =>
    `O Frédy vai atuar em ${labels} ao mesmo tempo, entregando resultado em mais de uma frente.`,

  maturity: {
    alta: "sua operação está pronta pro Frédy. Volume, equipe e urgência já pedem IA no atendimento.",
    media: "sua operação está em evolução. Tem demanda, mas ainda perde venda por falta de processo e velocidade.",
    inicial: "sua operação está em estágio inicial. O primeiro passo é organizar os leads antes de automatizar.",
  },
  nextSteps: {
    alta: [
      "Agendar uma demonstração com o time comercial",
      "Mapear os painéis do CRM (leads, orçamentos, pós-viagem)",
      "Definir o agente de IA do primeiro atendimento",
    ],
    media: [
      "Ver casos de agências parecidas com a sua",
      "Centralizar WhatsApp, Instagram e site num só lugar",
      "Criar uma cadência de follow-up pros orçamentos parados",
    ],
    inicial: [
      "Receber os materiais da Academia Frédy",
      "Registrar cada lead com origem e status",
      "Definir um tempo máximo de resposta pra equipe",
    ],
  },
  cta: {
    alta: {
      text: "Agendar demonstração",
      message: "Olá! Minha agência teve Maturidade Alta no Diagnóstico Frédy e quero agendar uma demonstração.",
    },
    media: {
      text: "Ver casos de agências",
      message: "Olá! Minha agência teve Maturidade Média no Diagnóstico Frédy e quero conhecer casos de agências parecidas.",
    },
    inicial: {
      text: "Receber materiais da Academia",
      message: "Olá! Minha agência teve Maturidade Inicial no Diagnóstico Frédy e quero receber os materiais da Academia Frédy.",
    },
  },

  diagnosisText: ({ levelText, segmentLabel, topLabel, topMessage }) => {
    const who = segmentLabel ? `Operações de ${segmentLabel.toLowerCase()} como a sua tendem` : "Sua operação tende";
    return `Com base nas suas respostas, sua operação tem ${levelText} pra adotar o Frédy. ${who} a ganhar mais rápido em ${topLabel}. ${topMessage}`;
  },

  questions,
};
