const fs = require('fs');
const path = require('path');


class Creds {
    constructor() {
        const filePath = path.join(__dirname, 'creds.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        let json = JSON.parse(data);
        this.username = json.username;
        this.pwd = json.pwd;
    }
    verifyLogin(username, pwd) {
        if (username == this.username && pwd == this.pwd) {
            this.cookie = this.cookie = (username + pwd + Date.now()).toString();
            return this.cookie;
        } else {
            return false;
        }
    }

    verifyRequest(cookie) {
        return 'loginCookie=' + this.cookie == cookie;
    }

    changeCreds(username = this.username, pwd = this.pwd) {
        this.username = username;
        this.pwd = pwd;
        fs.writeFileSync(filePath, JSON.stringify({ "username": username, "pwd": pwd }, null, 2), 'utf-8');
    }
}

module.exports = Creds;
