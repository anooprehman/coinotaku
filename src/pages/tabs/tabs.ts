import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = "home";
  tab2Root = "news";
  tab3Root = ContactPage;

  constructor() {

  }
}
