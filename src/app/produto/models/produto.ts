export interface Produto {
  id: string,
  nome: string,
  descricao: string,
  imagemURL: string,
  imagemUpload: string;
  valor: number,
  dataCadastro: string,
  ativo: true,
  fornecedorId: string,
  nomeFornecedor: string,
  cayegoriaId: string,
  nomeCategoria: string
}

export interface Fornecedor{
  id: string,
  nome: string,
}

export interface Categoria{
  id: string,
  nome: string,
}

export class ProdutosResponse {
  produtos: Produto[];
  total: number;
  pagina: number
}