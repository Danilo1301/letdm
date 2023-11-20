const request = require('request');

export class LogTest {
    public static URL = "http://localhost:3000/api/log/add";
    public static SERVICE_NAME = "test";

    public static log(address: string, message: string, sendPing: boolean, isLocal: boolean) {
        let url = this.URL

        const data = {
            service: this.SERVICE_NAME,
            address: address,
            message: message,
            sendPing: sendPing,
            isLocal: isLocal
        }

        console.log("[log] post", url, data)

        request.post(
            url,
            { headers: {'user-agent': `service-${this.SERVICE_NAME}`}, json: data },
            function (error, response, body) {

                if(error) {
                    console.log("[gamelog] post error");
                    return
                }

                console.log("[gamelog] post status: " + response.statusCode);
            }
        );
    }
}