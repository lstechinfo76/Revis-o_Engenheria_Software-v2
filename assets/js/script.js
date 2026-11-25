// 🚨 Função Auto-Invocada (IIFE)
(function () {
    // ==========================================
    // AUDIO ENGINE - SONS SUAVES E MODERNOS (CORRIGIDO)
    // ==========================================
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function initAudio() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    // ==========================================
    // ESTADOS GLOBAIS E CONFIGURAÇÕES SALVAS (LocalStorage)
    // ==========================================
    const CONFIG_KEY = "lstechinfo_infosec_config";
    let config = { sound: true, effects: false, theme: 'dark' };

    try {
        const savedConfig = localStorage.getItem(CONFIG_KEY);
        if (savedConfig) config = JSON.parse(savedConfig);
    } catch (e) { console.warn("Aviso: LocalStorage indisponível.", e); }

    let isSoundEnabled = config.sound;
    let isEffectsEnabled = config.effects;

    if (config.theme === 'light') {
        document.body.removeAttribute("data-theme");
        document.getElementById("theme-toggle").querySelector('.icon').textContent = "🌙";
    }

    if (!isEffectsEnabled) {
        document.body.classList.add("no-effects");
        document.getElementById("effects-toggle").classList.add("muted");
    } else {
        document.body.classList.remove("no-effects");
        document.getElementById("effects-toggle").classList.remove("muted");
    }

    if (!isSoundEnabled) {
        document.getElementById("sound-toggle").classList.add("muted");
    }

    function saveConfig() {
        try {
            config.sound = isSoundEnabled;
            config.effects = isEffectsEnabled;
            config.theme = document.body.hasAttribute("data-theme") ? 'dark' : 'light';
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch (e) { }
    }

    // ==========================================
    // SISTEMA DE TOAST E MODAL (CRIADOR)
    // ==========================================
    const toastContainer = document.getElementById("toast-container");
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = `>_ ${message}`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("hide");
            toast.addEventListener("animationend", () => toast.remove());
        }, 2500);
    }

    const aboutBtn = document.getElementById("about-creator-btn");
    const creatorModal = document.getElementById("creator-modal");
    const closeModalBtn = document.getElementById("close-creator-modal");

    if (aboutBtn && creatorModal && closeModalBtn) {
        aboutBtn.addEventListener("click", () => {
            playSound('pop');
            creatorModal.classList.add("active");
            if (headerActions.classList.contains("open")) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            }
        });

        closeModalBtn.addEventListener("click", () => {
            playSound('pop');
            creatorModal.classList.remove("active");
        });

        creatorModal.addEventListener("click", (e) => {
            if (e.target === creatorModal) {
                playSound('pop');
                creatorModal.classList.remove("active");
            }
        });
    }

    // ==========================================
    // MENU HAMBÚRGUER (MOBILE)
    // ==========================================
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const headerActions = document.getElementById("header-actions");

    if (mobileMenuBtn && headerActions) {
        mobileMenuBtn.addEventListener("click", () => {
            const isOpen = headerActions.classList.contains("open");
            if (isOpen) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            } else {
                headerActions.classList.add("open");
                mobileMenuBtn.setAttribute("aria-expanded", "true");
            }
            playSound('pop');
        });

        document.addEventListener("click", (e) => {
            if (headerActions.classList.contains("open") && !headerActions.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ==========================================
    // CONTROLES DE INTERFACE E AUDIO (SUAVE)
    // ==========================================
    function playSound(type) {
        if (!isSoundEnabled) return;
        initAudio();
        const now = audioCtx.currentTime;

        if (type === 'pop') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.05);
        } else if (type === 'correct') {
            [800, 1200].forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.type = 'triangle';
                o.frequency.value = freq;
                g.gain.setValueAtTime(0, now + i * 0.1);
                g.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.02);
                g.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.15);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.15);
            });
        } else if (type === 'wrong') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.3);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'victory') {
            [440, 554, 659, 880].forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.type = 'sine';
                o.frequency.value = freq;
                g.gain.setValueAtTime(0, now + i * 0.1);
                g.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.03);
                g.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.3);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.3);
            });
        }
    }

    const soundToggleBtn = document.getElementById("sound-toggle");
    const effectsToggleBtn = document.getElementById("effects-toggle");
    const themeToggleBtn = document.getElementById("theme-toggle");

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            isSoundEnabled = !isSoundEnabled;
            if (isSoundEnabled) {
                soundToggleBtn.classList.remove("muted");
                showToast("Áudio: ONLINE");
                playSound('pop');
            } else {
                soundToggleBtn.classList.add("muted");
                showToast("Áudio: OFFLINE");
            }
            saveConfig();
        });
    }

    if (effectsToggleBtn) {
        effectsToggleBtn.addEventListener("click", () => {
            isEffectsEnabled = !isEffectsEnabled;
            if (isEffectsEnabled) {
                effectsToggleBtn.classList.remove("muted");
                document.body.classList.remove("no-effects");
                showToast("Efeitos Visuais: ONLINE");
                playSound('pop');
            } else {
                effectsToggleBtn.classList.add("muted");
                document.body.classList.add("no-effects");
                showToast("Efeitos Visuais: OFFLINE");
                playSound('pop');
            }
            saveConfig();
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            playSound('pop');
            const icon = themeToggleBtn.querySelector('.icon') || themeToggleBtn;
            icon.classList.add("spin-icon");
            setTimeout(() => icon.classList.remove("spin-icon"), 400);

            if (document.body.hasAttribute("data-theme")) {
                document.body.removeAttribute("data-theme");
                setTimeout(() => icon.textContent = "🌙", 150);
                showToast("Modo Claro Ativado");
            } else {
                document.body.setAttribute("data-theme", "dark");
                setTimeout(() => icon.textContent = "☀️", 150);
                showToast("Modo Escuro Ativado");
            }
            saveConfig();
        });
    }

    // ==========================================
    // DETECÇÃO INTELIGENTE DE TECLADO FÍSICO
    // ==========================================
    window.addEventListener('keydown', function detectKeyboard(e) {
        if (e.key !== 'Unidentified' && !document.body.classList.contains('keyboard-active')) {
            document.body.classList.add('keyboard-active');
            window.removeEventListener('keydown', detectKeyboard);
        }
    });

    // ==========================================
    // SISTEMA ANTI-CHEAT (REFINADO)
    // ==========================================
    document.addEventListener('contextmenu', event => event.preventDefault());

    document.addEventListener('copy', event => {
        event.preventDefault();
        showToast("ACESSO NEGADO: Cópia restrita.");
    });
    document.addEventListener('cut', event => event.preventDefault());
    document.addEventListener('paste', event => event.preventDefault());
    document.addEventListener('dragstart', event => event.preventDefault());

    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
            (e.ctrlKey && (e.key === 'S' || e.key === 's')) ||
            (e.ctrlKey && (e.key === 'P' || e.key === 'p'))
        ) {
            e.preventDefault();
        }
    });

