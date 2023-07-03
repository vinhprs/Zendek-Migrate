import { HttpModule, HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Axios } from "axios";
import { firstValueFrom } from 'rxjs';
@Injectable()
export class Api {
    constructor(
        private readonly httpService: HttpService
    ) { }

    async get(
        domain: string,
        path: string,
        username: string,
        password: string
    ): Promise<any> {
        const axiosConfig = {
            method: 'GET',
            url: encodeURI(domain + path),
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username,
                password
            }
        }
        return firstValueFrom(this.httpService.request(axiosConfig))
            .then((res) => res.data)
            .catch((e) => {
                console.log(e.message)
                return e;
            });
    }

    async post(
      domain: string,
      path: string,
      data: any,
      username: string,
      password: string
    ) : Promise<any> {
        const axiosConfig = {
            method: 'POST',
            url: encodeURI(domain + path),
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username,
                password
            },
            data
        }
        return firstValueFrom(this.httpService.request(axiosConfig))
          .then((res) => {
            return res.data;
          })
          .catch((e) => {
              console.log(e.message, axiosConfig.data);
              return e;
          });
    }

    async delete(
      domain: string,
      path: string,
      username: string,
      password: string
    ) : Promise<any> {
        const axiosConfig = {
            method: 'DELETE',
            url: encodeURI(domain + path),
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username,
                password
            }
        }
        return firstValueFrom(this.httpService.request(axiosConfig))
          .then((res) => {
            return res.data;
          })
          .catch((e) => {
              console.log(e.data.error);
              return e;
          });
    }
}