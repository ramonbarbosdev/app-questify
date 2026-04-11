import { api } from "./api";

export interface PageRequest {
  page?: number;
  limit?: number;
  sort?: string;
  [key: string]: any;
}

export interface PageMeta {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}

export interface PageResponse<T> {
  data: T[];
  meta: PageMeta;
  error: string;
  success: boolean;
}

export interface DataResponse<T> {
  data: T;
}

export abstract class BaseService<T, ID = number> {

  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async findById(id: ID): Promise<T> {
    const response = await api.get<DataResponse<T>>(`${this.endpoint}/${id}`);

    return response.data.data;
  }

  async findAll(params?: PageRequest, endpoint?: string): Promise<PageResponse<T>> {

    const url = endpoint
      ? `${this.endpoint}${endpoint}`
      : this.endpoint;

    const response = await api.get(url, { params });

    let data = response.data;

    return data as PageResponse<T>;
  }
  async search(filters: Record<string, any>): Promise<T[]> {
    const response = await api.get<T[]>(this.endpoint, { params: filters });
    return response.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await api.post<T>(this.endpoint, data);
    return response.data;
  }

  async update(id: ID, data: Partial<T>): Promise<T> {
    const response = await api.put<T>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: ID): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);

  }

  async createMultipart(
    data: Partial<T>,
    endpoint: string,
    file?: {
      field: string;
      uri: string;
      name: string;
      type?: string;
    },
  ): Promise<T> {


    // const formData = new FormData();

    // Object.entries(data).forEach(([key, value]) => {
    //   if (value === null || value === undefined) return;

    //   if (typeof value === "object") {
    //     formData.append(key, JSON.stringify(value));
    //   } else {
    //     formData.append(key, String(value));
    //   }
    // });

    // if (file) {
    //   formData.append(file.field, {
    //     uri: file.uri,
    //     name: file.name,
    //     type: file.type ?? "application/octet-stream"
    //   } as any);
    // }

    const url = `${this.endpoint}${endpoint}`;

    // console.log(url)

    const response = await api.post<T>(url,data );

    return response.data;
  }

  async uploadFile(url: string, file: any) {
    const fileResponse = await fetch(file.uri);
    const blob = await fileResponse.blob();

    const formData = new FormData();
    formData.append('file', blob, file.name);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro no upload');
    }

    return response.text();
  }

}