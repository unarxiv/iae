import { Files } from '@/services/files'
import { ipcRenderer } from 'electron'
import fs from 'fs'
import store from '@/store'
import { azureAnalyzer } from "@/services/intellisense/azure"
import path from 'path'
class LocalFiles extends Files {
    constructor() {
        super()
    }
    watch() {
        let self = this
        ipcRenderer.on('selected-directory', (event, data) => {
            self._filepath = data[0]
            self.getFileLists(self._filepath)
        })
    }
    get fileslist() {
        return this._fileslist
    }
    set fileslist(val) {
        this._fileslist = val
    }
    getFileLists (filepath) {
        fs.readdir(filepath, (err, files) => {
            self._fileslist = files
            store.state.currentFiles = files
            store.state.currentPath = filepath
        })
    }
    getCachedIntellisense (filepath) {
        azureAnalyzer.readCached(filepath)
        let results = azureAnalyzer.Results
        if(results.length === 0) {
            this.callIntellisense(filepath)
        }
    }
    callIntellisense (filepath) {
        let paths = store.state.currentFiles.map(function(each){
            return path.join(filepath, each)
        })
        azureAnalyzer.handleArray(paths).then(function(){
            azureAnalyzer.writeCached(filepath)
        })
    }
}

export {
    LocalFiles
}