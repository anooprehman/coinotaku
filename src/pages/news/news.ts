import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, LoadingController, Content } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'news'
})
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  @ViewChild(Content) content: Content;

  news: any;
  allNews: any;
  data: any;
  page = 1;
  categories: string = "0";
  options : InAppBrowserOptions = {
    location : 'no',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only
};

  constructor(public navCtrl: NavController, public apiProvider: ApiProvider, public loadingCtrl: LoadingController, private iab: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log("ionViewdid");
    this.page = 1;
    let loading = this.loadingCtrl.create({content:'Loading...'});
    loading.present();
    this.apiProvider.getNews(this.page).subscribe(res => {
      this.data = res;
      this.news = this.data;
      this.allNews = this.news.slice();
      this.filterCategory();
      loading.dismiss();
      this.scrollToTop();
      console.log(this.news);
    });
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  doInfinite(infiniteScroll) {
    this.page = this.page+1;
    setTimeout(() => {
      this.apiProvider.getNews(this.page)
         .subscribe(
           res => {
            this.data = res;
            this.news = this.allNews.slice();
             for(let i=0; i<this.data.length; i++) {
               this.news.push(this.data[i]);
             }

             this.allNews = this.news.slice();
             this.filterCategory();
            console.log(this.news);
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

  openNewsDetails(url) {
    this.iab.create(url,"_blank",this.options);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
      setTimeout(() => {
        this.page = 1;
        this.apiProvider.getNews(this.page).subscribe(res => {
          this.data = res;
          this.news = this.data;
          this.allNews = this.news.slice();
          this.filterCategory();
          this.scrollToTop();
          console.log('Async operation has ended');
          refresher.complete();
        },
        err => {
          console.log('Async operation has ended due to error');
          refresher.complete();
        });
      }, 500);
  }

  getCategoryText(category) {
    let categoryText = "";
    if(category == "2") {
      categoryText = "Bitcoin";
    }
    else if(category == "5") {
      categoryText = "Ethereum";
    }
    else if(category == "52") {
      categoryText = "Ripple";
    }
    else if(category == "53") {
      categoryText = "ICO";
    }
    else if(category == "51") {
      categoryText = "Altcoin";
    }
    else if(category == "122") {
      categoryText = "NEM";
    }
    else {
      categoryText = "Others";
    }
    return categoryText;
  }

  filterCategory() {
    let categories = this.categories;
    if(categories == "0")
      this.news = this.allNews.slice();
    else {
      this.news = this.allNews.filter((item) => {
        return (item.categories.some(function (i) {
            /*
                Some will return true if any of the elements return true
            */
            return item.categories.indexOf(parseInt(categories)) !== -1; 
          })
        )
      })
    }
  }
}