// ==========================================
    // BANCO DE QUESTÕES - ENGENHARIA DE SOFTWARE (REVISÃO ARA00970005)
    // ==========================================
    const questions = [
        {
            question: "1. Uma empresa de tecnologia desenvolve um sistema de gestão hospitalar. Durante o planejamento, a equipe percebe que o sucesso do projeto depende não apenas da programação, mas também da definição de requisitos, organização das atividades, testes e manutenção. Considerando os fundamentos da Engenharia de Software, assinale a alternativa correta.",
            options: [
                "A Engenharia de Software elimina completamente os riscos dos projetos.",
                "A Engenharia de Software limita-se à construção do código-fonte.",
                "A Engenharia de Software é utilizada exclusivamente em sistemas de grande porte.",
                "A Engenharia de Software aplica princípios, métodos e práticas sistemáticas ao desenvolvimento, operação e manutenção de software.",
                "A Engenharia de Software dispensa documentação quando são utilizadas metodologias ágeis."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE FUNDAMENTOS]</b> A alternativa correta é a <b>D</b>. A Engenharia de Software aplica processos, métodos, ferramentas e práticas de qualidade durante todo o ciclo de vida do software. Seu objetivo é desenvolver sistemas confiáveis, sustentáveis e alinhados às necessidades dos usuários, considerando também custos, prazos e riscos."
        },
        {
            question: "2. Sobre os sistemas de controle de versão, é correto afirmar que:",
            options: [
                "Uma das características dos sistemas de controle de versão é controlar de forma anônima as alterações que são realizadas no sistema versionado, obtendo somente um controle das alterações feitas no decorrer do tempo.",
                "Dado seu comportamento centralizado, o GIT possui a desvantagem de ter um único ponto de falha, onde uma falha no servidor central ocasionará a perda completa do repositório, não sendo possível recuperar a partir do conteúdo existente nos clientes.",
                "O SVN utiliza um modelo centralizado para o versionamento de sistemas, enquanto o GIT apresenta um modelo distribuído, contendo cópias do repositório original em cada cliente.",
                "Em um sistema de controle de versão distribuído, há um único servidor contendo todos os arquivos versionados. Os clientes obtêm somente parte do repositório armazenado no servidor, não possuindo a sua visão completa.",
                "Uma das vantagens em se utilizar um sistema de controle de versão centralizado está no fato de ser possível recuperar o conteúdo original a partir dos repositórios presentes nos clientes."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE VERSIONAMENTO]</b> A alternativa correta é a <b>C</b>. O SVN é tradicionalmente um sistema de controle de versão centralizado, enquanto o Git utiliza uma arquitetura distribuída. No Git, os desenvolvedores normalmente possuem cópias locais do repositório, incluindo seu histórico, permitindo realizar commits e consultar versões mesmo sem conexão com o servidor remoto."
        },
        {
            question: "3. Uma organização iniciou o desenvolvimento de um aplicativo de atendimento médico. O gerente identificou a necessidade de estabelecer objetivos, prazos, recursos, responsáveis e critérios para acompanhar a execução do projeto. Qual atividade de gerenciamento de projetos está sendo realizada?",
            options: [
                "Planejamento do projeto.",
                "Teste de regressão.",
                "Manutenção corretiva.",
                "Implantação contínua.",
                "Refatoração do código."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE GESTÃO]</b> A alternativa correta é a <b>A</b>. O planejamento do projeto estabelece objetivos, escopo, cronograma, recursos, responsabilidades e critérios de acompanhamento. Essas definições orientam a execução e permitem controlar desvios de prazo, custo e qualidade."
        },
        {
            question: "4. O marco de referência do desenvolvimento de um software, com o qual é possível definir a versão de cada item de configuração que fará parte da entrega e validação de um build, é denominado:",
            options: [
                "Encerramento do Projeto",
                "Solicitação de Mudança",
                "Auditoria de Mudanças",
                "Sincronização de Mudanças Concorrentes",
                "Linha de Base"
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE SCM]</b> A alternativa correta é a <b>E</b>. A linha de base representa uma configuração formalmente estabelecida, utilizada como referência para controle de alterações e identificação das versões dos itens de configuração. Ela permite determinar quais componentes integram determinada entrega."
        },
        {
            question: "5. Durante o desenvolvimento de um sistema acadêmico, o cliente solicitou funcionalidades adicionais que não estavam previstas no escopo original. A equipe percebeu que essas alterações poderiam comprometer o prazo e o orçamento. Qual procedimento representa uma boa prática de gerenciamento de projetos?",
            options: [
                "Implementar imediatamente todas as solicitações.",
                "Analisar o impacto das mudanças sobre escopo, prazo, custo e recursos antes de aprová-las.",
                "Ignorar as mudanças para preservar o cronograma.",
                "Transferir integralmente a decisão aos programadores.",
                "Cancelar o projeto sempre que surgir uma nova necessidade."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE GESTÃO]</b> A alternativa correta é a <b>B</b>. O controle integrado de mudanças permite analisar os impactos de novas solicitações antes de incorporá-las ao projeto. Mudanças podem ser necessárias, mas precisam ser avaliadas para evitar atrasos, aumento de custos e alterações não autorizadas no escopo."
        },
        {
            question: "6. Durante a especificação de um sistema bancário, foram definidos os seguintes requisitos:\n\nI. O sistema deverá permitir transferências entre contas.\nII. O sistema deverá responder às consultas em até dois segundos, sob condições de carga especificadas.\nIII. O sistema deverá permitir a emissão de extratos.\n\nAssinale a alternativa correta.",
            options: [
                "Apenas o requisito II é funcional.",
                "Os requisitos I e III são funcionais, enquanto o requisito II é não funcional.",
                "Todos são requisitos não funcionais.",
                "Os requisitos I e II são não funcionais.",
                "Apenas o requisito III é não funcional."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE REQUISITOS]</b> A alternativa correta é a <b>B</b>. Os requisitos I e III descrevem funcionalidades que o sistema deve oferecer: realizar transferências e emitir extratos. O requisito II estabelece uma restrição de desempenho, caracterizando um requisito não funcional."
        },
        {
            question: "7. Uma equipe de desenvolvimento recebeu a responsabilidade de criar um sistema de vendas em seis meses. Para facilitar o acompanhamento, o gerente dividiu o trabalho em entregas menores, incluindo cadastro de clientes, estoque, vendas e relatórios. Essa prática está relacionada principalmente à:",
            options: [
                "Engenharia reversa.",
                "Criptografia de dados.",
                "Implantação de servidores.",
                "Estrutura Analítica do Projeto (EAP).",
                "Testagem de interfaces."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE GESTÃO]</b> A alternativa correta é a <b>D</b>. A Estrutura Analítica do Projeto organiza o escopo em componentes menores e gerenciáveis. Essa decomposição facilita o planejamento, a distribuição de responsabilidades, a estimativa de recursos e o acompanhamento das entregas."
        },
        {
            question: "8. Em relação à Qualidade e Teste de Software, quando um produto é previamente testado e enviado para uma nova avaliação, considere:\n\nI. Todas as partes alteradas nos documentos, funcionalidades e informações devem ser testadas como se fosse um produto novo.\nII. Todas as partes inalteradas que sejam influenciadas pelas partes alteradas ou por mudanças em um requerido sistema (de acordo com os conhecimentos específicos do testador) devem ser testadas por amostragem.\nIII. Todas as outras partes que não foram alteradas ou influenciadas pelas alterações, devem ser testadas como sendo um novo produto.\n\nEstá correto o que se afirma em:",
            options: [
                "III, apenas.",
                "I e III, apenas.",
                "II, apenas.",
                "I, apenas.",
                "I, II e III."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE QUALIDADE]</b> A alternativa correta é a <b>D</b>. A afirmativa I está correta, pois as partes alteradas precisam ser verificadas novamente. A afirmativa III está incorreta porque não é necessário tratar todas as partes não afetadas como um produto novo. A afirmativa II não estabelece um procedimento universalmente adequado, pois a seleção dos testes de regressão deve considerar análise de impacto e risco, não simplesmente uma amostragem obrigatória."
        },
        {
            question: "9. Uma empresa de software identificou que a indisponibilidade de um fornecedor de serviços em nuvem poderia atrasar a implantação de seu sistema. A equipe decidiu contratar um serviço alternativo para reduzir a dependência do fornecedor principal. Essa decisão representa uma estratégia de:",
            options: [
                "Mitigação do risco.",
                "Aceitação passiva do risco.",
                "Encerramento antecipado do projeto.",
                "Eliminação de requisitos.",
                "Transferência integral da responsabilidade ao cliente."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE RISCOS]</b> A alternativa correta é a <b>A</b>. A mitigação busca reduzir a probabilidade de ocorrência ou o impacto de um risco. Ao contratar uma alternativa de infraestrutura, a empresa diminui os efeitos de uma possível indisponibilidade do fornecedor principal."
        },
        {
            question: "10. Uma instituição financeira pretende desenvolver um sistema com requisitos estáveis, documentação formal e etapas sequenciais de desenvolvimento. Qual modelo apresenta maior compatibilidade com essas características?",
            options: [
                "Kanban.",
                "Prototipação descartável.",
                "Scrum.",
                "Desenvolvimento exploratório.",
                "Modelo Cascata."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE METODOLOGIA]</b> A alternativa correta é a <b>E</b>. O modelo Cascata organiza o desenvolvimento em fases predominantemente sequenciais, como requisitos, projeto, implementação e testes. É mais compatível com projetos cujos requisitos são conhecidos e relativamente estáveis, embora apresente limitações quando ocorrem mudanças frequentes."
        },
        {
            question: "11. Um projeto de desenvolvimento apresenta atraso em atividades essenciais. O gerente precisa identificar quais tarefas influenciam diretamente a data de conclusão. Qual técnica é mais adequada para essa análise?",
            options: [
                "Controle de versão.",
                "Método do Caminho Crítico (CPM).",
                "Prototipação de interfaces.",
                "Teste de caixa-preta.",
                "Análise de usabilidade."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE GESTÃO]</b> A alternativa correta é a <b>B</b>. O Método do Caminho Crítico identifica a sequência de atividades que determina a duração mínima do projeto. Atrasos nas atividades críticas podem comprometer a data final, especialmente quando não existe folga disponível."
        },
        {
            question: "12. Uma aplicação de telemedicina apresenta bom desempenho com poucos usuários, mas sofre lentidão quando centenas de pessoas acessam simultaneamente o sistema. Qual característica de qualidade está mais diretamente relacionada a esse problema?",
            options: [
                "Compatibilidade de interface.",
                "Facilidade de instalação.",
                "Eficiência de desempenho.",
                "Usabilidade estética.",
                "Portabilidade."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE QUALIDADE]</b> A alternativa correta é a <b>C</b>. A eficiência de desempenho está relacionada ao comportamento temporal, à utilização de recursos e à capacidade do sistema sob determinadas condições de carga. A lentidão com muitos usuários indica a necessidade de avaliar desempenho, escalabilidade e utilização de recursos."
        },
        {
            question: "13. Uma equipe foi contratada para desenvolver um sistema de prontuário eletrônico. Antes de iniciar a programação, realizou entrevistas com médicos, enfermeiros e gestores para compreender as necessidades do sistema. Essa atividade corresponde principalmente à fase de:",
            options: [
                "Implantação.",
                "Testes de desempenho.",
                "Codificação.",
                "Levantamento e análise de requisitos.",
                "Manutenção corretiva."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE REQUISITOS]</b> A alternativa correta é a <b>D</b>. O levantamento e a análise de requisitos identificam necessidades, expectativas e restrições dos usuários. As informações coletadas orientam a especificação do sistema e as etapas posteriores de projeto, implementação e validação."
        },
        {
            question: "14. Ao analisar a aplicação da prototipação em seus projetos de software, decidiu-se utilizar um processo que define 4 etapas para o desenvolvimento de protótipos, sendo essas etapas:\n\nI. Avaliar Protótipo.\nII. Estabelecer Objetivos do Protótipo.\nIII. Desenvolver o Protótipo.\nIV. Definir a Funcionalidade do Protótipo.\n\nA ordem sequencial correta para a execução dessas quatro etapas é:",
            options: [
                "IV, I, II e III.",
                "III, II, IV e I.",
                "IV, II, I e III.",
                "II, IV, III e I.",
                "I, IV, II e III."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE PROCESSOS]</b> A alternativa correta é a <b>D</b>. A prototipação começa pelo estabelecimento dos objetivos (II), seguido da definição das funcionalidades (IV), do desenvolvimento do protótipo (III) e de sua avaliação (I). Essa sequência permite validar ideias e obter feedback antes de avançar no desenvolvimento."
        },
        {
            question: "15. Uma startup desenvolve um aplicativo cujos requisitos ainda não estão completamente definidos. A equipe pretende apresentar versões funcionais aos usuários e incorporar melhorias com base no feedback recebido. Qual abordagem é mais adequada?",
            options: [
                "Implantação sem testes.",
                "Desenvolvimento exclusivamente sequencial.",
                "Desenvolvimento iterativo e incremental.",
                "Eliminação da análise de requisitos.",
                "Manutenção exclusivamente corretiva."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE METODOLOGIA]</b> A alternativa correta é a <b>C</b>. O desenvolvimento iterativo e incremental permite construir e aperfeiçoar o software progressivamente. A cada ciclo, a equipe pode obter feedback, revisar requisitos e adicionar funcionalidades, reduzindo os riscos associados às incertezas iniciais."
        },
        {
            question: "16. A Engenharia de Software é uma tecnologia em camada. Avalie a relação entre os conceitos e definições a seguir:\n\n[1] Camada qualidade\n[2] Camada de processo\n[3] Camada de métodos\n\n[A] Determina as etapas de desenvolvimento do software.\n[B] Garante que os requisitos que atendem as expectativas do usuário serão cumpridos.\n[C] Define os artefatos gerados em função da técnica de modelagem adotada, tal como modelo de casos de uso ou de classes.\n\nAssinale a opção que corretamente relaciona os referidos conceitos e definições:",
            options: [
                "[1][B] - [2][A] - [3][C]",
                "[1][C] - [2][B] - [3][A].",
                "[1][A] - [2][B] - [3][C]",
                "[1][C] - [2][A] - [3][B].",
                "[1][B] - [2][C] - [3][A]."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE FUNDAMENTOS]</b> A alternativa correta é a <b>A</b>. A camada de qualidade está associada à garantia de atendimento às expectativas e aos requisitos de qualidade (B). A camada de processo organiza as atividades e etapas do desenvolvimento (A). A camada de métodos estabelece as técnicas de análise, projeto e modelagem, incluindo os artefatos produzidos (C)."
        },
        {
            question: "17. Uma empresa desenvolve um sistema crítico com elevada complexidade técnica. O gerente decidiu utilizar um modelo que combina desenvolvimento iterativo com análise sistemática dos riscos. Qual modelo apresenta essa característica?",
            options: [
                "Modelo exclusivamente linear.",
                "Modelo Espiral.",
                "Modelo Cascata.",
                "Modelo de prototipação descartável, sem análise de riscos.",
                "Modelo de codificação e correção."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE METODOLOGIA]</b> A alternativa correta é a <b>B</b>. O modelo Espiral, proposto por Barry Boehm, combina desenvolvimento iterativo com avaliação sistemática de riscos. Cada ciclo envolve planejamento, análise de riscos, desenvolvimento e avaliação dos resultados."
        },
        {
            question: "18. Uma equipe concluiu a especificação dos requisitos de um aplicativo e iniciou a definição dos componentes, interfaces, banco de dados e comunicação entre módulos. Essa atividade pertence principalmente à fase de:",
            options: [
                "Implantação.",
                "Treinamento dos usuários.",
                "Manutenção.",
                "Levantamento inicial de necessidades.",
                "Projeto e arquitetura de software."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE ARQUITETURA]</b> A alternativa correta é a <b>E</b>. A fase de projeto e arquitetura transforma os requisitos em uma solução técnica. Nela são definidos os componentes, as interfaces, a estrutura dos dados e as relações entre os módulos, orientando a implementação do sistema."
        },
        {
            question: "19. Uma equipe utiliza Scrum para desenvolver um sistema acadêmico. Durante uma Sprint, os desenvolvedores realizam reuniões diárias para inspecionar o progresso em direção ao objetivo da Sprint e adaptar o plano de trabalho. Qual evento está sendo descrito?",
            options: [
                "Sprint Retrospective.",
                "Sprint Review.",
                "Daily Scrum.",
                "Sprint Planning.",
                "Product Backlog Refinement."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG AGILE]</b> A alternativa correta é a <b>C</b>. A Daily Scrum é um evento de 15 minutos destinado aos desenvolvedores. Seu objetivo é inspecionar o progresso em direção ao Sprint Goal e adaptar o planejamento do trabalho, favorecendo a comunicação e a identificação de impedimentos."
        },
        {
            question: "20. Após o lançamento de um sistema bancário, os usuários relataram que o aplicativo travava com frequência e apresentava erros nos cálculos de saldo. A empresa decidiu investir em práticas de qualidade de software. Considerando essa situação, uma prática que contribui diretamente para a qualidade do software é:",
            options: [
                "ignorar as reclamações dos usuários.",
                "eliminar a fase de testes para entregar o sistema mais rápido.",
                "evitar a documentação do sistema.",
                "realizar testes para identificar e corrigir defeitos antes da entrega.",
                "alterar o código diretamente no ambiente de produção."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE QUALIDADE]</b> A alternativa correta é a <b>D</b>. A execução de testes permite identificar defeitos antes da disponibilização do sistema. Em aplicações bancárias, falhas nos cálculos e travamentos comprometem a confiabilidade, tornando indispensáveis verificações funcionais e não funcionais."
        },
        {
            question: "21. Uma empresa utiliza Kanban para organizar as atividades de desenvolvimento. A equipe percebe que muitas tarefas são iniciadas simultaneamente, mas poucas são concluídas. Qual prática do Kanban contribui diretamente para melhorar esse cenário?",
            options: [
                "Limitar o trabalho em progresso (WIP).",
                "Estabelecer obrigatoriamente Sprints mensais.",
                "Eliminar a visualização das tarefas.",
                "Remover todas as métricas de fluxo.",
                "Proibir a identificação de gargalos."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG AGILE]</b> A alternativa correta é a <b>A</b>. Os limites de trabalho em progresso restringem a quantidade de atividades simultâneas. Essa prática ajuda a identificar gargalos, melhora o fluxo de trabalho e incentiva a conclusão das tarefas antes do início de novas atividades."
        },
        {
            question: "22. Uma gráfica recebe encomendas pelo seu site. Para implementar o cálculo do preço dos pedidos, a equipe escolheu desenvolvimento orientado a testes, prática de XP (Extreme Programming). A regra de preço já foi acordada. Qual sequência respeita a característica test first dessa prática?",
            options: [
                "Implementar o cálculo e usar sua primeira saída para definir o resultado esperado",
                "Escrever o teste do resultado esperado, implementar o cálculo e executar o teste",
                "Implementar o cálculo, testar manualmente e só depois automatizar os testes",
                "Implementar todas as funções, elaborar testes de integração e testar o conjunto",
                "Implementar o cálculo, elaborar os testes e conferir os resultados"
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE TESTES]</b> A alternativa correta é a <b>B</b>. No desenvolvimento orientado a testes (TDD), os testes são escritos antes da implementação da funcionalidade. O ciclo completo é conhecido como Red, Green e Refactor: criar um teste que inicialmente falha, implementar o código necessário para fazê-lo passar e refatorar a solução preservando o comportamento esperado."
        },
        {
            question: "23. Uma equipe deseja adotar práticas de Extreme Programming (XP) para melhorar a qualidade do código e reduzir defeitos durante o desenvolvimento. Qual alternativa apresenta práticas associadas ao XP?",
            options: [
                "Desenvolvimento sem testes e integração apenas ao final.",
                "Proibição de refatoração durante o projeto.",
                "Eliminação da participação do cliente.",
                "Documentação como única forma de validação.",
                "Programação em pares, desenvolvimento orientado a testes e integração contínua."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG AGILE]</b> A alternativa correta é a <b>E</b>. O Extreme Programming utiliza práticas como programação em pares, TDD, refatoração e integração contínua. Essas práticas favorecem a colaboração, o feedback rápido e a melhoria contínua da qualidade do código."
        },
        {
            question: "24. Uma plataforma de comércio eletrônico apresenta falhas frequentes durante o processamento de pagamentos. A equipe de qualidade decidiu acompanhar a frequência e a severidade dessas falhas. Qual atributo de qualidade está sendo avaliado principalmente?",
            options: [
                "Compatibilidade visual.",
                "Estética.",
                "Confiabilidade.",
                "Usabilidade.",
                "Portabilidade."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE QUALIDADE]</b> A alternativa correta é a <b>C</b>. A confiabilidade está relacionada à capacidade do software de executar suas funções de maneira consistente sob condições especificadas. A frequência e a severidade das falhas são indicadores importantes para avaliar esse atributo."
        },
        {
            question: "25. Uma empresa atualizou seu sistema de cadastro de clientes. Após a alteração, funcionalidades anteriormente aprovadas passaram a apresentar defeitos. Qual modalidade de teste é especialmente indicada para identificar esse tipo de problema?",
            options: [
                "Teste de regressão.",
                "Teste de documentação.",
                "Teste de instalação exclusivamente.",
                "Teste de aceitação sem execução.",
                "Teste de interface sem critérios."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE QUALIDADE]</b> A alternativa correta é a <b>A</b>. O teste de regressão verifica se modificações recentes introduziram defeitos em funcionalidades anteriormente aprovadas. Ele é importante em sistemas que recebem atualizações frequentes, pois ajuda a preservar o comportamento esperado."
        },
        {
            question: "26. No contexto da etapa de projeto do processo de desenvolvimento de software, avalie a relação entre os conceitos e definições a seguir:\n\n[1] Implantação\n[2] Manutenção\n[3] Reengenharia de software\n\n[A] Inclui a correção de defeitos não identificados nas etapas anteriores do processo de desenvolvimento de software.\n[B] Permite a modificação de um software existente a partir de alterações significativas nas regras de negócio.\n[C] Etapa do processo de desenvolvimento de software relacionada com a transferência do sistema da comunidade de desenvolvimento para a comunidade de usuários.\n\nAssinale a opção que corretamente relaciona os referidos conceitos e definições:",
            options: [
                "[1][B] - [2][A] - [3][C].",
                "[1][C] - [2][B] - [3][A].",
                "[1][A] - [2][B] - [3][C].",
                "[1][C] - [2][A] - [3][B].",
                "[1][B] - [2][C] - [3][A]."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE PROCESSOS]</b> A alternativa correta é a <b>D</b>. Implantação (1) corresponde à transferência do sistema para o ambiente de utilização (C). Manutenção (2) inclui a correção de defeitos identificados após o desenvolvimento (A). Reengenharia (3) envolve a transformação de sistemas existentes, podendo incorporar mudanças significativas em sua estrutura e regras de negócio (B)."
        },
        {
            question: "27. Uma equipe trabalha em um sistema de vendas utilizando Git. Dois desenvolvedores alteram a mesma região de um arquivo e, durante a integração, surge um conflito. Qual procedimento é mais adequado?",
            options: [
                "Excluir permanentemente uma das branches.",
                "Analisar as alterações, resolver o conflito e validar o resultado antes de concluir a integração.",
                "Desativar o histórico do repositório.",
                "Remover o arquivo conflitante.",
                "Publicar ambas as versões sem verificação."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE VERSIONAMENTO]</b> A alternativa correta é a <b>B</b>. Os conflitos de merge ocorrem quando o Git não consegue combinar automaticamente determinadas alterações. A equipe deve analisar as diferenças, resolver os conflitos e executar verificações para garantir que o resultado integrado preserve o comportamento esperado."
        },
        {
            question: "28. Uma organização está elaborando seu plano de gerenciamento de configurações. Considere as afirmativas:\n\nI. O plano deve identificar os itens de configuração que serão controlados.\nII. O plano deve definir responsabilidades e procedimentos para o controle de mudanças.\nIII. O plano deve estabelecer ferramentas e mecanismos de registro das informações de configuração.\n\nÉ correto o que se afirma em:",
            options: [
                "I e III, apenas.",
                "II, apenas.",
                "I, apenas.",
                "II e III, apenas.",
                "I, II e III."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE SCM]</b> A alternativa correta é a <b>E</b>. O plano de gerenciamento de configurações deve identificar os itens controlados, estabelecer responsabilidades, definir procedimentos para mudanças e determinar mecanismos de registro e acompanhamento. Portanto, as três afirmativas estão corretas."
        },
        {
            question: "29. Uma empresa implementou integração contínua para reduzir problemas durante o desenvolvimento de software. Qual alternativa descreve corretamente essa prática?",
            options: [
                "Eliminar a necessidade de testes unitários.",
                "Integrar todas as alterações somente no encerramento do projeto.",
                "Integrar alterações frequentemente e executar verificações automatizadas para identificar problemas antecipadamente.",
                "Publicar todas as versões diretamente em produção, independentemente dos testes.",
                "Substituir o controle de versões por documentação manual."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE CI/CD]</b> A alternativa correta é a <b>C</b>. A integração contínua incentiva a incorporação frequente de alterações em um repositório compartilhado, acompanhada de verificações automatizadas, como construção e testes. Isso permite identificar problemas de integração antecipadamente."
        },
        {
            question: "30. Uma equipe desenvolve um sistema de agendamento de consultas. O projeto utiliza Git, testes automatizados e um pipeline CI/CD. Qual sequência representa adequadamente a integração dessas práticas?",
            options: [
                "Substituir o versionamento por arquivos compartilhados sem histórico.",
                "Executar todos os testes somente após o encerramento do projeto.",
                "Publicar diretamente em produção e registrar as alterações posteriormente.",
                "Versionar alterações, executar verificações automatizadas, preparar a versão e realizar a implantação conforme os critérios definidos.",
                "Eliminar testes para aumentar a velocidade das entregas."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE DEVOPS]</b> A alternativa correta é a <b>D</b>. O versionamento registra as alterações realizadas no software. Em seguida, o pipeline automatizado pode executar testes e outras verificações de qualidade, preparar os artefatos e disponibilizar a versão para implantação conforme os critérios estabelecidos. Esse processo contribui para a rastreabilidade, a confiabilidade e a qualidade das entregas."
        }
    ];

    const getAnswer = (q) => parseInt(atob(q._k));

    // ==========================================
    // VARIÁVEIS DE ESTADO E DOM PRINCIPAL
    // ==========================================
    const startScreen = document.getElementById("start-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultScreen = document.getElementById("result-screen");
    const startBtn = document.getElementById("start-btn");
    const nextBtn = document.getElementById("next-btn");
    const skipBtn = document.getElementById("skip-btn");
    const restartBtn = document.getElementById("restart-btn");
    const showReviewBtn = document.getElementById("show-review-btn");
    const shareBtn = document.getElementById("share-btn");
    const homeLink = document.getElementById("home-link");
    const questionAreaContainer = document.querySelector(".question-area");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const progressBar = document.getElementById("progress-bar");
    const questionTracker = document.getElementById("question-tracker");
    const quizActions = document.getElementById("quiz-actions");
    const explanationContainer = document.getElementById("explanation-container");
    const explanationText = document.getElementById("explanation-text");
    const scoreText = document.getElementById("score-text");
    const totalText = document.getElementById("total-text");
    const feedbackText = document.getElementById("feedback-text");
    const reviewContainer = document.getElementById("review-container");
    const reviewContent = document.getElementById("review-content");
    const historyContainer = document.getElementById("historico-container");
    const historyScoreText = document.getElementById("historico-acertos");
    const viewPastReviewBtn = document.getElementById("view-past-review-btn");
    const QUIZ_HISTORY_KEY = "lstechinfo_engsoft_simulado2";

    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let isReviewVisible = false;
    let timerInterval;
    let secondsElapsed = 0;
    let isTransitioning = false;

    const iconCheck = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const iconX = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    const iconArrow = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

    // ==========================================
    // LÓGICA DO QUIZ E TRANSIÇÕES SEGURAS
    // ==========================================
    function startTimer() {
        secondsElapsed = 0;
        const timerElement = document.getElementById('quiz-timer');
        if (timerElement) timerElement.textContent = "00:00";
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsElapsed++;
            if (timerElement) {
                const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
                const s = (secondsElapsed % 60).toString().padStart(2, '0');
                timerElement.textContent = `${m}:${s}`;
            }
        }, 1000);
    }
    function stopTimer() { clearInterval(timerInterval); }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') return;

        if (quizScreen.classList.contains('active')) {
            const key = e.key.toLowerCase();
            const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 };

            if (!quizActions.classList.contains('is-answered')) {
                if (keyMap[key] !== undefined && optionsContainer.children[keyMap[key]]) {
                    e.preventDefault();
                    initAudio();
                    optionsContainer.children[keyMap[key]].click();
                    return;
                }
                if (key === 's') {
                    e.preventDefault();
                    initAudio();
                    skipBtn.click();
                    return;
                }
            } else if (e.code === 'Enter' || e.code === 'ArrowRight') {
                e.preventDefault();
                initAudio();
                if (!nextBtn.classList.contains("hidden-btn")) {
                    nextBtn.click();
                }
                return;
            }
        } else if (startScreen.classList.contains('active') && e.code === 'Enter') {
            e.preventDefault();
            initAudio();
            startBtn.click();
        }
    });

    startBtn.addEventListener("click", () => { playSound('pop'); startQuiz(); });
    nextBtn.addEventListener("click", () => { playSound('pop'); loadNextQuestion(); });
    skipBtn.addEventListener("click", () => { playSound('pop'); skipQuestion(); });
    restartBtn.addEventListener("click", () => { playSound('pop'); resetQuiz(); });
    showReviewBtn.addEventListener("click", () => { playSound('pop'); toggleReview(); });
    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            playSound('pop');
            exportReport();
        });
    }
    if (viewPastReviewBtn) {
        viewPastReviewBtn.addEventListener("click", () => {
            playSound('pop');
            openStoredReview();
        });
    }
    homeLink.addEventListener("click", () => window.location.reload());

    renderHistoryCard();

    function scrambleText(element, newText) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let iterations = 0;
        const step = Math.max(1, Math.floor(newText.length / 20));

        const interval = setInterval(() => {
            element.innerText = newText.split('').map((letter, index) => {
                if (index < iterations) return newText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');

            if (iterations >= newText.length) {
                element.innerText = newText;
                clearInterval(interval);
            }
            iterations += step;
        }, 30);
    }

    function startQuiz() {
        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("hidden", "active");
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = Array(questions.length).fill(null);
        isTransitioning = false;
        isReviewVisible = false;
        updateScoreUI(0, questions.length);
        progressBar.style.background = `linear-gradient(90deg, var(--primary), var(--accent))`;
        progressBar.style.boxShadow = `0 0 10px var(--primary-glow)`;
        scoreText.classList.remove("pop-success");
        reviewContainer.classList.add("hidden");
        showReviewBtn.textContent = "Ver logs detalhados";
        startTimer();
        renderQuestion();
    }

    function renderQuestion() {
        isTransitioning = false;
        questionAreaContainer.classList.remove("slide-out-left");
        questionAreaContainer.classList.add("slide-in-right");
        quizActions.classList.remove("is-answered");

        nextBtn.classList.add("hidden-btn");
        skipBtn.classList.remove("hidden-btn");

        nextBtn.disabled = false;
        skipBtn.disabled = false;

        explanationContainer.classList.add("hidden");
        explanationContainer.style.display = "none";
        explanationText.innerHTML = "";

        optionsContainer.innerHTML = "";

        const stamp = document.getElementById("access-stamp");
        if (stamp) {
            stamp.classList.remove("show-granted", "show-denied");
            stamp.classList.add("hidden");
        }

        const currentQuestion = questions[currentQuestionIndex];

        if (isEffectsEnabled) {
            scrambleText(questionText, currentQuestion.question);
        } else {
            questionText.innerText = currentQuestion.question;
        }

        questionTracker.textContent = `Varredura de Nó ${currentQuestionIndex + 1} de ${questions.length}`;
        progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;

        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement("button");

            button.setAttribute("role", "radio");
            button.setAttribute("aria-checked", "false");
            button.setAttribute("aria-label", `Opção ${String.fromCharCode(65 + index)}: ${option}`);

            button.innerHTML = `<strong class="opt-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</strong> <span>${option}</span>`;
            button.classList.add("option-btn");

            if (isEffectsEnabled) {
                button.style.opacity = "0";
                button.style.transform = "translateY(10px)";
                button.style.animation = `fadeIn 0.3s ease ${index * 0.08}s forwards`;
            } else {
                button.style.opacity = "1";
                button.style.transform = "none";
                button.style.animation = "none";
            }

            button.addEventListener("click", () => { playSound('pop'); selectAnswer(button, index); });
            optionsContainer.appendChild(button);
        });
    }

    function selectAnswer(selectedButton, selectedIndex) {
        if (isTransitioning || quizActions.classList.contains("is-answered")) return;
        quizActions.classList.add("is-answered");

        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        const correctIndex = getAnswer(currentQuestion);
        const isCorrect = selectedIndex === correctIndex;
        userAnswers[currentQuestionIndex] = selectedIndex;

        explanationText.innerHTML = currentQuestion.explanation;
        explanationContainer.classList.remove("hidden");
        explanationContainer.style.display = "block";

        Array.from(optionsContainer.children).forEach((btn) => {
            btn.disabled = true;
            btn.setAttribute("aria-disabled", "true");
        });
        selectedButton.setAttribute("aria-checked", "true");

        const stamp = document.getElementById("access-stamp");

        if (isCorrect) {
            playSound('correct');
            selectedButton.classList.add("correct");
            if (stamp && isEffectsEnabled) {
                stamp.textContent = "ACESSO CONCEDIDO";
                stamp.classList.remove("hidden");
                stamp.classList.add("show-granted");
                setTimeout(() => stamp.classList.remove("show-granted"), 1500);
            }
        } else {
            playSound('wrong');
            selectedButton.classList.add("wrong");
            if (optionsContainer.children[correctIndex]) {
                optionsContainer.children[correctIndex].classList.add("correct");
            }
            if (stamp && isEffectsEnabled) {
                stamp.textContent = "ACESSO NEGADO";
                stamp.classList.remove("hidden");
                stamp.classList.add("show-denied");
                setTimeout(() => stamp.classList.remove("show-denied"), 1500);
            }
        }

        score = calculateFinalScore();
        const answeredSoFar = userAnswers.filter(answer => answer !== null).length || 1;
        const accuracy = score / answeredSoFar;

        if (accuracy >= 0.8) {
            progressBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            progressBar.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
        } else if (accuracy >= 0.5) {
            progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            progressBar.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.5)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            progressBar.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
        }

        skipBtn.classList.add("hidden-btn");
        nextBtn.classList.remove("hidden-btn");

        nextBtn.innerHTML = currentQuestionIndex < questions.length - 1 ? 'Próxima ➔ <span class="kbd-shortcut" aria-hidden="true">(Enter)</span>' : "Descriptografar Relatório";
        nextBtn.focus();
    }

    function skipQuestion() {
        if (isTransitioning || quizActions.classList.contains("is-answered")) return;
        quizActions.classList.add("is-answered");
        userAnswers[currentQuestionIndex] = -1;
        triggerNextAnimation();
    }

    function loadNextQuestion() {
        if (isTransitioning) return;
        triggerNextAnimation();
    }

    function triggerNextAnimation() {
        if (isTransitioning) return;
        isTransitioning = true;
        nextBtn.disabled = true;
        skipBtn.disabled = true;

        if (isEffectsEnabled) {
            questionAreaContainer.classList.remove("slide-in-right");
            questionAreaContainer.classList.add("slide-out-left");
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    renderQuestion();
                } else {
                    stopTimer();
                    showResults();
                }
            }, 300);
        } else {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                renderQuestion();
            } else {
                stopTimer();
                showResults();
            }
        }
    }

    function calculateFinalScore() {
        return questions.reduce((total, q, index) => {
            return total + (userAnswers[index] === getAnswer(q) ? 1 : 0);
        }, 0);
    }

    function updateScoreUI(finalScore, totalQuestions) {
        if (scoreText) scoreText.textContent = String(finalScore);
        if (totalText) totalText.textContent = String(totalQuestions);

        const totalWrapper = totalText ? totalText.parentElement : null;
        if (totalWrapper) {
            totalWrapper.style.whiteSpace = "nowrap";
            totalWrapper.style.display = "inline-flex";
            totalWrapper.style.alignItems = "baseline";
            totalWrapper.style.justifyContent = "center";
            totalWrapper.style.gap = "0.25rem";
        }
    }

    function showResults() {
        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("active", "hidden");
        resultScreen.classList.replace("hidden", "active");
        progressBar.style.width = "100%";

        score = calculateFinalScore();
        updateScoreUI(score, questions.length);

        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('time-total-text').textContent = `${m}m ${s}s`;
        const avg = secondsElapsed > 0 ? (secondsElapsed / questions.length).toFixed(1) : 0;
        document.getElementById('time-avg-text').textContent = `${avg}s`;

        const scoreCircleUI = document.getElementById("score-circle-ui");
        if (scoreCircleUI) scoreCircleUI.classList.remove("gold-glow");
        feedbackText.classList.remove("perfect-score-text");

        if (score === questions.length) {
            feedbackText.textContent = "🏆 Auditoria impecável! Domínio absoluto das metodologias e arquitetura de software!";
            feedbackText.classList.add("perfect-score-text");
            playSound('victory');
            if (scoreCircleUI) scoreCircleUI.classList.add("gold-glow");
            if (typeof confetti === 'function' && isEffectsEnabled) confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#10b981', '#00ff88', '#00cc6a'] });
        } else if (score >= questions.length * 0.7) {
            feedbackText.textContent = "Build resistente! Sua base teórica em Engenharia de Software está bem sólida. 👍";
        } else {
            feedbackText.textContent = "Foram detectadas vulnerabilidades nos seus conhecimentos. Recomendo repassar a matriz de testes. 📚";
        }

        saveQuizHistory();
        generateReviewContent();

        reviewContainer.classList.remove("hidden");
        isReviewVisible = true;
        showReviewBtn.textContent = "Ocultar logs";
        renderHistoryCard();
    }

    function generateReviewContent() {
        reviewContent.innerHTML = "";
        questions.forEach((q, index) => {
            const userAnswerIndex = userAnswers[index];
            const correctIndex = getAnswer(q);
            const isCorrect = userAnswerIndex === correctIndex;
            const skipped = userAnswerIndex === -1;
            const reviewBox = document.createElement("div");
            reviewBox.classList.add("review-item");

            let htmlContent = `<h4>${q.question}</h4><div class="review-ans-group">`;
            if (isCorrect) {
                htmlContent += `<div class="review-ans-text correct">${iconCheck} <span><b>Resposta enviada: ${String.fromCharCode(65 + userAnswerIndex)})</b> ${q.options[userAnswerIndex]}</span></div>`;
            } else if (skipped) {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span>Questão pulada.</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            } else if (userAnswerIndex === null || userAnswerIndex === undefined || !q.options[userAnswerIndex]) {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span>Sem resposta registrada.</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            } else {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span><b>Resposta enviada: ${String.fromCharCode(65 + userAnswerIndex)})</b> ${q.options[userAnswerIndex]}</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            }
            htmlContent += `</div><div class="review-exp"><strong>💡 Output Técnico:</strong><p>${q.explanation}</p></div>`;
            reviewBox.innerHTML = htmlContent;
            reviewContent.appendChild(reviewBox);
        });
    }

    function getStoredHistory() {
        try {
            const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !Array.isArray(data.answers)) return null;
            return data;
        } catch (error) {
            console.warn("Não foi possível ler o histórico do quiz.", error);
            return null;
        }
    }

    function saveQuizHistory() {
        try {
            const safeAnswers = questions.map((_, index) => {
                const value = userAnswers[index];
                return Number.isInteger(value) ? value : null;
            });

            const payload = {
                score: calculateFinalScore(),
                total: questions.length,
                answers: safeAnswers,
                secondsElapsed,
                completedAt: new Date().toISOString(),
                pageUrl: window.location.href
            };

            localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(payload));
        } catch (error) {
            console.warn("Não foi possível salvar o histórico do quiz.", error);
        }
    }

    function renderHistoryCard() {
        if (!historyContainer || !historyScoreText) return;

        const history = getStoredHistory();
        if (!history) {
            historyContainer.classList.add("hidden");
            return;
        }

        const storedScore = Number.isFinite(Number(history.score)) ? Number(history.score) : 0;
        historyScoreText.textContent = String(storedScore);
        historyContainer.classList.remove("hidden");
    }

    function fillResultScreenFromCurrentState() {
        score = calculateFinalScore();
        updateScoreUI(score, questions.length);

        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('time-total-text').textContent = `${m}m ${s}s`;
        const avg = secondsElapsed > 0 ? (secondsElapsed / questions.length).toFixed(1) : 0;
        document.getElementById('time-avg-text').textContent = `${avg}s`;

        const scoreCircleUI = document.getElementById("score-circle-ui");
        if (scoreCircleUI) scoreCircleUI.classList.remove("gold-glow");
        feedbackText.classList.remove("perfect-score-text");

        if (score === questions.length) {
            feedbackText.textContent = "🏆 Auditoria impecável! Domínio absoluto das metodologias e arquitetura de software!";
            feedbackText.classList.add("perfect-score-text");
            if (scoreCircleUI) scoreCircleUI.classList.add("gold-glow");
        } else if (score >= questions.length * 0.7) {
            feedbackText.textContent = "Build resistente! Sua base teórica em Engenharia de Software está bem sólida. 👍";
        } else {
            feedbackText.textContent = "Foram detectadas vulnerabilidades nos seus conhecimentos. Recomendo repassar a matriz de testes. 📚";
        }

        generateReviewContent();
    }

    function openStoredReview() {
        const history = getStoredHistory();
        if (!history) {
            alert("Ainda não existe um gabarito salvo. Finalize uma simulação primeiro.");
            renderHistoryCard();
            return;
        }

        stopTimer();
        secondsElapsed = Number.isFinite(Number(history.secondsElapsed)) ? Number(history.secondsElapsed) : 0;
        userAnswers = questions.map((_, index) => {
            const value = history.answers[index];
            return Number.isInteger(value) ? value : null;
        });
        currentQuestionIndex = questions.length;
        isTransitioning = false;

        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("active", "hidden");
        quizScreen.classList.add("hidden");
        resultScreen.classList.replace("hidden", "active");

        fillResultScreenFromCurrentState();
        reviewContainer.classList.remove("hidden");
        isReviewVisible = true;
        showReviewBtn.textContent = "Ocultar logs";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function toggleReview() {
        isReviewVisible = !isReviewVisible;
        if (isReviewVisible) {
            reviewContainer.classList.remove("hidden");
            showReviewBtn.textContent = "Ocultar logs";
        } else {
            reviewContainer.classList.add("hidden");
            showReviewBtn.textContent = "Ver logs detalhados";
        }
    }

    // ==========================================
    // EXPORTAÇÃO INTELIGENTE (WHATSAPP + TEXTO DINÂMICO)
    // ==========================================
    async function exportReport() {
        const reportArea = document.getElementById("print-area");
        if (!reportArea) {
            showToast("Erro: Área de relatório não encontrada.");
            return;
        }

        if (typeof html2canvas !== "function") {
            showToast("Erro: Biblioteca html2canvas offline.");
            return;
        }

        const originalHTML = shareBtn.innerHTML;
        shareBtn.disabled = true;
        shareBtn.innerHTML = "Processando pacote...";

        try {
            const finalScore = calculateFinalScore();
            updateScoreUI(finalScore, questions.length);

            const categories = {
                'Metodologias Ágeis e Tradicionais': [2, 5, 13, 16, 24, 28],
                'Controle de Versão e CI/CD': [0, 3, 7, 9, 10, 12, 15, 20, 21, 22, 25, 26, 27, 29],
                'Qualidade e Testes de Software': [1, 4, 6, 8, 11, 14, 17, 18, 19, 23]
            };

            let missedCats = new Set();
            userAnswers.forEach((ans, i) => {
                if (ans !== getAnswer(questions[i])) {
                    for (let cat in categories) {
                        if (categories[cat].includes(i)) missedCats.add(cat);
                    }
                }
            });

            let improvementText = "";
            if (missedCats.size > 0) {
                improvementText = `⚠️ *Identifiquei vulnerabilidades nos seguintes tópicos:*\n- ${Array.from(missedCats).join('\n- ')}\n\n`;
            } else {
                improvementText = `🏆 *Build de sucesso! Nenhuma vulnerabilidade detectada nos tópicos de ES.*\n\n`;
            }

            const pageUrl = window.location.href;
            const shareText = `🛡️ *Relatório de Qualidade | Engenharia de Software (LSTECHINFO TI)* 🛡️\n\n🎯 *Meu Desempenho:* ${finalScore} de ${questions.length} acertos!\n\n${improvementText}🔗 *Acesse o motor e teste seus conhecimentos:* ${pageUrl}`;

            const surfaceColor = getComputedStyle(document.body).getPropertyValue("--surface").trim() || null;
            const canvas = await html2canvas(reportArea, {
                backgroundColor: surfaceColor,
                scale: Math.min(2, window.devicePixelRatio || 1),
                useCORS: true
            });

            const fileName = `simulado-engsoft-${finalScore}-de-${questions.length}.png`;
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1));
            if (!blob) throw new Error("Falha ao renderizar a imagem.");

            const file = new File([blob], fileName, { type: "image/png" });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: "Relatório de Qualidade",
                    text: shareText,
                    files: [file]
                });
                return;
            }

            downloadCanvasImage(canvas, fileName);
            window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText), '_blank');
            showToast("Relatório salvo e texto copiado para o Zap!");

        } catch (error) {
            if (error && (error.name === "AbortError" || error.name === "NotAllowedError")) {
                console.info("Compartilhamento cancelado.");
            } else {
                console.error("Erro no export:", error);
                showToast("Erro ao compartilhar o relatório.");
            }
        } finally {
            shareBtn.disabled = false;
            shareBtn.innerHTML = originalHTML;
        }
    }

    function downloadCanvasImage(canvas, fileName) {
        const imageUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function resetQuiz() {
        resultScreen.classList.replace("active", "hidden");
        showReviewBtn.textContent = "Ver logs detalhados";
        isReviewVisible = false;
        reviewContainer.classList.add("hidden");
        startQuiz();
    }

    // ==========================================
    // ANIMAÇÃO DE FUNDO (CYBER TOPO)
    // ==========================================
    function initNetworkCanvas() {
        const canvas = document.getElementById('network-bg');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = document.body.hasAttribute('data-theme') ? '#00ff88' : '#94a3b8';
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        function animate() {
            if (!document.body.classList.contains('no-effects')) {
                ctx.clearRect(0, 0, width, height);
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                    for (let j = i; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 120) {
                            ctx.beginPath();
                            ctx.strokeStyle = document.body.hasAttribute('data-theme') ? `rgba(0, 255, 136, ${1 - distance / 120})` : `rgba(148, 163, 184, ${1 - distance / 120})`;
                            ctx.lineWidth = 1;
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            } else {
                ctx.clearRect(0, 0, width, height);
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    window.addEventListener('load', initNetworkCanvas);

})();