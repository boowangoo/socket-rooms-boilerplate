import $ from 'jquery';

import Room from './room';
import { Html } from '../types';
import Page from './page';

export default class Router {
    private currPage: Page;

    public changePage(page: Page): void {
        this.currPage = page;
        $('#container').html(page.HTML());
        page.init();
    }
}