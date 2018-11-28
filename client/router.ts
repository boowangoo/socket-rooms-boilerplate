import $ from 'jquery';

import Room from './room';
import { Html } from '../types';

export default class Router {
    private templHtml: Html;

    constructor(html?: Html) {
        this.changeTemplHtml(html || 'no template html');
    }

    public changeTemplHtml(html: Html): void {
        this.templHtml = html;
        $('#container').html(this.templHtml);
    }
}