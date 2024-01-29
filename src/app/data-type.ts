export interface Login {
  email: string;
  password: string;
}

export interface Response {
  status: string;
  statusCode: number;
  message: string;
  data: string;
}

export interface ServiceManage {
  target: HTMLInputElement;
  
  service_name: string;
  price: number;
  service_description: string;
}
