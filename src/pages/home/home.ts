import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, LoadingController, Content } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';

@IonicPage({
  name:'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  breakingNews: any = [];
  data: any = [];
  page = 1;

  constructor(public navCtrl: NavController, public apiProvider: ApiProvider, public loadingCtrl: LoadingController) {
    
  }

  ionViewDidLoad() {
    console.log("ionViewdid");
    let loading = this.loadingCtrl.create({content:'Loading...'});
    loading.present();
    this.page = 1;
    this.apiProvider.getBreakingNews(this.page).subscribe(res => {
      this.data = res;
      this.breakingNews = this.data;
      loading.dismiss();
      this.scrollToTop();
      console.log(this.breakingNews);
    },
    error=>{ 
     console.log('Error occured : '+error.error);
     loading.dismiss();
   });
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  doInfinite(infiniteScroll) {
    this.page = this.page+1;
    setTimeout(() => {
      this.apiProvider.getBreakingNews(this.page)
         .subscribe(
           res => {
             console.log(res);
            this.data = res;
             for(let i=0; i<this.data.length; i++) {
               this.breakingNews.push(this.data[i]);
             }
           },
           error=>{ 
            console.log('Async operation has ended due to error');
            infiniteScroll.complete();
          },
           () => {
             console.log('Async operation has ended');
            infiniteScroll.complete();
          });
    }, 500);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
      setTimeout(() => {
        this.page = 1;
        this.apiProvider.getBreakingNews(this.page).subscribe(res => {
          this.data = res;
          this.breakingNews = this.data;
          console.log('Async operation has ended');
          refresher.complete();
          this.scrollToTop();
        },
        err => {
          console.log('Async operation has ended due to error');
          refresher.complete();
        });
      }, 500);
  }
  
}
