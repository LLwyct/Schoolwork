/*
 * 大三下学期操作系统实训第二次上机作业
 * 段页式虚拟存储管理
 * 李文驰
 * 2018/6/14 10:33
 */
function fixed(n) {
    return parseFloat(n.toFixed(2));
}

function deepclone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

let vm = new Vue({
    el: '#app',
    data: {
        pid: 1,
        segment_num: 1,
        segment_size: 1,
        resident: 8,
        process_queue: [],
        b2_2_queue: [],
        memory: Array(64),
        // false is fifo, true is lru
        mode: false,
    },
    created: function () {
        for (let i = 0; i < 64; i++) {
            this.memory[i] = -1;
        }
    },
    methods: {
        // 创建一个pcb进程
        create_process: function () {
            let new_process = {
                pid: this.pid,
                segment_num: this.segment_num,
                segment_size: this.segment_size,
                inmemory: Array(this.segment_num * this.segment_size),
                FIFO: [],
            };
            let size = new_process.segment_num * new_process.segment_size;
            for (let i = 0; i < size; i++) {
                new_process.inmemory[i] = -1;
            }
            // 如果进程总页数小于等于8，全部装入内存，否则装入前8页
            size = size > 8 ? 8 : size;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < 64; j++) {
                    // 在物理内存找到一个空的页
                    if (this.memory[j] == -1) {
                        this.memory[j] = [new_process.pid, parseInt(i / new_process.segment_size), i % new_process.segment_size];
                        new_process.inmemory[i] = j;
                        new_process.FIFO.push(i);
                        break;
                    }
                }
            }
            this.process_queue.push(new_process);
            this.pid++;
        },
        // 在b2-2展示
        show_in_b2_2: function (index) {
            this.b2_2_queue = [];
            let this_process = this.process_queue[index];
            let x = this_process.segment_num;
            let y = this_process.segment_size;
            for (let i = 0; i < x; i++) {
                for (let j = 0; j < y; j++) {
                    this.b2_2_queue.push({
                        pid: this_process.pid,
                        d: i,
                        y: j,
                        exist: this_process.inmemory[i * y + j] == -1 ? '否' : this_process.inmemory[i * y + j],
                    });
                }
            }
        },
        // 置换或提示已在驻留集中
        displace: function (pid, d, y) {
            let p = this.process_queue[pid - 1];
            let m = p.segment_size;
            // index为逻辑偏移量
            let index = d * m + y;
            // 已在内存中
            if (p.inmemory[index] != -1) {
                this.$message('已在驻留集中');
                // LRU算法，要调换一次顺序
                if (this.mode == true) {
                    let pos = p.FIFO.findIndex(e => {
                        return e == index;
                    });
                    if (pos != -1) {
                        p.FIFO.push(p.FIFO[pos]);
                        p.FIFO.splice(pos, 1);
                    }
                }
            }
            // 不在内存中
            else {
                // 替换
                let first_come_index = p.FIFO.shift();
                p.inmemory[index] = p.inmemory[first_come_index];
                p.inmemory[first_come_index] = -1;
                this.memory[p.inmemory[index]][1] = d;
                this.memory[p.inmemory[index]][2] = y;
                p.FIFO.push(index);
            }
            this.show_in_b2_2(pid - 1);
        },
    },
});