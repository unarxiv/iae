import os from 'os'
import path from 'path'
import jetpack from 'fs-jetpack'

class Config {
    constructor() {
        this.intellisense = {
            provider: '',
            azure: {
                key: '',
                secret: ''
            },
            cvpm: {
                endpoint: ''
            }
        }
        this.iaePath = path.join(os.homedir(), 'autoai', 'iae')
        this.read()
    }
    validate() {

    }
    get JSON() {
        return {
            'intellisense': this.intellisense
        }
    }
    set JSON(val) {
        if (typeof (val) !== 'undefined' && val) {
            if (typeof (val.intellisense !== 'undefined') && val.intellisense) {
                this.intellisense = val.intellisense
            }
        }
    }
    parse() {

    }
    write() {
        jetpack.write(path.join(this.iaePath, 'config.json'), this.JSON)
    }
    read() {
        const confPath = path.join(this.iaePath, 'config.json')
        const flag = jetpack.exists(confPath)
        if (!flag) {
          this.write()
        } else {
          this.JSON = JSON.parse(jetpack.read(confPath))
        }
    }
}

let config = new Config()

export {
    config
}
