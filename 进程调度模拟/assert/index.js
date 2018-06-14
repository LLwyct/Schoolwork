const defaultprocessinfo = {
    pid: '',
    name: '',
    time: 3,
    priority: 1,
    already_run_time: 0,
}

let golbaltimeset;

function fixed(n) {
    return parseFloat(n.toFixed(2));
}

function deepclone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

let vm = new Vue({
    el: '#app',
    data: {
        use_key: new Set(),
        first_run: true,
        queue_num: 3,
        createqueue: [],
        readyqueues: [],
        runqueue: [],
        blockqueue: [],
        endqueue: [],
        newprocessinfo: {
            pid: '',
            name: '',
            time: 3,
            priority: 1,
            already_run_time: 0,
        }
    },
    methods: {
        // 创建一个pcb进程
        create_pcb: function () {
            //  字段检查
            if (this.newprocessinfo.pid.trim() == '' || this.newprocessinfo.name.trim() == '' || typeof (parseInt(this.newprocessinfo.time)) != 'number') {
                alert('请检查字段正确及完整!');
            }
            else if (this.newprocessinfo.time == "") {
                alert('请检查字段正确及完整!');
            }
            else if(this.use_key.has(this.newprocessinfo.pid)) {
                alert('pid已被使用!');
            }
            else {
                // 发送消息
                this.newprocessinfo.time = parseInt(this.newprocessinfo.time);
                this.newprocessinfo.priority = parseInt(this.newprocessinfo.priority);
                this.use_key.add(this.newprocessinfo.pid);
                this.createqueue.push(deepclone(this.newprocessinfo));
                // 重置页面
                this.newprocessinfo = deepclone(defaultprocessinfo);
            }
        },
        // 开始模拟
        start: function () {
            let _this = this;
            let timeslice = 0;
            if (this.first_run == true) {
                // 把创建队列的进程按照优先级导入就绪队列
                for (let i = 0; i < this.queue_num; i++) {
                    this.readyqueues.push([])
                }
                this.createqueue.forEach((element) => {
                    this.readyqueues[element.priority - 1].push(element);
                    this.createqueue = [];
                });

            }
            if (this.runqueue.length == 0) {
                for (let i = 0; i < this.readyqueues.length; i++) {
                    if (this.readyqueues[i].length != 0) {
                        this.runqueue.push(this.readyqueues[i].shift());
                        break;
                    }
                }
            }
            golbaltimeset = setInterval(function () {
                if (_this.runqueue.length == 0) {
                    window.clearInterval(golbaltimeset);
                    return;
                }
                let nowprocess = _this.runqueue[0];
                nowprocess.already_run_time += 1;
                let finded = 0;
                if (nowprocess.already_run_time >= nowprocess.time) {
                    // 如果运行完了
                    _this.endqueue.push(_this.runqueue.shift());
                    for (let i = 0; i < _this.readyqueues.length; i++) {
                        finded = 1;
                        if (_this.readyqueues[i].length != 0) {
                            finded = 2;
                            _this.runqueue.push(_this.readyqueues[i].shift());
                            break;
                        }
                    }
                    timeslice = 0;
                }
                if (finded == 1) {
                    window.clearInterval(golbaltimeset);
                    return
                }
                timeslice += 1000;
                // 如果超过时间片还没运行完
                if (timeslice >= nowprocess.priority * 1000) {
                    timeslice = 0;
                    if (nowprocess.priority == _this.queue_num) {
                        _this.readyqueues[nowprocess.priority - parseInt(1)].push(_this.runqueue.shift());
                    }
                    else {
                        let temp = _this.runqueue.shift();
                        let index = nowprocess.priority;
                        temp.priority += parseInt(1);
                        _this.readyqueues[index].push(temp);
                    }
                    for (let i = 0; i < _this.readyqueues.length; i++) {
                        if (_this.readyqueues[i].length != 0) {
                            _this.runqueue.push(_this.readyqueues[i].shift());
                            break;
                        }
                    }
                }
            }, 1500);
        },
        // 暂停模拟
        stop: function () {
            window.clearInterval(golbaltimeset);
        },
        // 重置数据
        reset: function () {
            this.use_key = new Set()
            this.first_run = true
            this.queue_num = 3
            this.createqueue = []
            this.readyqueues = []
            this.runqueue = []
            this.blockqueue = []
            this.endqueue = []
            this.newprocessinfo = {
                pid: '',
                name: '',
                time: 3,
                priority: 1,
                already_run_time: 0,
            }
        },
        toblock: function (index) {
            let _this = this;
            this.$prompt('请输入IO时间', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\d+?/,
                inputErrorMessage: '请输入一个数值变量'
            }).then(({ value }) => {
                this.$message({
                    type: 'success',
                    message: '你的IO时间是: ' + value
                });
                let temp = _this.runqueue.shift();
                let temp_pid = temp.pid;
                _this.blockqueue.push(temp);
                function gotoblock() {
                    _this.blockqueue.forEach((element, index, arr) => {
                        if (element.pid == temp_pid) {
                            let temp = arr.splice(index, 1)[0];
                            if (temp.priority == _this.queue_num) {
                                _this.readyqueues[element.priority - 1].push(temp);
                            }
                            else {
                                _this.readyqueues[element.priority].push(temp);
                            }
                        }
                    })
                    _this.start();
                }
                setTimeout(gotoblock, value * 1500);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        kill: function (index) {
            this.runqueue.shift();
        },
    },
    mounted: function () {

    }
});