import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./DashboardFinanceiroAdvogado.module.css";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import MenuLateralAdvogado from "../MenuLateralAdvogado/MenuLateralAdvogado.jsx";

function DashboardFinanceiroAdvogado({ api }) {
    const navigate = useNavigate();

    const API_URL = api || "http://10.92.11.23:5000";

    const [menuColapsado, setMenuColapsado] = useState(false);

    const [periodo, setPeriodo] = useState("mes");

    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    useEffect(() => {
        function aplicarEstadoMenu(e) {
            const colapsado = e?.detail?.colapsado ?? false;
            setMenuColapsado(colapsado);
        }

        aplicarEstadoMenu({
            detail: {
                colapsado:
                    localStorage.getItem("menu_colapsado") === "true"
            }
        });

        window.addEventListener(
            "menu-lateral-toggle",
            aplicarEstadoMenu
        );

        return () => {
            window.removeEventListener(
                "menu-lateral-toggle",
                aplicarEstadoMenu
            );
        };
    }, []);

    function irParaNovoLancamento() {
        navigate("/adicionar_despesa");
    }

    /*
     * EXEMPLO DE LANÇAMENTOS
     *
     * Depois podemos trocar essa parte pela API
     * do seu sistema.
     */
    const lancamentos = [
        {
            id: 1,
            tipo: "receita",
            status: "recebida",
            valor: 8500,
            data: "2026-10-02"
        },
        {
            id: 2,
            tipo: "receita",
            status: "recebida",
            valor: 5000,
            data: "2026-10-05"
        },
        {
            id: 3,
            tipo: "receita",
            status: "a_receber",
            valor: 4200,
            data: "2026-10-10"
        },
        {
            id: 4,
            tipo: "receita",
            status: "a_receber",
            valor: 3000,
            data: "2026-10-20"
        },
        {
            id: 5,
            tipo: "despesa",
            status: "paga",
            valor: 3000,
            data: "2026-10-03"
        },
        {
            id: 6,
            tipo: "despesa",
            status: "paga",
            valor: 2500,
            data: "2026-10-06"
        },
        {
            id: 7,
            tipo: "despesa",
            status: "paga",
            valor: 2800,
            data: "2026-10-08"
        }
    ];

    function converterData(data) {
        const [ano, mes, dia] = data.split("-");

        return new Date(
            Number(ano),
            Number(mes) - 1,
            Number(dia)
        );
    }

    function hoje() {
        const data = new Date();

        return new Date(
            data.getFullYear(),
            data.getMonth(),
            data.getDate()
        );
    }

    function inicioMes() {
        const data = hoje();

        return new Date(
            data.getFullYear(),
            data.getMonth(),
            1
        );
    }

    function fimMes() {
        const data = hoje();

        return new Date(
            data.getFullYear(),
            data.getMonth() + 1,
            0
        );
    }

    function inicioMesAnterior() {
        const data = hoje();

        return new Date(
            data.getFullYear(),
            data.getMonth() - 1,
            1
        );
    }

    function fimMesAnterior() {
        const data = hoje();

        return new Date(
            data.getFullYear(),
            data.getMonth(),
            0
        );
    }

    function menosDias(dias) {
        const data = hoje();

        data.setDate(data.getDate() - dias);

        return data;
    }

    function obterPeriodo() {
        if (periodo === "mes") {
            return {
                inicio: inicioMes(),
                fim: fimMes()
            };
        }

        if (periodo === "mesAnterior") {
            return {
                inicio: inicioMesAnterior(),
                fim: fimMesAnterior()
            };
        }

        if (periodo === "30dias") {
            return {
                inicio: menosDias(30),
                fim: hoje()
            };
        }

        if (periodo === "90dias") {
            return {
                inicio: menosDias(90),
                fim: hoje()
            };
        }

        if (periodo === "personalizado") {
            if (!dataInicial || !dataFinal) {
                return null;
            }

            return {
                inicio: converterData(dataInicial),
                fim: converterData(dataFinal)
            };
        }

        return null;
    }

    const periodoSelecionado = obterPeriodo();

    const lancamentosFiltrados = periodoSelecionado
        ? lancamentos.filter((lancamento) => {
            const dataLancamento = converterData(
                lancamento.data
            );

            return (
                dataLancamento >=
                periodoSelecionado.inicio &&
                dataLancamento <=
                periodoSelecionado.fim
            );
        })
        : lancamentos;

    const receitaRecebida = lancamentosFiltrados
        .filter(
            (item) =>
                item.tipo === "receita" &&
                item.status === "recebida"
        )
        .reduce(
            (total, item) => total + item.valor,
            0
        );

    const receitaAReceber = lancamentosFiltrados
        .filter(
            (item) =>
                item.tipo === "receita" &&
                item.status === "a_receber"
        )
        .reduce(
            (total, item) => total + item.valor,
            0
        );

    const despesas = lancamentosFiltrados
        .filter(
            (item) =>
                item.tipo === "despesa"
        )
        .reduce(
            (total, item) => total + item.valor,
            0
        );

    const saldo = receitaRecebida - despesas;

    const totalReceitas =
        receitaRecebida + receitaAReceber;

    const percentualRecebido =
        totalReceitas > 0
            ? (receitaRecebida / totalReceitas) * 100
            : 0;

    const percentualArredondado =
        Math.round(percentualRecebido);

    let situacao;

    if (saldo > 0 && percentualRecebido >= 70) {
        situacao = "Boa";
    } else if (saldo >= 0) {
        situacao = "Atenção";
    } else {
        situacao = "Crítica";
    }

    const maiorValor = Math.max(
        receitaRecebida,
        receitaAReceber,
        despesas,
        1
    );

    const alturaRecebida =
        (receitaRecebida / maiorValor) * 100;

    const alturaAReceber =
        (receitaAReceber / maiorValor) * 100;

    const alturaDespesas =
        (despesas / maiorValor) * 100;

    function dinheiro(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function classeCardSituacao(nome) {
        return `${css.situacaoCard} ${
            situacao === nome
                ? css.situacaoCardAtiva
                : ""
        }`;
    }

    return (
        <div className={css.paginaCompleta}>

            <Header api={API_URL} />

            <div className={css.layoutDashboard}>

                <div
                    className={`${css.menuLateralContainer} ${
                        menuColapsado
                            ? css.menuLateralColapsado
                            : ""
                    }`}
                >
                    <MenuLateralAdvogado api={API_URL} />
                </div>

                <div className={css.conteudoPrincipal}>

                    {/* CABEÇALHO */}

                    <header className={css.cabecalho}>

                        <div className={css.cabecalhoTexto}>

                            <p className={css.subtitulo}>
                                FINANCEIRO DO ESCRITÓRIO
                            </p>

                            <h1>
                                Saúde financeira
                            </h1>

                            <p className={css.descricao}>
                                Acompanhe os principais
                                indicadores financeiros
                                do seu escritório.
                            </p>

                        </div>

                        <button
                            type="button"
                            className={
                                css.botaoNovoLancamento
                            }
                            onClick={
                                irParaNovoLancamento
                            }
                            name="btn-novo-lancamento"
                        >
                            + Novo lançamento
                        </button>

                    </header>

                    {/* FILTRO */}

                    <section className={css.filtroPeriodo}>

                        <div className={css.filtroTitulo}>

                            <h2>
                                Filtrar período
                            </h2>

                            <p>
                                Selecione o período das
                                informações financeiras.
                            </p>

                        </div>

                        <div className={css.filtroControles}>

                            <div className={css.campoFiltro}>

                                <label>
                                    Período
                                </label>

                                <select
                                    value={periodo}
                                    onChange={(e) =>
                                        setPeriodo(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="mes">
                                        Este mês
                                    </option>

                                    <option value="mesAnterior">
                                        Mês anterior
                                    </option>

                                    <option value="30dias">
                                        Últimos 30 dias
                                    </option>

                                    <option value="90dias">
                                        Últimos 90 dias
                                    </option>

                                    <option value="personalizado">
                                        Personalizado
                                    </option>

                                </select>

                            </div>

                            {periodo === "personalizado" && (
                                <>
                                    <div
                                        className={
                                            css.campoFiltro
                                        }
                                    >

                                        <label>
                                            Data inicial
                                        </label>

                                        <input
                                            type="date"
                                            value={dataInicial}
                                            onChange={(e) =>
                                                setDataInicial(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                    <div
                                        className={
                                            css.campoFiltro
                                        }
                                    >

                                        <label>
                                            Data final
                                        </label>

                                        <input
                                            type="date"
                                            value={dataFinal}
                                            onChange={(e) =>
                                                setDataFinal(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>
                                </>
                            )}

                        </div>

                    </section>

                    <section className={css.relatoriosFinanceiros}>

                        <div className={css.relatoriosTexto}>

                            <h2>
                                Relatórios financeiros
                            </h2>

                            <p>
                                Consulte os relatórios financeiros
                                do escritório de acordo com o
                                período selecionado.
                            </p>

                        </div>

                        <div className={css.relatoriosOpcoes}>

                            <button
                                type="button"
                                className={css.botaoRelatorio}
                            >
                                 Relatório completo
                            </button>

                            <button
                                type="button"
                                className={css.botaoRelatorio}
                            >
                                 Receitas
                            </button>

                            <button
                                type="button"
                                className={css.botaoRelatorio}
                            >
                                 Despesas
                            </button>

                        </div>

                    </section>

                    {/* VISÃO FINANCEIRA */}

                    <section className={css.bloco}>

                        <div className={css.tituloBloco}>

                            <div>

                                <h2>
                                    Visão financeira
                                </h2>

                                <p>
                                    Comparativo entre
                                    receitas e despesas
                                </p>

                            </div>

                        </div>

                        <div className={css.legenda}>

                            <span
                                className={
                                    css.legendaRecebido
                                }
                            >
                                &#9632; Recebido
                            </span>

                            <span
                                className={
                                    css.legendaAReceber
                                }
                            >
                                &#9632; A Receber
                            </span>

                            <span
                                className={
                                    css.legendaDespesas
                                }
                            >
                                &#9632; Despesas
                            </span>

                        </div>

                        <div className={css.grafico}>

                            <div className={css.coluna}>

                                <span className={css.valor}>
                                    {dinheiro(
                                        receitaRecebida
                                    )}
                                </span>

                                <div
                                    className={
                                        css.areaBarra
                                    }
                                >

                                    <div
                                        className={`${css.barra} ${css.barraRecebida}`}
                                        style={{
                                            height: `${alturaRecebida}%`
                                        }}
                                    />

                                </div>

                                <span className={css.label}>
                                    Recebido
                                </span>

                            </div>

                            <div className={css.coluna}>

                                <span className={css.valor}>
                                    {dinheiro(
                                        receitaAReceber
                                    )}
                                </span>

                                <div
                                    className={
                                        css.areaBarra
                                    }
                                >

                                    <div
                                        className={`${css.barra} ${css.barraAReceber}`}
                                        style={{
                                            height: `${alturaAReceber}%`
                                        }}
                                    />

                                </div>

                                <span className={css.label}>
                                    A receber
                                </span>

                            </div>

                            <div className={css.coluna}>

                                <span className={css.valor}>
                                    {dinheiro(despesas)}
                                </span>

                                <div
                                    className={
                                        css.areaBarra
                                    }
                                >

                                    <div
                                        className={`${css.barra} ${css.barraDespesas}`}
                                        style={{
                                            height: `${alturaDespesas}%`
                                        }}
                                    />

                                </div>

                                <span className={css.label}>
                                    Despesas
                                </span>

                            </div>

                        </div>

                        <div className={css.graficoTotais}>

                            <div className={css.totalItem}>

                                <span
                                    className={
                                        css.totalLabel
                                    }
                                >
                                    Recebido
                                </span>

                                <span
                                    className={
                                        css.totalValor
                                    }
                                >
                                    {dinheiro(
                                        receitaRecebida
                                    )}
                                </span>

                            </div>

                            <div className={css.totalItem}>

                                <span
                                    className={
                                        css.totalLabel
                                    }
                                >
                                    A Receber
                                </span>

                                <span
                                    className={
                                        css.totalValor
                                    }
                                >
                                    {dinheiro(
                                        receitaAReceber
                                    )}
                                </span>

                            </div>

                            <div className={css.totalItem}>

                                <span
                                    className={
                                        css.totalLabel
                                    }
                                >
                                    Despesas
                                </span>

                                <span
                                    className={
                                        css.totalValor
                                    }
                                >
                                    {dinheiro(despesas)}
                                </span>

                            </div>

                        </div>

                    </section>

                    {/* SAÚDE FINANCEIRA */}

                    <section className={css.blocoSaude}>

                        <div className={css.saudeTexto}>

                            <p
                                className={
                                    css.subtituloSaude
                                }
                            >
                                INDICADOR DA SAÚDE
                                FINANCEIRA
                            </p>

                            <h2>
                                {situacao}
                            </h2>

                            <p>

                                {situacao === "Boa" &&
                                    "O escritório apresenta saldo positivo e uma boa proporção de receitas recebidas."
                                }

                                {situacao === "Atenção" &&
                                    "É importante acompanhar as receitas a receber e as despesas do escritório."
                                }

                                {situacao === "Crítica" &&
                                    "As despesas estão comprometendo o resultado financeiro do escritório."
                                }

                            </p>

                        </div>

                        <div
                            className={
                                css.percentualContainer
                            }
                        >

                            <div
                                className={
                                    css.percentual
                                }
                                style={{
                                    "--pct": `${percentualArredondado}%`
                                }}
                            >

                                <span>
                                    {percentualArredondado}%
                                </span>

                            </div>

                            <span
                                className={
                                    css.percentualLabel
                                }
                            >
                                das receitas recebidas
                            </span>

                        </div>

                    </section>

                    {/* SITUAÇÕES */}

                    <section className={css.bloco}>

                        <div className={css.tituloBloco}>

                            <div>

                                <h2>
                                    Situações da saúde
                                    financeira
                                </h2>

                                <p>
                                    Entenda o significado
                                    de cada indicador.
                                </p>

                            </div>

                        </div>

                        <div className={css.situacoes}>

                            <div
                                className={
                                    classeCardSituacao("Boa")
                                }
                            >

                                <span
                                    className={css.ponto}
                                />

                                <div>

                                    <h3>
                                        Boa
                                    </h3>

                                    <p>
                                        Saldo positivo e
                                        pelo menos 70% das
                                        receitas previstas
                                        já recebidas.
                                    </p>

                                </div>

                            </div>

                            <div
                                className={
                                    classeCardSituacao("Atenção")
                                }
                            >

                                <span
                                    className={css.ponto}
                                />

                                <div>

                                    <h3>
                                        Atenção
                                    </h3>

                                    <p>
                                        O escritório possui
                                        saldo positivo, mas
                                        precisa acompanhar
                                        os valores.
                                    </p>

                                </div>

                            </div>

                            <div
                                className={
                                    classeCardSituacao("Crítica")
                                }
                            >

                                <span
                                    className={css.ponto}
                                />

                                <div>

                                    <h3>
                                        Crítica
                                    </h3>

                                    <p>
                                        O resultado
                                        financeiro está
                                        negativo e exige
                                        atenção imediata.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* RESUMO FINANCEIRO */}

                    <section className={css.bloco}>

                        <div className={css.tituloBloco}>

                            <h2>
                                Resumo financeiro
                            </h2>

                        </div>

                        <div className={css.resumo}>

                            <div className={css.linha}>

                                <span>
                                    Total de receitas
                                    previstas
                                </span>

                                <strong>
                                    {dinheiro(
                                        totalReceitas
                                    )}
                                </strong>

                            </div>

                            <div className={css.linha}>

                                <span>
                                    Receita recebida
                                </span>

                                <strong
                                    className={
                                        css.valorRecebido
                                    }
                                >
                                    {dinheiro(
                                        receitaRecebida
                                    )}
                                </strong>

                            </div>

                            <div className={css.linha}>

                                <span>
                                    Receita a receber
                                </span>

                                <strong
                                    className={
                                        css.valorAReceber
                                    }
                                >
                                    {dinheiro(
                                        receitaAReceber
                                    )}
                                </strong>

                            </div>

                            <div className={css.linha}>

                                <span>
                                    Despesas
                                </span>

                                <strong>
                                    {dinheiro(despesas)}
                                </strong>

                            </div>

                            <div className={css.linhaFinal}>

                                <span>
                                    Saldo atual
                                </span>

                                <strong>
                                    {dinheiro(saldo)}
                                </strong>

                            </div>

                        </div>

                    </section>

                </div>

            </div>

            <Footer />

        </div>
    );
}

export default DashboardFinanceiroAdvogado;