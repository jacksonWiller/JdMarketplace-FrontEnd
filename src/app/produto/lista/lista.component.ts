import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { FormBuilder, Validators, FormControlName, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { Pagina } from 'src/app/models/ApiResponce';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {

  public produtos: Produto[];
  public produto: Produto;
  public UrlServiceV1 = environment.apiURL;
  public pagina: Pagina;

  public page: PageEvent = {
    first: 0,
    rows: 5,
    page: 0,
    pageCount: 0
  };

  cities: any[] | undefined;


  totalRecords: number;

  errorMessage: string;

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  pForm: FormGroup;

  constructor(private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router) { }

  visible: boolean = false;

    public mostraImagem(imagemURL: string): string {
      return (imagemURL !== '' && imagemURL != null)
        ? `${environment.apiURL}${imagemURL}`
        : 'assets/layout/images/nocontent.png';
    }

  showDialog() {
      this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  } 

  selectedProduct: any;

  selectedCity: any;

  ordem: number = 0;
  ultimaCidadeSelecionada: any = null;

  onCityChange(event) {
    if (this.ultimaCidadeSelecionada && this.ultimaCidadeSelecionada.name === event.value.name && this.ordem === 0) {
      // A mesma cidade foi selecionada novamente
      this.ordem = 1;
    } else {
      // Uma cidade diferente foi selecionada ou é a primeira seleção
      this.ordem = 0;
    }
  
    // Atualize a última cidade selecionada
    this.ultimaCidadeSelecionada = event.value;
  
    // Chame ObterProdutos e passe ordem como parâmetro
    this.ObterProdutos();
    console.log(this.ordem);
  }

  onSelectProduct(produto) {
    if (this.selectedProduct === produto) {
      this.selectedProduct = null;
    } else {
      this.selectedProduct = produto;
    }
  }

  public paginaAtual: number = 1;
  public itensPorPagina: number = 5;
  totalRegistros: number = 0;

  pesquisa: string = '';

  onFilter(event) {
    this.pesquisa = event.target.value;
    this.ObterProdutos();
  }
  
  ObterProdutos() {
 
    const campo = this.selectedCity?.numero ?? 0;
  
    // Defina os parâmetros, incluindo a verificação de campo
    const params: any = {
      quantidade: this.page.rows,
      pagina: this.page.page,
      pesquisa: this.pesquisa,
      campo: campo,
      ordem: this.ordem
    };
  
    // Remova o console.log se não for mais necessário
    // console.log(this.selectedCity?.numero);
  
    // Chame o serviço obterTodos com os parâmetros
    this.produtoService.obterTodos(params)
      .subscribe(
        response => {
          if (response.success && response.result && 'produtos' in response.result) {
            this.produtos = response.result.produtos;
            this.totalRegistros = response.result.total;
            this.totalRecords = response.result.total;
            if (this.produtos.length === 0) {
              this.errorMessage = 'Nenhum produto encontrado';
            }
          } else {
            this.errorMessage = 'Erro ao obter produtos';
          }
        },
        error => {
          this.errorMessage = error.message || 'Erro desconhecido';
        }
      );
  }

  camposOrdenacao: any[]
  camposOrdenacaoSelecionado: any | undefined;

  ListarOrdenacaoCampos() {
    this.produtoService.listarOrdenacaoCampos()
      .subscribe(
        response => {
          if (response) {
            this.camposOrdenacao =  this.transformToCities(response);
            console.log(this.camposOrdenacaoSelecionado);
          } else {
            this.errorMessage = 'Erro ao listar campos de ordenação';
          }
        },
        error => {
          this.errorMessage = error.message || 'Erro desconhecido';
        }
      );
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  adicionarProduto() {
    if (this.pForm.dirty && this.pForm.valid) {
      this.produto = Object.assign({}, this.produto, this.pForm.value);
      this.produtoService.novoProduto(this.produto)
        .subscribe({
          next: (sucesso: any) => {
            this.closeDialog();
            this.reloadComponent();

          },
        });

    }
  }

  list: string[] = ['teste', 'tffdsfds'];

  transformToCities(list: string[]): { name: string; numero: number }[] {
    return list.map((item, index) => ({
      name: item,
      numero: index
    }));
  }

  ngOnInit(): void {
    this.pForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      valor: ['', [Validators.required]],
      ativo: [true]
    });
    this.ObterProdutos();
    this.ListarOrdenacaoCampos();



    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
  ];

  }

  onPageChange(event: PageEvent) {
    this.page = event;
    this.ObterProdutos();
  }
}


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
