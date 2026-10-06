import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdicionarDespesas.css';

const estadoInicial = {
    tipo: 'despesa',
    descricao: '',
    valor: '',
    data: '',
    categoria: '',
    formaPagamento: '',
    status: '',
    observacoes: '',
    comprovante: null,
};

function AdicionarDespesa() {
    const navigate = useNavigate();

    const [dados, setDados] = useState(estadoInicial);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setDados((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Recupera os lançamentos que já existem
        const lancamentosSalvos =
            JSON.parse(
                localStorage.getItem('lancamentosFinanceiros')
            ) || [];

        // Cria o novo lançamento
        const novoLancamento = {
            id: Date.now(),

            tipo: dados.tipo,

            descricao: dados.descricao,

            valor: Number(dados.valor),

            data: dados.data,

            categoria: dados.categoria,

            formaPagamento: dados.formaPagamento,

            status: dados.status,

            observacoes: dados.observacoes,

            // Por enquanto não salvamos o arquivo
            comprovante: dados.comprovante
                ? dados.comprovante.name
                : null,
        };

        // Adiciona o novo lançamento
        const novosLancamentos = [
            ...lancamentosSalvos,
            novoLancamento,
        ];

        // Salva no navegador
        localStorage.setItem(
            'lancamentosFinanceiros',
            JSON.stringify(novosLancamentos)
        );

        // Guarda qual foi o último lançamento cadastrado
        localStorage.setItem(
            'ultimoLancamentoFinanceiro',
            JSON.stringify(novoLancamento)
        );

        // Redireciona para Saúde Financeira
        navigate('/dashboard_financeiro');
    };

    return (
        <div className="paginaCompleta">

            <section className="containerSection">

                <div className="topArea">

                    <button
                        type="button"
                        className="botaoVoltar"
                        onClick={() => navigate(-1)}
                        aria-label="Voltar"
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5" />
                            <path d="M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <h1 className="titulo">
                        Cadastro de Despesas
                    </h1>

                </div>

                <form
                    className="formulario"
                    onSubmit={handleSubmit}
                >

                    {/* TIPO + DESCRIÇÃO */}

                    <div className="linha">

                        <div className="campoMetade">

                            <label
                                className="label"
                                htmlFor="tipo"
                            >
                                Tipo
                            </label>

                            <select
                                id="tipo"
                                name="tipo"
                                className="input"
                                value={dados.tipo}
                                onChange={handleChange}
                                required
                            >
                                <option value="despesa">
                                    Despesa
                                </option>

                                <option value="receita">
                                    Receita
                                </option>
                            </select>

                        </div>

                        <div className="campoMetade">

                            <label
                                className="label"
                                htmlFor="descricao"
                            >
                                Descrição
                            </label>

                            <input
                                id="descricao"
                                name="descricao"
                                type="text"
                                className="input"
                                placeholder="Ex.: Custas processuais"
                                value={dados.descricao}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    {/* VALOR + DATA */}

                    <div className="linha">

                        <div className="campoMetade">

                            <label
                                className="label"
                                htmlFor="valor"
                            >
                                Valor (R$)
                            </label>

                            <input
                                id="valor"
                                name="valor"
                                type="number"
                                step="0.01"
                                min="0"
                                className="input"
                                placeholder="0,00"
                                value={dados.valor}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="campoMetade">

                            <label
                                className="label"
                                htmlFor="data"
                            >
                                Data
                            </label>

                            <input
                                id="data"
                                name="data"
                                type="date"
                                className="input"
                                value={dados.data}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    {/* CATEGORIA + FORMA DE PAGAMENTO */}

                    <div className="linha">

                        <div className="campoMetade">

                            <label
                                className="label"
                                htmlFor="categoria"
                            >
                                Categoria
                            </label>

                            <select
                                id="categoria"
                                name="categoria"
                                className="input"
                                value={dados.categoria}
                                onChange={handleChange}
                                required
                            >

                                <option
                                    value=""
                                    disabled
                                >
                                    Selecione a categoria
                                </option>

                                <option value="custas">
                                    Custas processuais
                                </option>

                                <option value="honorarios">
                                    Honorários
                                </option>

                                <option value="deslocamento">
                                    Deslocamento
                                </option>

                                <option value="material">
                                    Material de escritório
                                </option>

                                <option value="impostos">
                                    Impostos e taxas
                                </option>

                                <option value="outros">
                                    Outros
                                </option>

                            </select>

                        </div>

                        <div className="campoMetade">

                            <label
                                className="label"
                                htmlFor="formaPagamento"
                            >
                                Forma de pagamento
                            </label>

                            <select
                                id="formaPagamento"
                                name="formaPagamento"
                                className="input"
                                value={dados.formaPagamento}
                                onChange={handleChange}
                                required
                            >

                                <option
                                    value=""
                                    disabled
                                >
                                    Selecione a forma de pagamento
                                </option>

                                <option value="pix">
                                    Pix
                                </option>

                                <option value="cartao-credito">
                                    Cartão de crédito
                                </option>

                                <option value="cartao-debito">
                                    Cartão de débito
                                </option>

                                <option value="boleto">
                                    Boleto
                                </option>

                                <option value="dinheiro">
                                    Dinheiro
                                </option>

                                <option value="transferencia">
                                    Transferência
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* STATUS + COMPROVANTE */}

                    <div className="linha">

                        <div className="campoMetade">

                            <label
                                className="label"
                                htmlFor="status"
                            >
                                Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                className="input"
                                value={dados.status}
                                onChange={handleChange}
                                required
                            >

                                <option
                                    value=""
                                    disabled
                                >
                                    Selecione o status
                                </option>

                                <option value="pago">
                                    Pago
                                </option>

                                <option value="pendente">
                                    Pendente
                                </option>

                                <option value="atrasado">
                                    Atrasado
                                </option>

                            </select>

                        </div>

                        <div className="campoMetade">

                            <label
                                className="label"
                                htmlFor="comprovante"
                            >
                                Comprovante
                            </label>

                            <input
                                id="comprovante"
                                name="comprovante"
                                type="file"
                                className="inputFile"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={handleChange}
                            />

                            <p className="obsCampos">
                                Opcional. Formatos aceitos:
                                PDF, PNG ou JPG.
                            </p>

                        </div>

                    </div>


                    {/* OBSERVAÇÕES */}

                    <div className="linha">

                        <div className="campoInteiro">

                            <label
                                className="label"
                                htmlFor="observacoes"
                            >
                                Observações
                            </label>

                            <textarea
                                id="observacoes"
                                name="observacoes"
                                className="input"
                                rows="4"
                                placeholder="Informações adicionais (opcional)"
                                value={dados.observacoes}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {/* BOTÃO */}

                    <div className="botaoContainer">

                        <button
                            type="submit"
                            className="botaoCadastro"
                        >
                            Cadastrar
                        </button>

                    </div>

                </form>

            </section>

        </div>
    );
}

export default AdicionarDespesa;