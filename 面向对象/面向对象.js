var teachers = []
var students = []

class Person {
    constructor(name) {
        this.name = name
    }
}

class Student extends Person {
    constructor(name) {
        super(name)
        this.myteacher = null
        this.mydiv = null
    }

    Speak() {
        alert(this.name + '正在发言')
        return this.name + 'speaking'
    }

    selectCourse() {
        if(teacherlist.style.display == "block")
            teacherlist.style.display = "none"
        else
            teacherlist.style.display = "block"
        //当一个学生选择了一个老师，给这个老师的管理列表添加这个选他的学生
        var teacherlist_child = teacherlist.childNodes
        var thisstu = this
        for (var i = 0; i < teacherlist_child.length; i++) {
            teacherlist_child[i].onclick = function(){
                if(thisstu.myteacher != null)
                {
                    var pos = thisstu.myteacher.management.indexOf(thisstu)
                    if(pos != -1)
                        thisstu.myteacher.management.splice(pos, 1)
                }
                teachers[parseInt(this.id)].management.push(thisstu)
                thisstu.myteacher = teachers[parseInt(this.id)]

                if(thisstu.mydiv.childNodes.length == 3) {
                    thisstu.mydiv.appendChild(document.createTextNode("已选教师"+this.id))
                }
                else {
                    thisstu.mydiv.removeChild(thisstu.mydiv.lastChild)
                    thisstu.mydiv.appendChild(document.createTextNode("已选教师"+this.id))
                }
                if(teacherlist.style.display == "block")
                teacherlist.style.display = "none"
                else
                teacherlist.style.display = "block"
            }
        }
    }
}
class Teacher extends Person {
    constructor(name) {
        super(name)
        this.management = []
        this.mydiv = null
        this.isInClass = false
    }

    beginClass() {
        this.isInClass = true
        if(this.management.length > 0)
        {
            //1.禁用其他老师的全部按钮和自己的上课按钮
            for (var i = 0; i < teachers.length; i++) {
                if(teachers[i] != this)
                {
                    // var needban = document.getElementById('teacher'+i)
                    // needban.childNodes[1].disabled = "disabled"
                    // needban.childNodes[2].disabled = "disabled"
                    teachers[i].mydiv.childNodes[1].disabled = "disabled"
                    teachers[i].mydiv.childNodes[2].disabled = "disabled"
                }
                else {
                    var needban = document.getElementById('teacher'+i)
                    needban.childNodes[1].disabled = "disabled"
                }
            }
            //2.禁用选改课的同学的全部按钮
            for (var i = 0; i < this.management.length; i++) {
                this.management[i].mydiv.childNodes[1].disabled = "disabled"
                this.management[i].mydiv.childNodes[2].disabled = "disabled"
            }
        }
        else alert('您没有学生！')
        return 'class begins'
    }
    endClass() {
        for (var i = 0; i < teachers.length; i++) {
            teachers[i].mydiv.childNodes[1].disabled = ""
            teachers[i].mydiv.childNodes[2].disabled = ""
        }
        //2.启用选改课的同学的全部按钮
        for (var i = 0; i < this.management.length; i++) {
            this.management[i].mydiv.childNodes[1].disabled = ""
            this.management[i].mydiv.childNodes[2].disabled = ""
        }
    }
}


function initPane()
{
    var m = document.getElementById('m').value
    var n =  document.getElementById('n').value
    if(m=='' || n=='') {
        return;
    }



    //生成左边老师列表页面
    var leftpane = document.getElementById('left')
    var rightpane = document.getElementById('right')
    var teacherlist = document.getElementById('teacherlist')
    var str = ''
    var beginclass = '<button type="button" class="btn btn-default btn1">上课</button>'
    var endclass = '<button type="button" class="btn btn-default btn2">下课</button>'
    for(var i = 0; i < parseInt(m); i++) {
        str += '<div id="teacher'+i+'">教师'+i+beginclass+endclass+'</div>'
        var teacher = new Teacher('教师'+i)
        teachers.push(teacher)
    }
    leftpane.innerHTML = str



    //生成右边学生列表页面
    str = ''
    var speak = '<button type="button" class="btn btn-default btn3">说话</button>'
    var selectcourse = '<button type="button" class="btn btn-default btn4">选课</button>'
    for(var i = 0; i < parseInt(n); i++) {
        str += '<div id="student'+i+'">学生'+i+speak+selectcourse+'</div>'
        var student = new Student('学生'+i)
        students.push(student)
    }
    rightpane.innerHTML = str



    //生成选老师页面
    str = ''
    for(var i = 0; i < parseInt(m); i++) {
        str += '<div id='+i+' class="point">老师'+i+'</div>'
    }
    teacherlist.innerHTML = str



    //添加一些动作事件
    if(n+m > 0) {
        //为说话按钮 添加动作监听事件
        var btn3s = document.getElementsByClassName('btn3')
        for (var i=0; i<btn3s.length; i++) {
            btn3s[i].addEventListener('click', function(){
                students[parseInt(this.parentNode.id.substring(7))].Speak()
            })
        }

        //为选课按钮添加动作监听事件
        var btn4s = document.getElementsByClassName('btn4')
        for (var i=0; i<btn4s.length; i++) {
            btn4s[i].addEventListener('click', function(){
                students[parseInt(this.parentNode.id.substring(7))].selectCourse()
            })
        }

        //为上课按钮添加动作监听事件
        var btn1s = document.getElementsByClassName('btn1')
        for (var i = 0; i < btn1s.length; i++) {
            btn1s[i].addEventListener('click', function(){
                teachers[parseInt(this.parentNode.id.substring(7))].beginClass()
            })
        }

        //为下课按钮添加动作监听事件
        var btn2s = document.getElementsByClassName('btn2')
        for (var i = 0; i < btn2s.length; i++) {
            btn2s[i].addEventListener('click', function(){
                teachers[parseInt(this.parentNode.id.substring(7))].endClass()
            })
        }
    }
    adddiv()
}


function adddiv()
{
    for (var i = 0; i < teachers.length; i++) {
        teachers[i].mydiv = document.getElementById('teacher'+i)
    }
    for (var i = 0; i < students.length; i++) {
        students[i].mydiv = document.getElementById('student'+i)
    }
}
