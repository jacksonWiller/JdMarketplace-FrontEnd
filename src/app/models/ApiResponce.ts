export interface ApiResponse<T> {
    result: T;
    success: boolean;
    successMessage: string;
    statusCode: number;
    errors: any[];
  }
  
  export interface Pagina {
    quantidade: number;
    pagina: number;
    pesquisa: string;
  }