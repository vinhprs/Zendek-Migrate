import { Injectable } from '@nestjs/common';
import { Api } from 'src/fetch/zendesk';
@Injectable()
export class ViewsService {
  DOMAIN: string = `https://${process.env.OLD_DOMAIN}.zendesk.com/api/v2`;
  DOMAIN_WOWI: string = `https://${process.env.NEW_DOMAIN}.zendesk.com/api/v2`;
  PATH: string = '/views';

  constructor(
    private readonly api: Api,
  ) {}

  async getOldViews(): Promise<any> {
    const data = await this.api.get(this.DOMAIN, this.PATH, process.env.OLD_ZENDESK_USERNAME, process.env.OLD_ZENDESK_PASSWORD);
    return data;
  }

  async getNewViews(): Promise<any> {
    const data = await this.api.get(this.DOMAIN_WOWI, this.PATH, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    return data;
  }

  clearViewProps(view: any): any {
    delete view.id;
    delete view.url;
    delete view.created_at;
    delete view.updated_at;
    
    view.all = view.conditions.all;
    view.any = view.conditions.any;
    delete view.conditions;

    return view;
  }

  async migrate(): Promise<any> {
    const data = (await this.getOldViews()).views;
    const exists = (await this.getNewViews()).views;

    const existedViewNames = exists.map((view) => view.title);

    for (var view of data) {
      if (existedViewNames.includes(view.title)) continue;
      if (view.active == false) continue;
      view = this.clearViewProps(view);
      const request = JSON.parse(JSON.stringify({
        view: view
      }));
      console.log(JSON.stringify(request));
      await this.api.post(this.DOMAIN_WOWI, this.PATH, request, process.env.NEW_ZENDESK_USERNAME, process.env.NEW_ZENDESK_PASSWORD);
    }}
}
