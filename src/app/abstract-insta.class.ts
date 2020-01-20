import { Input } from '@angular/core';
import axios from 'axios';

export abstract class AbstractInsta {
    @Input() username: string;
    nextCursor = "QVFCUGwtUmxKOC1MTVd1UE1vblZxMGlwWWdRcUtRWWd6TE01Nl8ySWgzV0U4QngyaS1Mb1hZWDRWTWtlVVgzaEdvdHhzcW8wQU1qU2ZDYzJuWmliMDJlTQ==";
    userId: string;
    profilPic: string;
    isPostInitialized = false;
    first = 50;

    resetField() {
        this.nextCursor = "QVFCUGwtUmxKOC1MTVd1UE1vblZxMGlwWWdRcUtRWWd6TE01Nl8ySWgzV0U4QngyaS1Mb1hZWDRWTWtlVVgzaEdvdHhzcW8wQU1qU2ZDYzJuWmliMDJlTQ==";
        this.userId = null;
        this.profilPic = null;
        this.isPostInitialized = false;
    }

    get apiUrl(): string {
        if (this.userId && this.nextCursor) {
            // tslint:disable-next-line:max-line-length
            return `https://www.instagram.com/graphql/query/?query_hash=e769aa130647d2354c40ea6a439bfc08&variables={"id":"${this.userId}","first":${this.first},"after":"${this.nextCursor}"}`;
        }
        return '';
    }

    public getUserData(): Promise<void> {
        return axios.get(`https://instagram.com/${this.username}`).then(res => {
            const parser = new DOMParser();
            const html = parser.parseFromString(res.data, 'text/html');
            const scripts = html.querySelectorAll('script');
            scripts.forEach(script => {
                try {
                    this.userId = script.innerText.toString().split(`"id":`)[1].split(`"`)[1];
                    this.profilPic = script.innerText.toString().split(`"profile_pic_url":`)[1].split(`"`)[1].replace(/\\u0026/g, '&');
                }
                catch (e) { }
            });
        });
    }

}