import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }

  getBreakingNews(page) {
    return this.http.get("http://www.newsbtc.work/wp-json/wp/v2/posts?per_page=20&page="+page+"&orderby=date&order=desc");
  }

  getNews(page) {
    return this.http.get("https://coin-otaku.com//wp-json/wp/v2/posts?per_page=20&page="+page+"&orderby=date&order=desc");
  }

  getThumbnail(url) {
    return this.http.get(url);
  }
}
