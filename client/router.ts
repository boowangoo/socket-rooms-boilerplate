import $ from 'jquery';

import Room from './room';

export default class Router {
    private templHtml: string;

    constructor(html?: string) {
        this.changeTemplHtml(html || 'no template html');
    }

    public changeTemplHtml(html: string): void {
        this.templHtml = html;
        $('#container').html(this.templHtml);
    }
}