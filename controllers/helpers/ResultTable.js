class ResultTable {
    constructor() {
        this.nodes = [];
    }

    addChild(name, status, size) {
        this.nodes.push({ name, status, size })
    }
}

module.exports = ResultTable;