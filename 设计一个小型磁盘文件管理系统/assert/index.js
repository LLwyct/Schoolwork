/*
 * 大三下学期操作系统实训第三次上机作业
 * 段页式虚拟存储管理
 * 李文驰
 * 2018/6/14 10:33
 */
function fixed(n) {
    return parseFloat(n.toFixed(2));
}

function getPath(node) {
    let road = [];
    let temp = node;
    while (temp.parent != null) {
        road.push(temp.data.label);
        temp = temp.parent;
    }
    return road.reverse().join('/');
}

function deepclone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

let id = 1000;


let vm = new Vue({
    el: '#app',
    data: {
        treedata: [{
            id: 1,
            label: '根目录',
            type: 0,
        }],
        form: {
            size: '256',
            resource: '读写',
            content: ''
        },
        left_size: 126 * 64,
        block_num: 128,
        fat: null,
        fat_use: new Array(128),
        fileinfos: [],
        openfile_list: [],
        file_size: 256,
        show_record: false,
    },
    created: function () {
        this.fat = new Array(128);
        for (let i = 0; i < 128; i++) {
            this.fat[i] = 0;
            this.fat_use[i] = false;
        }
        this.fat[0] = this.fat[1] = -1;
        this.fat_use[0] = this.fat_use[1] = true;
    },
    methods: {
        append(node, data, typee) {
            if (parseInt(this.left_size) < parseInt(this.form.size)) {
                this.$message('磁盘大小不足');
            }
            else if (typee === 0) {
                this.$prompt('请输入文件夹名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[0-9a-zA-Z]{1,}$/,
                    inputErrorMessage: '文件名格式不正确'
                }).then(({ value }) => {
                    node.childNodes.forEach(e=>{
                        if(e.data.label === value) {
                            this.$message({
                                type: 'info',
                                message: '创建失败'
                            });
                            p++;
                        }
                    })
                    const newChild = { id: id++, label: value, children: [], type: typee };
                    if (!data.children) {
                        this.$set(data, 'children', []);
                    }
                    data.children.push(newChild);
                    // 自定义
                    let road = [];
                    let temp = node;
                    while (temp.parent != null) {
                        road.push(temp.data.label);
                        temp = temp.parent;
                    }
                    let record = {
                        road: road.reverse().join('/') + '/' + value,
                        type: '',
                        attribute: 8,
                        startpos: -1,
                        length: 0,
                    }
                    this.fileinfos.push(record);
                    this.$message({
                        type: 'success',
                        message: '创建成功'
                    });
                }).catch(() => {
                    
                });
            }
            else {
                this.$prompt('请输入文件名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[0-9a-zA-Z]{1,}\.[a-z0-9]{1,}$/,
                    inputErrorMessage: '文件格式不正确'
                }).then(({ value }) => {
                    node.childNodes.forEach(e => {
                        if (e.data.label === value) {
                            this.$message({
                                type: 'info',
                                message: '创建失败'
                            });
                            p++;
                        }
                    })
                    const newChild = { id: id++, label: value, children: [], type: typee };
                    if (!data.children) {
                        this.$set(data, 'children', []);
                    }
                    data.children.push(newChild);
                    // zidingyi
                    let road = [];
                    let temp = node;
                    while (temp.parent != null) {
                        road.push(temp.data.label);
                        temp = temp.parent;
                    }
                    let record = {
                        road: road.reverse().join('/') + '/' + value,
                        type: '',
                        attribute: 4,
                        startpos: -1,
                        length: 0,
                        content: '',
                    }
                    record.content = this.form.content;
                    record.type = value.split('.').pop();
                    record.length = this.form.size;
                    let buf = record.length;
                    let hasfind = false;
                    for (let i = 2; i < 128; i++) {
                        if (this.fat[i] == 0) {
                            if (record.startpos == -1) {
                                record.startpos = i;
                            }
                            for (let j = i + 1; j < 128; j++) {
                                if (this.fat[j] === 0) {
                                    this.fat[i] = j;
                                    this.fat_use[i] = true;
                                    buf -= 64;
                                    this.left_size -= 64;
                                    if (buf <= 0) {
                                        this.fat[i] = -1;
                                        this.fat_use[i] = true;
                                        hasfind = true;
                                    }
                                    break;
                                }
                            }
                        }
                        if (hasfind === true) {
                            break;
                        }
                    }
                    this.fat_use.push("1");
                    this.fat_use.pop();
                    if(this.form.resource == '只读') {
                        record.attribute += 1;
                    }
                    this.fileinfos.push(record);
                    console.log(record);

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            }
        },

        remove(node, data) {
            let road = [];
            let temp = node;
            while (temp.parent != null) {
                road.push(temp.data.label);
                temp = temp.parent;
            }
            let path = road.reverse().join('/');
            let waittodel = []
            this.fileinfos.forEach((e,index) => {
                if (e.road.search(path) == 0) {
                    if (e.attribute == 4 || e.attribute == 5) {
                        let pos = e.startpos;
                        while (this.fat[pos] != -1) {
                            let k = this.fat[pos];
                            this.fat[pos] = 0;
                            this.fat_use[pos] = false;
                            pos = k;
                        }
                        this.fat[pos] = 0;
                        this.fat_use[pos] = false;
                        this.openfile_list.forEach((ele, index) => {
                            if(ele === e) {
                                this.openfile_list.splice(index, 1);
                            }
                        })
                    }
                }
                else {
                    waittodel.push(e);
                }
            });
            this.fileinfos = waittodel;
            this.fat.push(1);
            this.fat.pop();
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
        },

        rename(node, data) {
            // pass
            if(data.label.search('\\.') != -1) {
                this.$prompt('请输入名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[0-9a-zA-Z]{1,}\.[a-z0-9]{1,}$/,
                    inputErrorMessage: '格式不正确'
                }).then(({ value }) => {
                    node.parent.childNodes.forEach(e => {
                        if (e.data.label === value) {
                            this.$message({
                                type: 'info',
                                message: '更改失败'
                            });
                            p++;
                        }
                    })
                    this.fileinfos.forEach(e => {
                        if(e.road === getPath(node)) {
                            let newroad = e.road.split('/');
                            newroad.pop();
                            newroad.push(value);
                            console.log(newroad);
                            e.road = newroad.join('/');
                        }
                    });
                    data.label = value;
                    this.$message({
                        type: 'success',
                        message: 'success'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '更改失败'
                    });
                });
            }
            else {
                this.$prompt('请输入名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[0-9a-zA-Z]{1,}$/,
                    inputErrorMessage: '格式不正确'
                }).then(({ value }) => {
                    node.parent.childNodes.forEach(e => {
                        if (e.data.label === value) {
                            this.$message({
                                type: 'info',
                                message: '更改失败'
                            });
                            p++;
                        }
                    })
                    this.fileinfos.forEach(e => {
                        if (e.road === getPath(node)) {
                            let newroad = e.road.split('/');
                            newroad.pop();
                            newroad.push(value);
                            console.log(newroad);
                            e.road = newroad.join('/');
                        }
                    });
                    data.label = value;
                    this.$message({
                        type: 'success',
                        message: 'success'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '更改失败'
                    });
                });
            }
        },
        open(node, data) {
            // pass
            this.fileinfos.forEach(e => {
                if (e.road === getPath(node)) {
                    let find = false;
                    this.openfile_list.forEach(ele => {
                        if(e === ele) {
                            find = true;
                        }
                    });
                    if(!find) {
                        this.openfile_list.push(e);
                    }
                }
            });
        },
        showcontent(index) {
            this.show_record = this.fileinfos[index];
        },
        close(index) {
            this.openfile_list.splice(index, 1);
            this.show_record = false;
        },
        save() {

        },
        update_attribute(node, data) {
            this.$prompt('请输入属性', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9]{1,2}$/,
                inputErrorMessage: '格式不正确'
            }).then(({ value }) => {
                this.fileinfos.forEach(e => {
                    if (e.road === getPath(node)) {
                        e.attribute = value;
                    }
                });
                this.$message({
                    type: 'success',
                    message: 'success'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        }
    }
});