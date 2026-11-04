
document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // CONFIGURAÇÕES
    // =========================================

    // Use somente a URL principal do projeto,
    // sem /rest/v1 no final.
    const SUPABASE_URL = "https://rvgbxrkucnfrqztljfxb.supabase.co";

    // Use a chave pública (anon/publishable).
    // Nunca use service_role ou chave secreta.
    const SUPABASE_KEY = "sb_publishable_xxmkrvTwXQ8SqF8JVbBL_Q_BMN8tQpU";

    // Número do responsável pelos agendamentos.
    // Formato: 55 + DDD + número.
    const WHATSAPP_EQUIPE = "+55 83 98206-1860";

    const configurado =
        SUPABASE_URL.startsWith("https://") &&
        !SUPABASE_URL.includes("/rest/v1") &&
        !SUPABASE_KEY.startsWith("COLE_AQUI") &&
        Boolean(window.supabase);

    const banco = configurado
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
        : null;

    window.reisBanco = banco;

    // =========================================
    // MENU
    // =========================================

    const nav = document.getElementById("nav");
    const toggle = document.getElementById("menuToggle");

    toggle.addEventListener("click", () => {
        const aberto = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(aberto));
        toggle.textContent = aberto ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.textContent = "☰";
        });
    });

    document.getElementById("year").textContent =
        new Date().getFullYear();

    // =========================================
    // GALERIA
    // =========================================

    const dialog = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    document.querySelectorAll(".gallery-item").forEach(item => {
        item.addEventListener("click", () => {
            lightboxImage.src = item.dataset.img;
            lightboxImage.alt = item.querySelector("img").alt;
            dialog.showModal();
        });
    });

    document.getElementById("closeLightbox")
        .addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
    });

    document.querySelectorAll("[data-filter]").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-filter]").forEach(filtro => {
                filtro.classList.toggle("active", filtro === button);
            });

            document.querySelectorAll(".gallery-item").forEach(item => {
                item.hidden =
                    button.dataset.filter !== "todos" &&
                    item.dataset.category !== button.dataset.filter;
            });
        });
    });

    // =========================================
    // SERVIÇOS
    // =========================================

    const categorias = {
        categoryServices: [
            "Corte e Barba",
            "Corte e sobrancelhas",
            "Barba e sobrancelhas",
            "Barba",
            "Barba + pigmentação",
            "Freestyle simples",
            "Freestyle grande",
            "Luzes",
            "Sobrancelhas",
            "Pigmentação",
            "Pigmentação da Barba",
            "Corte e Pigmentação",
            "Alisamento Americano",
            "Pé dos cabelos / cantinhos",
            "Corte e alisamento americano",
            "Bigode",
            "Desenho da barba",
            "Hidratação",
            "Selagem",
            "Coloração",
            "Platinado e corte",
            "Colorido",
            "Luzes e corte",
            "Higienização Capilar",
            "Máscara Preta",
            "Hidratação barba",
            "Corte barba com pigmentação"
        ],

        categorySpa: [
            "Corte Barba Sobrancelha e SPA facial",
            "Corte e SPA facial",
            "Barba e SPA facial",
            "Spa facial",
            "Spa facial e barboterapia"
        ],

        categoryCorte: [
            "Corte e Barba e Sobrancelha",
            "Corte infantil",
            "Corte",
            "Corte na tesoura curto",
            "Corte na tesoura médio",
            "Corte Infantil Tesoura",
            "Infantil de 0 a 1 ano"
        ],

        categoryEpilacao: [
            "Epilação nasal",
            "Epilação orelha",
            "Epilação ouvido + nariz"
        ]
    };

    // Preços em reais. null significa preço ainda não definido.
    // Para atualizar futuramente, altere somente o número correspondente.
    const precos = {
        "Corte e Barba": 65,
        "Corte e sobrancelhas": 45,
        "Barba e sobrancelhas": 45,
        "Barba": 35,
        "Barba + pigmentação": 55,
        "Freestyle simples": 5,
        "Freestyle grande": 10,
        "Luzes": 100,
        "Sobrancelhas": 10,
        "Pigmentação": 30,
        "Pigmentação da Barba": 25,
        "Corte e Pigmentação": 60,
        "Alisamento Americano": 40,
        "Pé dos cabelos / cantinhos": 15,
        "Corte e alisamento americano": 70,
        "Bigode": 10,
        "Desenho da barba": 15,
        "Hidratação": 25,
        "Selagem": null,
        "Coloração": 30,
        "Platinado e corte": 150,
        "Colorido": null,
        "Luzes e corte": 130,
        "Higienização Capilar": 10,
        "Máscara Preta": 15,
        "Hidratação barba": 20,
        "Spa facial e barboterapia": 60,
        "Corte Barba Sobrancelha e SPA facial": 95,
        "Corte e SPA facial": 60,
        "Barba e SPA facial": 60,
        "Spa facial": 30,
        "Corte barba com pigmentação": 100,
        "Corte e Barba e Sobrancelha": 75,
        "Corte infantil": 35,
        "Corte": 35,
        "Corte na tesoura curto": 35,
        "Corte na tesoura médio": 45,
        "Corte Infantil Tesoura": 40,
        "Infantil de 0 a 1 ano": 50,
        "Epilação nasal": 15,
        "Epilação orelha": 15,
        "Epilação ouvido + nariz": 25
    };

    function precoDoServico(servico) {
        const valor = precos[servico];
        return valor == null
            ? "Preço a definir"
            : valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    Object.entries(categorias).forEach(([id, servicos]) => {
        const container = document.getElementById(id);

        servicos.forEach(servico => {
            const card = document.createElement("div");
            card.className = "choice-card";

            const main = document.createElement("div");
            main.className = "choice-main";

            const label = document.createElement("label");
            label.className = "choice-label";

            const radio = document.createElement("input");
            radio.type = "checkbox";
            radio.name = "chosenService";
            radio.value = servico;

            const nome = document.createElement("span");
            nome.textContent = servico;

            const preco = document.createElement("small");
            preco.className = "choice-price";
            preco.textContent = precoDoServico(servico);
            preco.style.cssText = "display:block;margin-top:4px;color:#c5a46c;font-weight:700;font-size:13px;";
            const descricao = document.createElement("span");
            descricao.append(nome, preco);
            label.append(radio, descricao);
            main.appendChild(label);

            const seta = document.createElement("span");
            seta.className = "choice-avatar";
            seta.textContent = "♛";
            seta.setAttribute("aria-hidden", "true");

            card.append(main, seta);
            container.appendChild(card);

            radio.addEventListener("change", () => {
                if (obterServico().length > 150) {
                    radio.checked = false;
                    mensagem("Essa combinação excede o limite da reserva. Desmarque um serviço para adicionar outro.");
                } else {
                    mensagem("");
                }
                card.classList.toggle("selected", radio.checked);
            });
            card.addEventListener("click", event => {
                if (!event.target.closest("label, input")) radio.click();
            });
        });
    });

    // =========================================
    // CATEGORIAS FECHADAS INICIALMENTE
    // =========================================

    const categoriasAgendamento =
        document.querySelectorAll(".booking-category");

    categoriasAgendamento.forEach(categoria => {
        categoria.open = false;
    });

    categoriasAgendamento.forEach(categoria => {
        categoria.addEventListener("toggle", () => {
            if (categoria.open) {
                categoriasAgendamento.forEach(outra => {
                    if (outra !== categoria) {
                        outra.open = false;
                    }
                });
            }
        });
    });

    // =========================================
    // PROFISSIONAIS
    // =========================================

    const profissionais = [
        {
            nome: "Matheus Verissimo",
            avatar: "M",
            horarios: {
                "Manhã": ["09:00", "09:45", "10:30"],
                "Tarde": [
                    "14:00", "14:45", "15:30",
                    "16:15", "17:00", "17:45"
                ],
                "Noite": ["18:30"]
            }
        },
        {
            nome: "Aline",
            avatar: "A",
            horarios: {
                "Tarde": [
                    "14:00", "14:45", "15:30",
                    "16:15", "17:00", "17:45"
                ],
                "Noite": ["18:30"]
            }
        },
        {
            nome: "Theo Reis",
            avatar: "T",
            horarios: {
                "Manhã": ["09:00"],
                "Tarde": ["14:00", "14:45", "15:30", "17:30"],
                "Noite": ["18:15", "19:00"]
            }
        }
    ];

    // =========================================
    // ELEMENTOS E VARIÁVEIS
    // =========================================

    const form = document.getElementById("bookingForm");
    const feedback = document.getElementById("bookingFeedback");
    const result = document.getElementById("bookingResult");

    const nextButton = document.getElementById("nextStep");
    const prevButton = document.getElementById("prevStep");
    const finishButton = document.getElementById("finishBooking");

    const bookingDate = document.getElementById("bookingDate");
    const dayLabel = document.getElementById("selectedDayLabel");

    const lista = document.getElementById("professionalsContainer");

    const botaoCliente = document.getElementById("whatsappCliente");
    const botaoEquipe = document.getElementById("whatsappEquipe");
    const botaoCopiar = document.getElementById("copiarAvisoEquipe");

    let etapaAtual = 1;
    let horarioSelecionado = "";
    let profissionalSelecionado = "";
    let consultaAtual = 0;
    let confirmando = false;
    let confirmado = false;
    let avisoEquipe = "";

    function mensagem(texto) {
        feedback.textContent = texto;
        atualizarResumo();
    }

    function atualizarResumo() {
        const servico = obterServico();
        document.getElementById("liveService").textContent = servico || "Escolha seus serviços";
        document.getElementById("livePrice").textContent = servico ? "Total: " + precoDosServicos() : "";
        document.getElementById("liveDetails").textContent = [profissionalSelecionado, servico ? dataSelecionada.toLocaleDateString("pt-BR") : "", horarioSelecionado].filter(Boolean).join(" · ") || "Serviços → profissional e horário → confirmação";
    }

    function obterServicos() {
        return Array.from(form.querySelectorAll('input[name="chosenService"]:checked'), input => input.value);
    }

    function obterServico() {
        // Uma única reserva mantém a compatibilidade com a função existente no banco.
        return obterServicos().join(" + ");
    }

    function precoDosServicos() {
        const selecionados = obterServicos();
        const subtotal = selecionados.reduce((total, nome) => total + (precos[nome] ?? 0), 0);
        const indefinidos = selecionados.some(nome => precos[nome] == null);
        const valor = subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        if (indefinidos && subtotal === 0) return "Valor a consultar";
        return indefinidos ? valor + " + serviços com valor a consultar" : valor;
    }

    // =========================================
    // DATA
    // =========================================

    function hoje() {
        const data = new Date();
        data.setHours(12, 0, 0, 0);
        return data;
    }

    let dataSelecionada = hoje();

    function dataISO(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    }

    function atualizarData() {
        const inicio = hoje();
        const limite = hoje();
        limite.setDate(limite.getDate() + 90);

        if (dataSelecionada < inicio) dataSelecionada = inicio;
        if (dataSelecionada.getDay() === 0) {
            dataSelecionada = new Date(dataSelecionada);
            dataSelecionada.setDate(dataSelecionada.getDate() + 1);
        }
        bookingDate.min = dataISO(inicio);
        bookingDate.max = dataISO(limite);
        bookingDate.value = dataISO(dataSelecionada);
        bookingDate.disabled = confirmando || confirmado;
        dayLabel.textContent = dataSelecionada.toLocaleDateString("pt-BR", {
            weekday: "long", day: "2-digit", month: "long", year: "numeric"
        });
    }

    bookingDate.addEventListener("change", async () => {
        if (confirmando || confirmado) {
            atualizarData();
            return;
        }
        const valor = bookingDate.value;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
            atualizarData();
            return;
        }
        const [ano, mes, dia] = valor.split("-").map(Number);
        const nova = new Date(ano, mes - 1, dia, 12);
        const limite = hoje();
        limite.setDate(limite.getDate() + 90);
        if (dataISO(nova) !== valor || nova < hoje() || nova > limite || nova.getDay() === 0) {
            mensagem("Escolha uma data válida de segunda a sábado, nos próximos 90 dias.");
            atualizarData();
            return;
        }
        dataSelecionada = nova;
        ++consultaAtual; // invalida consultas anteriores
        limparHorario();
        atualizarData();
        if (profissionalSelecionado) await consultarHorarios();
        else mensagem("Data escolhida. Selecione um profissional e um horário.");
    });

    // =========================================
    // SELEÇÃO DOS HORÁRIOS
    // =========================================

    function limparHorario() {
        horarioSelecionado = "";
        document.getElementById("time").value = "";

        document.querySelectorAll(".slot-button").forEach(botao => {
            botao.classList.remove("selected");
            botao.setAttribute("aria-pressed", "false");
        });
    }

    function abrirProfissional(accordion) {
        document.querySelectorAll(".pro-accordion").forEach(item => {
            const aberto = item === accordion;

            item.classList.toggle("expanded", aberto);
            item.querySelector(".pro-slots").hidden = !aberto;

            item.querySelector(".pro-card").setAttribute(
                "aria-expanded",
                String(aberto)
            );
        });
    }

    profissionais.forEach(profissional => {
        const accordion = document.createElement("div");
        accordion.className = "pro-accordion";
        accordion.dataset.profissional = profissional.nome;

        const card = document.createElement("div");
        card.className = "pro-card";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-expanded", "false");

        const avatar = document.createElement("span");
        avatar.className = "pro-avatar";
        avatar.textContent = profissional.avatar;

        const detalhes = document.createElement("div");
        detalhes.className = "pro-detail";

        const nome = document.createElement("strong");
        nome.textContent = profissional.nome;

        const servico = document.createElement("small");
        servico.className = "selected-service-label";

        detalhes.append(nome, servico);

        const direita = document.createElement("div");
        direita.className = "pro-right";

        const texto = document.createElement("small");
        texto.textContent = "Ver horários";

        const seta = document.createElement("b");
        seta.textContent = "⌄";

        direita.append(texto, seta);
        card.append(avatar, detalhes, direita);

        const slots = document.createElement("div");
        slots.className = "pro-slots";
        slots.hidden = true;

        Object.entries(profissional.horarios).forEach(([periodo, horas]) => {
            const grupo = document.createElement("div");
            grupo.className = "slot-period";

            const titulo = document.createElement("h4");
            titulo.textContent = periodo;

            const botoes = document.createElement("div");
            botoes.className = "slot-buttons";

            horas.forEach(hora => {
                const botao = document.createElement("button");
                botao.type = "button";
                botao.className = "slot-button";
                botao.textContent = hora;
                botao.dataset.time = hora;
                botao.disabled = true;
                botao.setAttribute("aria-pressed", "false");

                botao.addEventListener("click", () => {
                    if (botao.disabled || confirmado) return;

                    limparHorario();
                    horarioSelecionado = hora;

                    botao.classList.add("selected");
                    botao.setAttribute("aria-pressed", "true");

                    document.getElementById("time").value = hora;
                    mensagem(`Horário escolhido: ${hora}`);
                });

                botoes.appendChild(botao);
            });

            grupo.append(titulo, botoes);
            slots.appendChild(grupo);
        });

        async function selecionarProfissional() {
            if (confirmando || confirmado) return;

            if (profissionalSelecionado !== profissional.nome) {
                limparHorario();
            }

            profissionalSelecionado = profissional.nome;
            abrirProfissional(accordion);
            await consultarHorarios();
        }

        card.addEventListener("click", selecionarProfissional);

        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selecionarProfissional();
            }
        });

        accordion.append(card, slots);
        lista.appendChild(accordion);
    });

    // =========================================
    // CONSULTAR HORÁRIOS NO SUPABASE
    // =========================================

    async function consultarHorarios() {
        if (!profissionalSelecionado || confirmado) return false;

        const numeroConsulta = ++consultaAtual;
        const profissional = profissionalSelecionado;
        const data = dataISO(dataSelecionada);

        const accordion = Array.from(
            document.querySelectorAll(".pro-accordion")
        ).find(item => item.dataset.profissional === profissional);

        if (!accordion) return false;

        const botoes = accordion.querySelectorAll(".slot-button");

        botoes.forEach(botao => {
            botao.disabled = true;
            botao.classList.remove("occupied", "closed");
            botao.textContent = botao.dataset.time;
        });

        if (!banco) {
            mensagem("Configure a URL e a chave pública do Supabase.");
            return false;
        }

        mensagem("Consultando horários...");

        try {
            const { data: reservas, error } = await banco.rpc(
                "horarios_ocupados",
                {
                    p_profissional: profissional,
                    p_data: data
                }
            );

            if (numeroConsulta !== consultaAtual) return false;

            if (error) {
                console.error(error);
                mensagem("Não foi possível consultar os horários.");
                return false;
            }

            const ocupados = new Set(
                (reservas || []).map(item => item.horario)
            );

            const agora = new Date();

            botoes.forEach(botao => {
                const hora = botao.dataset.time;
                const reservado = ocupados.has(hora);

                const dataHora = new Date(`${data}T${hora}:00`);
                const encerrado = dataHora <= agora;

                botao.disabled = reservado || encerrado;

                botao.classList.toggle("occupied", reservado);
                botao.classList.toggle(
                    "closed",
                    encerrado && !reservado
                );

                botao.textContent = reservado
                    ? `${hora} · Ocupado`
                    : encerrado
                        ? `${hora} · Encerrado`
                        : hora;
            });

            const selecionado = Array.from(botoes).find(
                botao => botao.dataset.time === horarioSelecionado
            );

            if (selecionado && selecionado.disabled) {
                limparHorario();
            }

            mensagem(Array.from(botoes).some(botao => !botao.disabled) ? "Selecione um horário disponível." : "Sem horários disponíveis nesta data. Escolha outro dia ou profissional.");
            return true;

        } catch (erro) {
            if (numeroConsulta !== consultaAtual) return false;

            console.error(erro);
            mensagem("Erro de conexão ao consultar horários.");
            return false;
        }
    }

    // =========================================
    // WHATSAPP
    // =========================================

    function normalizarWhatsApp(valor) {
        const digitos = valor.replace(/\D/g, "");

        // Número brasileiro com DDD: 10 ou 11 dígitos.
        if (/^\d{10,11}$/.test(digitos)) {
            return "55" + digitos;
        }

        // Número brasileiro com código 55.
        if (/^55\d{10,11}$/.test(digitos)) {
            return digitos;
        }

        return "";
    }

    function criarLinkWhatsApp(numero, texto) {
        return (
            "https://wa.me/" +
            numero +
            "?text=" +
            encodeURIComponent(texto)
        );
    }

    function prepararMensagensWhatsApp(dados) {
        const mensagemCliente =
`👑 BARBEARIA REI'S

Olá, ${dados.nome}!

Seu agendamento foi confirmado!

✂️ Serviços: ${dados.servico}
💰 Valor: ${precoDosServicos()}
💈 Profissional: ${dados.profissional}
📅 Data: ${dados.data}
🕒 Horário: ${dados.horario}

📍 Av. Josefa Taveira, 2060
Mangabeira - João Pessoa/PB

Aguardamos você!`;

        avisoEquipe =
`📋 NOVO AGENDAMENTO - BARBEARIA REI'S

👤 Cliente: ${dados.nome}
📱 WhatsApp: ${dados.telefone}
✂️ Serviços: ${dados.servico}
💰 Valor: ${precoDosServicos()}
💈 Profissional: ${dados.profissional}
📅 Data: ${dados.data}
🕒 Horário: ${dados.horario}`;

        botaoCliente.href = criarLinkWhatsApp(
            dados.telefone,
            mensagemCliente
        );

        botaoCliente.hidden = false;

        const numeroEquipe = normalizarWhatsApp(
            WHATSAPP_EQUIPE
        );

        if (numeroEquipe) {
            botaoEquipe.href = criarLinkWhatsApp(
                numeroEquipe,
                avisoEquipe
            );

            botaoEquipe.hidden = false;
        } else {
            botaoEquipe.hidden = true;
        }

        botaoCopiar.hidden = false;
    }

    botaoCopiar.addEventListener("click", async () => {
        if (!avisoEquipe) return;

        try {
            await navigator.clipboard.writeText(avisoEquipe);
            mensagem("Aviso copiado! Cole no WhatsApp da equipe.");
        } catch (erro) {
            console.error(erro);
            mensagem(
                "Não foi possível copiar automaticamente. " +
                "Tente usar o botão em uma página HTTPS."
            );
        }
    });

    // =========================================
    // ETAPAS DO AGENDAMENTO
    // =========================================

    function mostrarEtapa(etapa) {
        etapaAtual = etapa;

        document.querySelectorAll(".wizard-step").forEach(elemento => {
            elemento.hidden =
                Number(elemento.dataset.step) !== etapa;
        });

        document.getElementById("stepCounter").textContent =
            `ETAPA ${etapa} DE 3`;

        document.getElementById("progressFill").style.width =
            `${(etapa / 3) * 100}%`;

        prevButton.hidden = etapa === 1;
        nextButton.hidden = etapa === 3;
        finishButton.hidden = etapa !== 3;

        result.hidden = true;
        mensagem("");

        if (etapa === 2) {
            document.querySelectorAll(".selected-service-label")
                .forEach(label => {
                    label.textContent = obterServico();
                });

            atualizarData();

            if (profissionalSelecionado) {
                consultarHorarios();
            }
        }

        if (etapa === 3) {
            document.getElementById("bookingSummary").textContent =
                `Serviços: ${obterServico()} (${precoDosServicos()}) • ` +
                `Profissional: ${profissionalSelecionado} • ` +
                `Data: ${dataSelecionada.toLocaleDateString("pt-BR")} • ` +
                `Horário: ${horarioSelecionado}`;
        }
    }

    nextButton.addEventListener("click", async () => {
        if (confirmando || confirmado) return;

        nextButton.disabled = true;

        try {
            if (etapaAtual === 1) {
                if (!obterServico()) {
                    mensagem("Selecione pelo menos um serviço.");
                    return;
                }

                mostrarEtapa(2);
                return;
            }

            if (etapaAtual === 2) {
                if (!profissionalSelecionado) {
                    mensagem("Selecione um profissional.");
                    return;
                }

                if (!horarioSelecionado) {
                    mensagem("Selecione um horário.");
                    return;
                }

                const disponivel = await consultarHorarios();

                if (!disponivel || !horarioSelecionado) {
                    mensagem("Escolha um horário disponível.");
                    return;
                }

                mostrarEtapa(3);
            }
        } finally {
            nextButton.disabled = false;
        }
    });

    prevButton.addEventListener("click", () => {
        if (confirmando || confirmado) return;

        if (etapaAtual > 1) {
            mostrarEtapa(etapaAtual - 1);
        }
    });

    // =========================================
    // CONFIRMAR AGENDAMENTO
    // =========================================

    form.addEventListener("submit", async event => {
        event.preventDefault();

        if (confirmando || confirmado) return;
        if (!navigator.onLine) { mensagem("Você está offline. Conecte-se à internet para confirmar a reserva."); return; }

        const nome = document.getElementById("clientName")
            .value.trim();

        const telefoneDigitado = document.getElementById(
            "clientWhatsapp"
        ).value;

        const telefone = normalizarWhatsApp(
            telefoneDigitado
        );

        const servico = obterServico();
        const profissional = profissionalSelecionado;
        const data = dataISO(dataSelecionada);
        const horario = horarioSelecionado;

        if (nome.length < 2 || nome.length > 100) {
            mensagem("Digite seu nome corretamente.");
            return;
        }

        if (!telefone) {
            mensagem("Digite um WhatsApp válido com DDD.");
            return;
        }

        if (servico.length > 150) {
            mensagem("Reduza a quantidade de serviços para esta reserva.");
            return;
        }

        if (!servico || !profissional || !horario) {
            mensagem("Complete todas as etapas.");
            return;
        }

        if (!banco) {
            mensagem("O Supabase ainda não foi configurado.");
            return;
        }

        confirmando = true;
        finishButton.disabled = true;
        prevButton.disabled = true;
        finishButton.textContent = "CONFIRMANDO...";

        mensagem("Registrando seu agendamento...");

        try {
            // Mantém a função que já funciona no seu banco.
            // O WhatsApp não é enviado para o banco nesta versão.
            const { data: resposta, error } = await banco.rpc(
                "confirmar_agendamento",
                {
                    p_nome: nome,
                    p_servico: servico,
                    p_profissional: profissional,
                    p_data: data,
                    p_horario: horario
                }
            );

            if (error) {
                console.error(error);
                mensagem(
                    "Não foi possível confirmar. " +
                    "Verifique a conexão antes de tentar novamente."
                );
                return;
            }

            if (!resposta?.sucesso) {
                mostrarEtapa(2);
                await consultarHorarios();

                mensagem(
                    resposta?.mensagem ||
                    "Esse horário não está disponível."
                );
                return;
            }

            confirmado = true;

            const dataFormatada =
                dataSelecionada.toLocaleDateString("pt-BR");

            document.getElementById("confirmedBooking").textContent =
                `Cliente: ${nome} • ` +
                `Serviços: ${servico} (${precoDosServicos()}) • ` +
                `Profissional: ${profissional} • ` +
                `Data: ${dataFormatada} • ` +
                `Horário: ${horario}`;

            adicionarCalendario({ nome, servico, profissional, data, horario });

            prepararMensagensWhatsApp({
                nome,
                telefone,
                servico,
                profissional,
                data: dataFormatada,
                horario
            });

            document.querySelectorAll(".wizard-step").forEach(
                elemento => elemento.hidden = true
            );

            result.hidden = false;
            finishButton.hidden = true;
            prevButton.hidden = true;
            nextButton.hidden = true;

            mensagem("Agendamento confirmado com sucesso!");

            result.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        } catch (erro) {
            console.error(erro);

            mensagem(
                "Houve uma falha de conexão. " +
                "Consulte a barbearia antes de tentar novamente."
            );

        } finally {
            confirmando = false;
            finishButton.disabled = false;
            prevButton.disabled = false;
            finishButton.textContent = "CONFIRMAR AGENDAMENTO";
        }
    });

    function adicionarCalendario(dados) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "btn outline";
        botao.textContent = "SALVAR NO CALENDÁRIO ↓";
        botao.addEventListener("click", () => {
            const limpar = valor => String(valor).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
            const inicio = new Date(dados.data + "T" + dados.horario + ":00-03:00").toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
            const agora = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
            const conteudo = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Reis//Agenda//PT-BR", "BEGIN:VEVENT", "UID:" + crypto.randomUUID() + "@reis", "DTSTAMP:" + agora, "DTSTART:" + inicio, "SUMMARY:" + limpar(dados.servico + " — Barbearia Rei’s"), "DESCRIPTION:" + limpar("Profissional: " + dados.profissional), "LOCATION:Avenida Josefa Taveira 2060 - Mangabeira - João Pessoa", "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
            const url = URL.createObjectURL(new Blob([conteudo], { type: "text/calendar;charset=utf-8" }));
            const a = document.createElement("a");
            a.href = url; a.download = "agendamento-reis.ics"; a.click();
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        });
        result.append(botao);
    }

    // =========================================
    // INICIAR
    // =========================================

    form.addEventListener("change", atualizarResumo);
    atualizarData();
    mostrarEtapa(1);
    atualizarResumo();
});