//ДИСКЛЕЙМЕР!!! если не поймёшь, это нормально: тут не так много комментариев)))
document.addEventListener('DOMContentLoaded', function() {
    
    let nav = document.querySelector('.nav'), //nav menu
        list = document.querySelectorAll('li'),
        sections = document.querySelectorAll('section');

    nav.addEventListener('click', function(e) {
        if (e.target && e.target.matches('li')) {
            burger.classList.toggle('nav__burger-active');
            nav.classList.toggle('nav-active'); 
            list.forEach(function(item) {
                item.classList.remove('active');
            });
            sections.forEach(function(item) {
                item.classList.remove('active-section');
            });

            e.target.classList.add('active');
            for (let i = 0; i < list.length; i++) {
                if (list[i].className == 'active') {
                    sections[i].classList.add('active-section');
                }
            }
        }
    });

    let burger =  document.getElementById('burger');
    
    burger.onclick = () => {
        burger.classList.toggle('nav__burger-active');
        nav.classList.toggle('nav-active'); 
    };


    //кнопка "ещё..."
    let budgetBox = document.querySelectorAll('.budget__item-wrapper'),
        more = document.querySelectorAll('.button_more');

    more.forEach(function(item, index) {
        item.addEventListener('click', function(e) {
            if (e.target && e.target.matches('button.button_active')) {
                budgetBox[index].style.height = 235 + 'px';
                e.target.classList.remove('button_active');
            } else {
                budgetBox[index].style.height = budgetBox[index].scrollHeight + 'px';
                e.target.classList.add('button_active');
            }
        });
    });

    //overlay
    let using = document.querySelectorAll('.button_w100p'),
        overlay = document.querySelector('.overlay'),
        close = document.getElementById('close');

    let index = 0;

    using.forEach(function(item, i) {
        item.onclick = function() {
            overlay.style.display = 'block';
            index = i;
        };
    });

    //percent 
    let earn = document.getElementById('earn'),
        waste = document.getElementById('waste'),
        balance = document.getElementById('account-score');

    let greenStrip = document.querySelector('.progressbar__strip_green'),
        violetStrip = document.querySelector('.progressbar__strip_violet');
    
    //bills
    let form = document.forms[1],
        formBtns = document.querySelector('.form__wrapper');

    let bills = document.querySelectorAll('.bill__score');


    formBtns.addEventListener('click', function(e) {
        let count;
        
        if (e.target && e.target.matches('[data-use = use]')) {
            count = 0;
        } else {
            count = 1;
        }
        addToCategory(form.category.value, form.score.value, count);
        countBalance(balance);
        toClose();
        moveTo(0);
        addButton(count);
    });

    //удалить
    let row = document.querySelectorAll('.budget__item-row:not(.table-title)');

    row.forEach(function(item) {
        item.firstElementChild.addEventListener( 'click', deleteRow );
    });

    //планы
    let formTwo = document.forms[0];

    document.querySelector('.button_large').addEventListener('click', function() {
        let name = formTwo.name.value,
            score = formTwo.score.value,
            isAdd = document.getElementsByName('operation')[0].checked; //переменная, куда запишется, true, если пользователь пополняет и false, если тратит
        
        let planeItem = new PlaneItem(name, score, isAdd); //смысла в объекте особого нет, просто захотел попробовать на реальном примере
        
        addItem(planeItem);
    });

    //калькулятор(да,детка)
    let calcBtn = document.querySelectorAll('.operation'),
        calcTables = document.querySelectorAll('.calculator__table:not(.calculator__result)'),
        calcResult = document.querySelector('.calculator__result'),
        calcStack = {
            first: 0,
            second: 0,
            operator: 0
        },
        clicker = 0, //отвечает за строки с цифрами и оператором
        checked = false; //смотрит, вызывался ли уже оператор(нужно для функции стирани последнего символа)
    
    calcBtn.forEach(function(item) { //тут мы вводим значения с оператором
        item.addEventListener('click', function(e) {
            calcResult.textContent = '0.00';
            if (clicker < 3) {
                if (!e.target.matches('.calculator__btn_indigo')) { //если это не оператор, то вписываем цифру
                    calcTables[clicker].textContent += e.target.textContent; 
                    checked = false;
                } else { //если оператор, то вписываем оператор и сразу переносим на следующую строку, где вписываем второе число
                    clicker++;
                    calcTables[clicker++].textContent = e.target.textContent;
                    checked = true;
                }    
            } 
        });
    });

    document.getElementById('equal').addEventListener('click', function() { //нажимаем на равно
        calcStack.first = +calcTables[0].textContent;// здесь мы вписываем
        calcStack.operator = calcTables[1].textContent;// значения чисел и оператор
        calcStack.second = +calcTables[2].textContent;// из строк калькулятора

        let a = calcStack.first,
            b = calcStack.second,
            result;

        console.log(calcStack);

        switch (calcStack.operator) { //в зависимости от оператора выбираем, что сделать с числами
            case '/':
                result = divide(a, b);
                break;
            case '*':
                result = multiply(a, b);
                break;
            case '-':
                result = residual(a, b);
                break;
            case '+':
                result = sum(a, b);
                break; 
            case '%':
                result = percent(a, b);
                break;
        }
        calcResult.textContent = result; //выводим результат
    });

    document.getElementById('clear').addEventListener('click', function() {
        for (let key in calcStack) {
            calcStack[key] = 0;
        }
        calcTables.forEach(function(item) {
            item.textContent = '';
        });
        calcResult.textContent = '0.00';
        clicker = 0;
    });

    document.getElementById('delete').addEventListener('click', function() {
        let str = calcTables[clicker].textContent;
        if (checked || str == '') {
            calcTables[1].textContent = '';
            clicker = 0;
        } else {
            calcTables[clicker].textContent = str.slice(0, str.length - 1);
        }
    });


    
    //функции
    function divide(a, b) {
        return a / b;
    }
    function multiply(a, b) {
        return a * b;
    }
    function residual(a, b) {
        return a - b;
    }
    function sum(a, b) {
        return a + b;
    }
    function percent(a ,b) {
        return a / b * 100;
    }
    function doSmth(target) { //работает с секцией планы
        if ( target && target.matches('button.delete') ) { //удаляет при нажатии
            target.parentElement.parentElement.remove();
        } else if ( target && target.matches('button.add') ) {
            let name = formTwo.name.value,
                score = formTwo.score.value,
                isAdd = +document.getElementsByName('operation')[0].checked;
            addToCategory(name, score, isAdd);
            target.parentElement.parentElement.remove();
            moveTo(0);
            addButton(isAdd);
        } //выполняет при нажатии
        countBalance(balance);
    }
    function addToCategory(valueName, valueScore, a) { //добавляет новую категорию или плюсует к существующей
        let collection = budgetBox[a].children; //коллекция строк

        if (a == 0) {
            waste.textContent = parseFloat(waste.textContent) + +valueScore + " руб";
            bills[index].textContent = parseFloat(bills[index].textContent) - +valueScore + " руб";
        } else {
            earn.textContent = +valueScore + parseFloat(earn.textContent) + " руб";
            bills[index].textContent = +valueScore + parseFloat(bills[index].textContent) + " руб";
        }

        for ( let item of collection ) {
            let nameCategory = item.firstElementChild.textContent.toLowerCase(), //имя строки
                countCategory = item.lastElementChild.textContent; //значение

            if ( nameCategory == valueName.toLowerCase() ) { //если имя строки совпадает с введённым значением, то добавляем введённое количество денег
                item.lastElementChild.textContent = +valueScore + parseFloat(countCategory) + ' руб';
                return;
            } 
        }
        
        addElement(valueName, valueScore, collection);
    }
    function addItem(item) { //функция работает с секцией планы
        let wrap = document.querySelectorAll('.plans__item');
        let div = wrap[wrap.length - 1].cloneNode(true); 
        div.firstElementChild.firstElementChild.textContent = item.category; 
        div.firstElementChild.lastElementChild.textContent = item.score + ' руб'; 
        if (item.isAdd) {
            div.classList.add('plans__item_green');
        }
        document.querySelectorAll('.plans__item')[0].before(div);
        div.addEventListener('click', function(e) {
            doSmth(e.target);
        });//обработка событий на кнопки
    }
    function PlaneItem(category, score, isAdd) {
        this.category = category;
        this.score = score;
        this.isAdd = isAdd;
    }
    function deleteRow() {
        let rowsLength = this.parentElement.parentElement.children.length; //коллекция данных конкретных строк в таблице
        let wrapper = this.parentElement.parentElement; //конкретная обёртка
        if ( confirm('Вы уверены? Категория будет удалена, но все счета останутся в изначальном виде.') ) {
            this.parentElement.remove();
            rowsLength -= 1; // уменьшаем количество строк на 1
            row = document.querySelectorAll('.budget__item-row:not(.table-title)'); //обновление массива row
            countBalance(balance);
            if ( rowsLength <= 6 ) { //если в конкретной таблице мало строк, то мы сворачиваем её
                wrapper.style.height = 235 + 'px';
                wrapper.nextElementSibling.classList.remove('button_active'); //убираем у кнопки ещё класс активности
                wrapper.nextElementSibling.style.display = 'none'; //скрываем кнопку ещё
            }
        }  
    }
    function addElement(name, count, item) { //добавляет новую строку
        let div = item[1].cloneNode(true); //new row
        div.firstElementChild.textContent = name; //category
        div.lastElementChild.textContent = count + ' руб'; //score
        item[item.length - 1].after(div);
        row = document.querySelectorAll('.budget__item-row:not(.table-title)'); //обновление массива row
        div.firstElementChild.addEventListener( 'click', deleteRow ); //дабавляем новому элементу обработчик события
    }
    function toClose() {
        overlay.style.display = 'none'; // закрывает overlay
    }
    function countPercent(earn, waste, balance) { //считает процент в первой секции
        earn = parseFloat(earn.textContent);
        waste = parseFloat(waste.textContent);
        balance = parseFloat(balance.textContent);
        
        greenStrip.style.width = (earn / balance) * 100 + '%'; 
        violetStrip.style.width = (waste / balance) * 100 + '%'; 
    }
    function countBalance(balance) { //проверяет счета и записывает новый баланс, а также обновляет процент
        let sum = 0;

        bills.forEach(function(item) {
            sum += parseFloat(item.textContent);
        });
        balance.textContent = sum + " руб";
        countPercent(earn, waste, balance);
    }
    function moveTo(a) { // переносит на нужную вкладку под номером а
        list.forEach(function(item) {
            item.classList.remove('active');
        });
        sections.forEach(function(item) {
            item.classList.remove('active-section');
        });

        list[a].classList.add('active');
        sections[a].classList.add('active-section');
    }
    function addButton(i) { //проверяет, требуется ли добавить кнопку ещё для таблиц
        let scrollHeight = budgetBox[i].scrollHeight,
            height = 235;

        if ( height < scrollHeight - 6) {
            more[i].style.display = 'block';
        } else {
            more[i].style.display = 'none';
        }
    }
    
    //первичные вызовы функций
    addButton(0); //первичная проверка кнопок ещё
    addButton(1);
    countBalance(balance); //первичный подсчёт баланса
    close.onclick = toClose; //закрытые оверлея
});

// ВАЖНО!!! Вот чему я научился 27.09.2019: если нужно использовать именованную
// функцию в обработчике событий в данном контексте, то можно использовать либо 
//this, либо обернуть именованную функцию в безымянную.