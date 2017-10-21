
    month_day = [31,28,31,30,31,30,31,31,30,31,30,31]
    var selectelse = false
    var date = new Date()
    var initdata = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        week_day: date.getDay()==0?7:date.getDay(),
    }
    var nowdata = {
        year: initdata.year,
        month: initdata.month,
        day: initdata.day,
    }

    var div_year = document.getElementsByClassName('year')[0]
    div_year.innerText = initdata.year
    var div_month = document.getElementsByClassName('month')[0]
    div_month.innerText = initdata.month
    initContent()

    function selectDay() {
        nowdata.year = div_year.innerText
        nowdata.month = div_month.innerText
        nowdata.day = this.innerText
        var nowaday_div = document.getElementsByClassName('active')
        if(nowaday_div.length == 0) {
            this.classList.add('active')
            this.classList.remove('day-select')
            this.removeEventListener('click', selectDay, false)
        }
        else {
            nowaday_div[0].addEventListener('click', selectDay)
            nowaday_div[0].classList.add('day-select')
            nowaday_div[0].classList.remove('active')
            console.log(nowaday_div);
            this.classList.add('active')
            this.classList.remove('day-select')
            this.removeEventListener('click', selectDay, false)
        }
    }

    function initContent()
    {
        var divs = document.getElementsByClassName('day')
        for (var i = 0; i < divs.length; i++) {
            divs[i].innerText = ''
            divs[i].classList.remove('active')
            divs[i].classList.remove('day-select')
			divs[i].classList.remove('cant-select')
            divs[i].removeEventListener('click', selectDay,false)
        }
        month_day[1] = 28
        var isRunYear = div_year.innerText
        if(((isRunYear%4==0)&&(isRunYear%100!=0))||isRunYear%400==0) {
            month_day[1] = 29
        }
        date = new Date()
        date.setFullYear(parseInt(div_year.innerText), parseInt(div_month.innerText)-1, 1)
        console.log(date);
        var startWeek = date.getDay()
        startWeek = startWeek==0?7:startWeek
        var j = 1
        for (var i = startWeek-1; i < startWeek-1+month_day[parseInt(div_month.innerText)-1]; i++) {
            divs[i].innerText = j++
            if(parseInt(div_year.innerText)>initdata.year)
            {
                divs[i].classList.add('day-select')
                divs[i].addEventListener('click', selectDay,false)
            }
            else if(parseInt(div_year.innerText)==initdata.year && parseInt(div_month.innerText)>initdata.month)
            {
                divs[i].classList.add('day-select')
                divs[i].addEventListener('click', selectDay,false)
            }
            else if(parseInt(div_year.innerText)==initdata.year && parseInt(div_month.innerText)==initdata.month && j-1 > initdata.day)
            {
                divs[i].classList.add('day-select')
                divs[i].addEventListener('click', selectDay,false)
            }
			else if(parseInt(div_year.innerText)==initdata.year && parseInt(div_month.innerText)==initdata.month && j-1==initdata.day) {
				divs[i].classList.add('day-select')
                divs[i].addEventListener('click', selectDay,false)
			}
			else {
                divs[i].classList.add('cant-select')
            }
            if(div_year.innerText==nowdata.year && div_month.innerText==nowdata.month && j-1 == nowdata.day) {
                divs[i].classList.add('active')
				divs[i].classList.remove('day-select')
				divs[i].removeEventListener('click', selectDay)
            }
        }
    }

    var btns = document.getElementsByClassName('btn')

    btns[0].addEventListener('click', function(){
        if(div_year.innerText == 1970) {
            alert('年份不能小于1970')
        }
        else {
            div_year.innerText--
        }
        initContent()
    })
    btns[1].addEventListener('click', function(){
        if(div_year.innerText == initdata.year+30) {
            alert('年份不能大于'+(initdata.year+30).toString())
        }
        else {
            div_year.innerText++
        }
        initContent()
    })
    btns[2].addEventListener('click', function(){
        if(div_month.innerText == 1) {
            if(div_year.innerText == 1970) {
                alert('年份不能小于1970')
            }
            else {
                div_month.innerText = 12
                div_year.innerText--
            }
        }
        else {
            div_month.innerText--
        }
        initContent()
    })
    btns[3].addEventListener('click', function(){
        if(div_month.innerText == 12) {
            if(div_year.innerText == initdata.year+30) {
                alert('年份不能大于'+(initdata.year+30).toString())
            }
            else {
                div_month.innerText = 1
                div_year.innerText++
            }
        }
        else {
            div_month.innerText++
        }
        initContent()
    })
