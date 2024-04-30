import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { Pagina, Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { FormBuilder, Validators, FormControlName, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {

  public produtos: Produto[];
  public produto: Produto;
  public UrlServiceV1 = environment.apiURL;
  public pagina: Pagina;

  first3: number = 1;

  rows3: number = 5;

  public page: PageEvent = {
    first: 0,
    rows: 5,
    page: 0,
    pageCount: 0
  };
  

  totalRecords: number;


  public imagemProduto: "https://localhost:44300/Resources/Images/0765ea65-c210-48d5-8356-39ee898aa0cd.jpg";
  errorMessage: string;

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  pForm: FormGroup;

  constructor(private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router) { }

  visible: boolean = false;

  first: number = 1;

    rows: number = 10;


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

  selectedProduct: any; // Produto atualmente selecionado

  onSelectProduct(produto) {
    if (this.selectedProduct === produto) {
      this.selectedProduct = null; // Desseleciona se clicar no produto já selecionado
    } else {
      this.selectedProduct = produto; // Seleciona o novo produto
    }
  }

  public paginaAtual: number = 1;
  public itensPorPagina: number = 5;
  totalRegistros: number = 0;

  ObterProdutos() {
    const params: Pagina = {
        quantidade: this.page.rows,
        pagina: this.page.page
    };

    this.produtoService.obterTodos(params)
        .subscribe(
            response => {
                if (response.success && response.result && 'produtos' in response.result) {
                    this.produtos = response.result.produtos;
                    this.totalRegistros = response.result.total; // Atualize o total de registros aqui
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

  ngOnInit(): void {
    this.pForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      valor: ['', [Validators.required]],
      ativo: [true]
    });

    this.ObterProdutos();
    console.log(this.first3);
  
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